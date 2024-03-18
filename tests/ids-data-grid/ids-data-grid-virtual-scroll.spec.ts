import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridCell from '../../src/components/ids-data-grid/ids-data-grid-cell';

test.describe('IdsDataGrid virtual scroll tests', () => {
  const url = '/ids-data-grid/virtual-scroll.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('functionality tests', () => {
    test('renders with virtualScroll option', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      expect(await dataGrid.getAttribute('virtual-scroll')).toEqual('true');

      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.virtualScroll = false;
      });

      expect(await dataGrid.getAttribute('virtual-scroll')).toEqual(null);
    });

    test('can reset the virtualScroll option', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows.length)).toEqual(100);
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.virtualScroll = false;
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows.length)).toEqual(1000);
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.virtualScroll = true;
        elem.redraw();
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows.length)).toEqual(100);
    });

    test('can sort with the virtualScroll option', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.setSortColumn('productId');
      });
      const getCellContent = async () => {
        const results = await dataGrid.evaluate((elem: IdsDataGrid) => {
          const textContent = elem.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell[aria-colindex="6"]')?.textContent;
          return textContent;
        });
        return results;
      };
      expect(await getCellContent()).toEqual('0006363725');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.setSortColumn('productId', false);
      });
      expect(await getCellContent()).toEqual('9961491084');
    });

    test('has the right row height for each rowPixelHeight value and virtual scroll settings value', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowHeight)).toEqual('md');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowPixelHeight)).toEqual(41);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.virtualScrollSettings.ROW_HEIGHT)).toEqual(41);

      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.rowHeight = 'sm';
      });

      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowHeight)).toEqual('sm');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowPixelHeight)).toEqual(36);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.virtualScrollSettings.ROW_HEIGHT)).toEqual(36);

      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.rowHeight = 'xs';
      });

      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowHeight)).toEqual('xs');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowPixelHeight)).toEqual(31);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.virtualScrollSettings.ROW_HEIGHT)).toEqual(31);

      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.redrawBody();
      });

      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowPixelHeight)).toEqual(31);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.virtualScrollSettings.ROW_HEIGHT)).toEqual(31);

      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.rowHeight = 'md';
      });

      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowHeight)).toEqual('md');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rowPixelHeight)).toEqual(41);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.virtualScrollSettings.ROW_HEIGHT)).toEqual(41);
    });

    test('setActiveCell should scroll to the row', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.setActiveCell(0, 999);
      });

      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows[0].dataset.index)).toBe('900');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => [...elem.rows].reverse()[0].dataset.index)).toBe('999');
    });

    test('renders additional rows when appendData()', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.appendData(elem.data);
        elem.setActiveCell(0, 1999);
      });

      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.rows[0].dataset.index)).toBe('1900');
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => [...elem.rows].reverse()[0].dataset.index)).toBe('1999');
    });

    test('should select/deselect rows', async ({ page }) => {
      const dataGrid = await page.locator('ids-data-grid');
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.selectRow(999);
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.selectedRows.length)).toBe(1);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.datasource.currentData[999].rowSelected)).toBeTruthy();
      await dataGrid.evaluate((elem: IdsDataGrid) => {
        elem.deSelectRow(999);
      });
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.selectedRows.length)).toBe(0);
      expect(await dataGrid.evaluate((elem: IdsDataGrid) => elem.datasource.currentData[999].rowSelected)).toBeFalsy();
    });
  });
});
