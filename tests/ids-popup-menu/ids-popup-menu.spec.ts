import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { ElementHandle, Locator, expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsPopupMenu from '../../src/components/ids-popup-menu/ids-popup-menu';

test.describe('IdsPopupMenu tests', () => {
  const url = '/ids-popup-menu/example.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Popup Menu Component');
    });

    test('should not have errors', async ({ page, browserName }) => {
      if (browserName === 'firefox') return;
      let exceptions = null;
      await page.on('pageerror', (error) => {
        exceptions = error;
      });

      await page.goto(url);
      await page.waitForLoadState();
      await expect(exceptions).toBeNull();
    });
  });

  test.describe('accessibility tests', () => {
    test('should pass an Axe scan', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const accessibilityScanResults = await new AxeBuilder({ page } as any)
        .exclude('[disabled]') // Disabled elements do not have to pass
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test.describe('snapshot tests', () => {
    test('should match innerHTML snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-popup-menu');
      const html = await handle?.evaluate((el: IdsPopupMenu) => el?.outerHTML);
      await expect(html).toMatchSnapshot('popup-menu-html');
    });

    test('should match shadowRoot snapshot', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      const handle = await page.$('ids-popup-menu');
      const html = await handle?.evaluate((el: IdsPopupMenu) => {
        el?.shadowRoot?.querySelector('style')?.remove();
        return el?.shadowRoot?.innerHTML;
      });
      await expect(html).toMatchSnapshot('popup-menu-shadow');
    });

    test('should match the visual snapshot in percy', async ({ page, browserName }) => {
      if (browserName !== 'chromium') return;
      await percySnapshot(page, 'ids-popup-menu-light');
    });
  });

  test.describe('callback tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-popup-menu/load-data.html');
    });

    test('supports async beforeShow', async ({ page }) => {
      await page.evaluate(async () => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        await elem.show();
      });
      await page.waitForFunction(() => document.querySelector<IdsPopupMenu>('ids-popup-menu')?.visible === true);
      const markup: string = await page.evaluate(() => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        return elem.innerHTML;
      });
      expect(markup).toContain('Sub Menu One');
    });
  });

  test.describe('data drive tests', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/ids-popup-menu/data-driven.html');
    });

    test.skip('reverts to markup-driven when provided an empty dataset', async ({ page }) => {
      await page.evaluate(async () => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        await elem.show();
      });
      await page.waitForFunction(() => document.querySelector<IdsPopupMenu>('ids-popup-menu')?.visible === true);
      const markup: string = await page.evaluate(() => {
        const elem = document.querySelector<IdsPopupMenu>('ids-popup-menu')!;
        return elem.innerHTML;
      });
      expect(markup).toContain(' Sub Sub Menu 1');
    });
  });

  test.describe('functionality tests', () => {
    let idsPopupMenu: Locator;

    const isPopupVisible = async (elem: Locator) => {
      const ret = await elem.evaluate((element: IdsPopupMenu) => element.popup?.visible);
      return ret ?? false;
    };

    test.beforeEach(async ({ page }) => {
      idsPopupMenu = await page.locator('#popupmenu');
    });

    test('can set/get align', async () => {
      // data sequence is important
      const testData = [
        { data: 'center', expected: 'center' },
        { data: 'bottom, right', expected: 'bottom, right' },
        { data: 'center, right', expected: 'right' },
        { data: 'middle', expected: 'right' },
        { data: null, expected: 'right' },
      ];
      const popup = await idsPopupMenu.locator('ids-popup').first();

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.align = tData as any;
          return element.align;
        }, data.data)).toEqual(data.expected);
        await expect(popup).toHaveAttribute('align', data.expected);
      }
    });

    test('can get visible', async () => {
      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.visible)).toBeFalsy();

      expect(await idsPopupMenu.evaluate(async (element: IdsPopupMenu) => {
        await element.show();
        return element.visible;
      })).toBeTruthy();

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => {
        element.hide();
        return element.visible;
      })).toBeFalsy();
    });

    test('can set/get maxHeight', async () => {
      const testData = [
        { data: 30, expected: '30px' },
        { data: '100', expected: '100px' },
        { data: 'test', expected: null },
        { data: '300px', expected: '300px' },
        { data: '', expected: null },
        { data: null, expected: null },
      ];

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.maxHeight)).toBeNull();
      await expect(idsPopupMenu).not.toHaveAttribute('max-height');

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.maxHeight = tData as any;
          return element.maxHeight;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsPopupMenu).toHaveAttribute('max-height', data.expected);
        } else {
          await expect(idsPopupMenu).not.toHaveAttribute('max-height');
        }
      }
    });

    test('can set/get positionStyle', async () => {
      const testData = [
        { data: 'viewport', expected: 'viewport' },
        { data: '', expected: 'fixed' },
        { data: 'fixed', expected: 'fixed' },
        { data: null, expected: 'fixed' }
      ];

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.positionStyle)).toEqual('fixed');
      await expect(idsPopupMenu).not.toHaveAttribute('position-style');

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.positionStyle = tData as any;
          return element.positionStyle;
        }, data.data)).toEqual(data.expected);
        if (data.data) {
          await expect(idsPopupMenu).toHaveAttribute('position-style', data.expected);
        } else {
          await expect(idsPopupMenu).not.toHaveAttribute('position-style');
        }
      }
    });

    test('can set/get width', async () => {
      const testData = [
        { data: '100px', expected: '100px' },
        { data: 100, expected: null },
        { data: null, expected: null }
      ];

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.width)).toBeNull();
      await expect(idsPopupMenu).not.toHaveAttribute('width');

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.width = tData as any;
          return element.width;
        }, data.data)).toEqual(data.expected);
        if (data.expected) {
          await expect(idsPopupMenu).toHaveAttribute('width', data.expected);
        } else {
          await expect(idsPopupMenu).not.toHaveAttribute('width');
        }
      }
    });

    test('can set/get x coordinate', async () => {
      const testData = [
        { data: 30, expected: 30 },
        { data: -10, expected: -10 },
        { data: 'test', expected: 0 },
        { data: '100', expected: 100 },
        { data: null, expected: 0 }
      ];
      const popup = await idsPopupMenu.locator('ids-popup').first();

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.x)).toEqual(0);
      await expect(popup).not.toHaveAttribute('x');

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.x = tData as any;
          return element.x;
        }, data.data)).toEqual(data.expected);
        await expect(popup).toHaveAttribute('x', data.expected.toString());
      }
    });

    test('can set/get y coordinate', async () => {
      const testData = [
        { data: 30, expected: 30 },
        { data: -10, expected: -10 },
        { data: 'test', expected: 0 },
        { data: '100', expected: 100 },
        { data: null, expected: 0 }
      ];
      const popup = await idsPopupMenu.locator('ids-popup').first();

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.y)).toEqual(0);
      await expect(popup).not.toHaveAttribute('y');

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.y = tData as any;
          return element.y;
        }, data.data)).toEqual(data.expected);
        await expect(popup).toHaveAttribute('y', data.expected.toString());
      }
    });

    test('can set/get arrow', async () => {
      const defArrow = 'none';
      const testData = [
        { data: 'bottom', expected: 'bottom' },
        { data: '', expected: defArrow },
        { data: 'top', expected: 'top' },
        { data: 'invalid', expected: defArrow },
        { data: null, expected: defArrow }
      ];
      const popup = await idsPopupMenu.locator('ids-popup').first();

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.arrow)).toEqual('none');
      await expect(popup).not.toHaveAttribute('arrow');

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.arrow = tData as any;
          return element.arrow;
        }, data.data)).toEqual(data.expected);
        if (data.expected !== 'none') {
          await expect(popup).toHaveAttribute('arrow', data.expected);
        } else {
          await expect(popup).not.toHaveAttribute('arrow');
        }
      }
    });

    test('can show/hide', async () => {
      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => {
        const res = {
          hidden: element.hidden,
          popup_visible: element.popup?.visible,
          visible: element.visible
        };
        return res;
      })).toEqual({
        hidden: true,
        popup_visible: false,
        visible: false
      });
      await expect(idsPopupMenu).toHaveAttribute('hidden');

      expect(await idsPopupMenu.evaluate(async (element: IdsPopupMenu) => {
        await element.show();
        const res = {
          hidden: element.hidden,
          popup_visible: element.popup?.visible,
          visible: element.visible
        };
        return res;
      })).toEqual({
        hidden: false,
        popup_visible: true,
        visible: true
      });
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');

      expect(await idsPopupMenu.evaluate(async (element: IdsPopupMenu) => {
        await element.hide();
        const res = {
          hidden: element.hidden,
          popup_visible: element.popup?.visible,
          visible: element.visible
        };
        return res;
      })).toEqual({
        hidden: true,
        popup_visible: false,
        visible: false
      });
      await expect(idsPopupMenu).toHaveAttribute('hidden');
    });

    test('can prevent showing of popup menu via beforeshow event', async ({ page }) => {
      await idsPopupMenu.evaluate(async (element: IdsPopupMenu) => {
        (window as any).eventCounter = 0;
        element.addEventListener('beforeshow', (event: any) => {
          event.detail.response(false);
          (window as any).eventCounter++;
        });
        await element.show();
      });
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await idsPopupMenu.evaluate(() => (window as any).eventCounter)).toEqual(1);

      await page.mouse.click(100, 100, { button: 'right' });
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await idsPopupMenu.evaluate(() => (window as any).eventCounter)).toEqual(2);
    });

    test('can trigger selected event', async ({ page, eventsTest }) => {
      await eventsTest.onEvent('#popupmenu', 'selected');
      await page.mouse.click(100, 100, { button: 'right' });
      await idsPopupMenu.locator('ids-menu-item').first().click();
      expect(await eventsTest.isEventTriggered('#popupmenu', 'selected')).toBeTruthy();
    });

    test('can show submenu via selectItem', async () => {
      const menuFive = await idsPopupMenu.locator('#item-five');
      const menuFiveHandle = await menuFive.evaluateHandle((node) => node);
      const subMenuFive = await menuFive.locator('ids-popup-menu').first();

      await expect(idsPopupMenu).toHaveAttribute('hidden');
      await expect(subMenuFive).toHaveAttribute('hidden');

      await idsPopupMenu.evaluate(async (element: IdsPopupMenu, handle) => {
        await element.show();
        element.selectItem(handle);
      }, menuFiveHandle);

      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      await expect(subMenuFive).not.toHaveAttribute('hidden');
    });

    test('can focus on menu item when shown', async () => {
      const menuOne = await idsPopupMenu.locator('ids-menu-item').first();
      const menuOneHandle = await menuOne.evaluateHandle((node) => node);

      await expect(menuOne).not.toHaveAttribute('highlighted');
      const actual = await idsPopupMenu.evaluate(async (element: IdsPopupMenu, handle) => {
        await element.show();
        return document.activeElement!.isSameNode(handle);
      }, menuOneHandle);
      expect(actual).toBeTruthy();
      await expect(menuOne).toHaveAttribute('highlighted');
    });

    test('can set/get triggerType', async () => {
      const defTrig = 'contextmenu';
      const testData = [
        { data: 'click', expected: 'click' },
        { data: 'immediate', expected: 'immediate' },
        { data: 'invalid', expected: defTrig },
        { data: 'hover', expected: 'hover' },
        { data: '', expected: defTrig }
      ];

      expect(await idsPopupMenu.evaluate((element: IdsPopupMenu) => element.triggerType)).toEqual(defTrig);

      for (const data of testData) {
        expect(await idsPopupMenu.evaluate((element: IdsPopupMenu, tData) => {
          element.triggerType = tData;
          return element.triggerType;
        }, data.data)).toEqual(data.expected);
      }
    });

    test('can set triggerElem aside from target', async ({ page }) => {
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();

      // insert an input
      await idsPopupMenu.evaluate((element: IdsPopupMenu) => {
        const input = document.createElement('input')!;
        input.setAttribute('id', 'input-test');
        document.querySelector('ids-container')!.appendChild(input);
        element.triggerType = 'click';
        element.triggerElem = input;
      });

      // click the input element
      const input = page.locator('#input-test');
      await input.waitFor();
      await input.dispatchEvent('click');
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeTruthy();

      // click an element outside the input element
      await page.locator('ids-text').first().dispatchEvent('click');
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeTruthy();
    });

    test('can set target', async ({ page }) => {
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();

      // insert an input
      await idsPopupMenu.evaluate((element: IdsPopupMenu) => {
        const input = document.createElement('input')!;
        input.setAttribute('id', 'input-test');
        document.querySelector('ids-container')!.appendChild(input);
        const button = document.createElement('button')!;
        button.setAttribute('id', 'button-test');
        document.querySelector('ids-container')!.appendChild(button);
        element.triggerType = 'click';
        element.target = input;
      });

      // click the input element
      const input = page.locator('#input-test');
      await input.waitFor();
      await input.dispatchEvent('click');
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeTruthy();

      // click an element outside the input element
      const button = page.locator('#button-test');
      await button.waitFor();
      await button.click({ delay: 100 });
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();
    });

    test('can close popup menu if click outside the menu', async ({ page }) => {
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();

      await page.mouse.click(100, 100, { button: 'right', delay: 30 });
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeTruthy();

      await page.mouse.click(200, 200, { button: 'left', delay: 30 });
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();
    });

    test('can navigate menu with keyboard up and down keys', async ({ page }) => {
      const isActiveElement = async (node: ElementHandle) => {
        const res = await page.evaluate((elem) => document.activeElement!.isSameNode(elem), node);
        return res ?? false;
      };
      const firstLevelMenus = await idsPopupMenu.locator(':scope > ids-menu-group > ids-menu-item').all();
      const handles: ElementHandle[] = [];
      for (let i = 0; i < firstLevelMenus.length; i++) {
        const handle = await firstLevelMenus[i].evaluateHandle((node) => node);
        handles.push(handle);
      }

      // test case strict to 7 first level menus
      expect(firstLevelMenus).toHaveLength(7);

      await page.mouse.click(100, 100, { button: 'right', delay: 30 });
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeTruthy();

      // first element is focused
      expect(await isActiveElement(handles[0])).toBeTruthy();

      // second element is focused
      await page.keyboard.press('ArrowDown');
      expect(await isActiveElement(handles[0])).toBeFalsy();
      expect(await isActiveElement(handles[1])).toBeTruthy();

      // go to the end of the list
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      expect(await isActiveElement(handles[0])).toBeFalsy();
      expect(await isActiveElement(handles[1])).toBeFalsy();
      expect(await isActiveElement(handles[2])).toBeFalsy();
      expect(await isActiveElement(handles[3])).toBeFalsy();
      expect(await isActiveElement(handles[4])).toBeFalsy();
      expect(await isActiveElement(handles[5])).toBeFalsy();
      expect(await isActiveElement(handles[6])).toBeTruthy();

      // after pressing again should return no the first list
      await page.keyboard.press('ArrowDown');
      expect(await isActiveElement(handles[0])).toBeTruthy();
      expect(await isActiveElement(handles[1])).toBeFalsy();
      expect(await isActiveElement(handles[2])).toBeFalsy();
      expect(await isActiveElement(handles[3])).toBeFalsy();
      expect(await isActiveElement(handles[4])).toBeFalsy();
      expect(await isActiveElement(handles[5])).toBeFalsy();
      expect(await isActiveElement(handles[6])).toBeFalsy();
    });

    test('can navigate submenu with keyboard up and down keys', async ({ page }) => {
      const isActiveElement = async (node: ElementHandle) => {
        const res = await page.evaluate((elem) => document.activeElement!.isSameNode(elem), node);
        return res ?? false;
      };
      const menuFive = await idsPopupMenu.locator('#item-five');
      const fiveHandle = await menuFive.evaluateHandle((node) => node);
      const fiveSubMenus = await menuFive.locator(':scope > ids-popup-menu > ids-menu-group > ids-menu-item').all();
      const subHandles = [];
      for (let i = 0; i < fiveSubMenus.length; i++) {
        const handle = await fiveSubMenus[i].evaluateHandle((node) => node);
        subHandles.push(handle);
      }

      // test case strict to 3 sub menus on the fifth menu
      expect(fiveSubMenus).toHaveLength(3);

      await idsPopupMenu.evaluate(async (element: IdsPopupMenu, target) => {
        await element.show();
        target.focus();
      }, fiveHandle);

      // press right to open and navigate to the sub menu
      await page.keyboard.press('ArrowRight');
      expect(await isActiveElement(fiveHandle)).toBeFalsy();
      expect(await isActiveElement(subHandles[0])).toBeTruthy();
      expect(await isActiveElement(subHandles[1])).toBeFalsy();
      expect(await isActiveElement(subHandles[2])).toBeFalsy();

      // press down to choose on the sub menu
      await page.keyboard.press('ArrowDown');
      expect(await isActiveElement(fiveHandle)).toBeFalsy();
      expect(await isActiveElement(subHandles[0])).toBeFalsy();
      expect(await isActiveElement(subHandles[1])).toBeTruthy();
      expect(await isActiveElement(subHandles[2])).toBeFalsy();

      // press left to close the sub menu
      await page.keyboard.press('ArrowLeft');
      expect(await isActiveElement(fiveHandle)).toBeTruthy();
      expect(await isActiveElement(subHandles[0])).toBeFalsy();
      expect(await isActiveElement(subHandles[1])).toBeFalsy();
      expect(await isActiveElement(subHandles[2])).toBeFalsy();
    });

    test('can close menu with escape key', async ({ page }) => {
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();

      await page.mouse.click(100, 100, { button: 'right', delay: 30 });
      await expect(idsPopupMenu).not.toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeTruthy();

      await page.keyboard.press('Escape', { delay: 30 });
      await expect(idsPopupMenu).toHaveAttribute('hidden');
      expect(await isPopupVisible(idsPopupMenu)).toBeFalsy();
    });
  });
});
