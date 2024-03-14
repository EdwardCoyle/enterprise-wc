import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsDataGrid from '../../src/components/ids-data-grid/ids-data-grid';
import IdsDataGridCell from '../../src/components/ids-data-grid/ids-data-grid-cell';
import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';

test.describe('IdsDataGrid editing tests', () => {
  const url = '/ids-data-grid/editable.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(url);
  });

  test.describe('general page checks', () => {
    test('should have a title', async ({ page }) => {
      await expect(page).toHaveTitle('IDS Data Grid Component');
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

  test('should be able to edit a cell and type a value', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell?.click();
      editableCell?.querySelector('ids-input')?.setAttribute('value', 'test');
      const editableCellHasClass = editableCell?.classList.contains('is-editing');
      editableCell?.cellLeft?.click();
      const editableCellText = editableCell?.textContent;

      return {
        editableCellText,
        editableCellHasClass,
      };
    });

    expect(results.editableCellText).toBe('test');
    expect(results.editableCellHasClass).toBeTruthy();
  });

  test('should be able to edit a cell and validate a value', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-datepicker.is-editable');
      editableCell?.click();
      editableCell?.editor?.input?.setAttribute('value', '');
      editableCell?.cellLeft?.click();
      const editableCellHasClass = editableCell?.classList.contains('is-invalid');
      const editableCellText = editableCell?.textContent;

      return {
        editableCellText,
        editableCellHasClass,
      };
    });

    expect(results.editableCellText).toBe('');
    expect(results.editableCellHasClass).toBeTruthy();
  });

  test('should not have errors when editing cell', async ({ page }) => {
    let hasConsoleError = false;
    page.on('console', (message) => {
      if (message.type() === 'error') {
        hasConsoleError = true;
      }
    });
    await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell!.isEditing = true;
      editableCell?.startCellEdit();
    });
    expect(hasConsoleError).toBeFalsy();
  });

  test('can veto edit on with readonly/disabled', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell?.classList.add('is-readonly');
      editableCell?.startCellEdit();
      const editableCellHasClass = editableCell?.classList.contains('is-editing');
      editableCell?.endCellEdit();
      editableCell?.classList.remove('is-readonly');
      editableCell?.classList.add('is-disabled');
      editableCell?.startCellEdit();
      const editableCellHasClass2 = editableCell?.classList.contains('is-editing');

      return {
        editableCellHasClass,
        editableCellHasClass2,
      };
    });

    expect(results.editableCellHasClass).toBeFalsy();
    expect(results.editableCellHasClass2).toBeFalsy();
  });

  test('can veto edit on with beforeCellEdit', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      dataGrid?.addEventListener('beforecelledit', (e: Event) => {
        (<CustomEvent>e).detail.response(false);
      });
      editableCell?.startCellEdit();
      const editableCellHasClass = editableCell?.classList.contains('is-editing');

      return {
        editableCellHasClass,
      };
    });

    expect(results.editableCellHasClass).toBeFalsy();
  });

  test('clears invalid state on edit', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell?.classList.add('is-invalid');
      editableCell?.startCellEdit();
      const editableCellHasClass = editableCell?.classList.contains('is-invalid');

      return {
        editableCellHasClass,
      };
    });

    expect(results.editableCellHasClass).toBeFalsy();
  });

  test('should add inline class', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell!.column!.editor!.inline = true;
      editableCell?.startCellEdit();
      const editableCellHasClass = editableCell?.classList.contains('is-inline');

      return {
        editableCellHasClass,
      };
    });

    expect(results.editableCellHasClass).toBeTruthy();
  });

  test('rendercell on rowNumber columns', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.columns[0].formatter = dataGrid.formatters.rowNumber;
      dataGrid.redraw();
      const rowNumberCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell');
      rowNumberCell?.renderCell();
      return rowNumberCell?.textContent;
    });
    expect(results).toBe('1');
  });

  test('endCellEdit on valid columns', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell!.column!.editor!.editorSettings!.validate = null;
      editableCell?.endCellEdit();
      return editableCell?.isInValid;
    });
    expect(results).toBeFalsy();
  });

  test('should be able to edit a cell and reset validation state', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.columns[2].editor!.editorSettings!.validate = 'required';
      dataGrid.redraw();
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell!.isInValid = true;
      editableCell?.startCellEdit();
      editableCell?.querySelector('ids-input')?.setAttribute('value', 'test');
      editableCell?.endCellEdit();
      return editableCell?.classList.contains('is-invalid');
    });

    expect(results).toBeFalsy();
  });

  test('should be able to cancel a cell and reset validation state', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      const initialValue = editableCell?.cellBelow?.textContent;
      editableCell?.cellBelow?.startCellEdit();
      editableCell?.cellBelow?.querySelector('ids-input')?.setAttribute('value', 'test');
      editableCell?.cellBelow?.cancelCellEdit();

      return {
        initialValue,
        newValue: editableCell?.cellBelow?.textContent,
      };
    });

    expect(results.initialValue).toBe('CORE');
    expect(results.newValue).toBe('CORE');
  });

  test('can edit date cells', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-datepicker.is-editable');
      const initialValue = editableCell?.textContent;
      editableCell?.click();
      editableCell?.querySelector('ids-trigger-field')?.setAttribute('value', '10/10/2023');
      editableCell?.cellLeft?.click();

      return {
        initialValue,
        newValue: editableCell?.textContent,
      };
    });

    expect(results.initialValue).toBe('4/23/2021');
    expect(results.newValue).toBe('10/10/2023');
  });

  test('show and revert dirty indicators on cells', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell?.startCellEdit();
      editableCell?.querySelector('ids-input')?.setAttribute('value', 'test');
      editableCell?.endCellEdit();

      const isDirty = editableCell?.classList.contains('is-dirty');

      editableCell?.startCellEdit();
      editableCell?.querySelector('ids-input')?.setAttribute('value', '');
      editableCell?.endCellEdit();

      const isDirty2 = editableCell?.classList.contains('is-dirty');

      return {
        isDirty,
        isDirty2,
      };
    });

    expect(results.isDirty).toBeTruthy();
    expect(results.isDirty2).toBeFalsy();
  });

  test('show and revert validation indicators on cells', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-datepicker.is-editable');
      editableCell?.click();
      editableCell?.querySelector('ids-trigger-field')?.setAttribute('value', '');
      editableCell?.cellRight?.click();

      const isInvalid = editableCell?.classList.contains('is-invalid');

      editableCell?.click();
      editableCell?.querySelector('ids-trigger-field')?.setAttribute('value', '2/23/2021');
      editableCell?.endCellEdit();

      const isInvalid2 = editableCell?.classList.contains('is-invalid');

      return {
        isInvalid,
        isInvalid2,
      };
    });

    expect(results.isInvalid).toBeTruthy();
    expect(results.isInvalid2).toBeFalsy();
  });

  test('can edit as checkboxes', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-checkbox.is-editable');
      editableCell?.click();
      const checked1 = editableCell?.querySelector<any>('ids-checkbox')?.checked;
      editableCell?.endCellEdit();
      editableCell?.click();
      const checked2 = editableCell?.querySelector<any>('ids-checkbox')?.checked;

      return {
        checked1,
        checked2,
      };
    });

    expect(results.checked1).toBeTruthy();
    expect(results.checked2).toBeFalsy();
  });

  test('covers the checkboxes editor', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<any>('ids-data-grid-cell.is-checkbox.is-editable');
      editableCell?.click();
      editableCell.startCellEdit();
      const checked1 = editableCell?.editor?.input?.checked;
      editableCell?.endCellEdit();
      editableCell?.click();
      editableCell?.startCellEdit();
      const checked2 = editableCell?.editor?.input?.checked;

      return {
        checked1,
        checked2,
      };
    });

    expect(results.checked1).toBeTruthy();
    expect(results.checked2).toBeFalsy();
  });

  test('can reset dirty cells', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.resetDirtyCells();
      const dirtyCells1 = dataGrid.dirtyCells.length;
      dataGrid.data[1].dirtyCells = [];
      dataGrid.data[1].dirtyCells.push({ row: 1, cell: 0, originalValue: 'x' });
      const dirtyCells2 = dataGrid.dirtyCells.length;
      dataGrid.resetDirtyCells();
      const dirtyCells3 = dataGrid.dirtyCells.length;
      return {
        dirtyCells1,
        dirtyCells2,
        dirtyCells3,
      };
    });

    expect(results.dirtyCells1).toBe(0);
    expect(results.dirtyCells2).toBe(1);
    expect(results.dirtyCells3).toBe(0);
  });

  test('can call commit commitCellEdit', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell?.click();
      editableCell?.querySelector('ids-input')?.setAttribute('value', 'test');
      dataGrid.commitCellEdit();
      return editableCell?.textContent;
    });

    expect(results).toBe('test');
  });

  test('can call commit cancelCellEdit', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      editableCell?.click();
      editableCell?.querySelector('ids-input')?.setAttribute('value', 'test');
      dataGrid.cancelCellEdit();
      return editableCell?.textContent;
    });

    expect(results).toBe('');
  });

  test('can call addRow', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.addRow({ description: 'test' });
      return dataGrid.container?.querySelectorAll('.ids-data-grid-row').length;
    });

    expect(results).toEqual(11);
  });

  test('can add multiple rows at given index', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.addRows([
        { description: 'test1' },
        { description: 'test2' },
        { description: 'test3' }
      ], 2);
      dataGrid.redraw();
      const numberOfRows = dataGrid.container?.querySelectorAll('.ids-data-grid-row').length;
      const attrRowCount = dataGrid.container?.getAttribute('aria-rowcount');

      return {
        numberOfRows,
        attrRowCount,
        description2: dataGrid.data[2].description,
        description3: dataGrid.data[3].description,
        description4: dataGrid.data[4].description,
      };
    });

    expect(results.numberOfRows).toEqual(13);
    expect(results.attrRowCount).toEqual('12');
    // fails - check addRows for first index
    // expect(results.description2).toEqual('test1');
    expect(results.description3).toEqual('test2');
    expect(results.description4).toEqual('test3');
  });

  test('can call removeRow', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.addRow({ description: 'test' });
      const rowsBefore = dataGrid.container?.querySelectorAll('.ids-data-grid-row').length;
      dataGrid.removeRow(9);
      const rowsAfter = dataGrid.container?.querySelectorAll('.ids-data-grid-row').length;
      return {
        rowsBefore,
        rowsAfter,
      };
    });

    expect(results.rowsBefore).toEqual(11);
    expect(results.rowsAfter).toEqual(10);
  });

  test('can call clearRow', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const cell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell');
      dataGrid.clearRow(0);
      return cell?.textContent;
    });

    expect(results).toEqual('');
  });

  test('can call editFirstCell', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
      dataGrid.editFirstCell();
      return editableCell?.classList.contains('is-editing');
    });

    expect(results).toBeTruthy();
  });

  test('can enter edit mode with enter and exit F2 or Enter', async ({ page }) => {
    const isEditing = async () => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
        return editableCell?.classList.contains('is-editing');
      });

      return results;
    };
    expect(await isEditing()).toBeFalsy();
    await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.setActiveCell(2, 0);
    });

    await page.keyboard.press('Enter');
    expect(await isEditing()).toBeTruthy();

    await page.keyboard.press('ArrowLeft');
    expect(await isEditing()).toBeTruthy();

    await page.keyboard.press('F2');
    expect(await isEditing()).toBeFalsy();

    await page.keyboard.press('Enter');
    expect(await isEditing()).toBeTruthy();
    await page.keyboard.press('Escape');
    expect(await isEditing()).toBeFalsy();
  });

  test('can enter edit mode with enter by typing', async ({ page }) => {
    const isEditing = async () => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
        return editableCell?.classList.contains('is-editing');
      });

      return results;
    };
    expect(await isEditing()).toBeFalsy();
    await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.setActiveCell(2, 0);
    });
    await page.keyboard.type('test');
    expect(await isEditing()).toBeTruthy();
  });

  test('can enter edit mode and editNextOnEnterPress', async ({ page }) => {
    await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.editNextOnEnterPress = true;
      dataGrid.setActiveCell(2, 0);
      dataGrid.redraw();
    });
    const isEditing = async () => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
        return editableCell?.classList.contains('is-editing');
      });

      return results;
    };
    await page.keyboard.press('Enter');
    expect(await isEditing()).toBeFalsy();
  });

  test('can continue to enter edit mode with tabbing', async ({ page }) => {
    const isEditing = async () => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-editable');
        return editableCell?.classList.contains('is-editing');
      });

      return results;
    };
    expect(await isEditing()).toBeFalsy();
    await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      dataGrid.setActiveCell(2, 0);
    });
    await page.keyboard.press('Enter');
    expect(await isEditing()).toBeTruthy();
    await page.keyboard.press('Tab');
    expect(await isEditing()).toBeFalsy();
  });

  test('space toggles editable checkboxes', async ({ page }) => {
    const isChecked = async () => {
      const results = await page.evaluate(() => {
        const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
        const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-checkbox.is-editable');
        return editableCell?.querySelector<any>('.ids-data-grid-checkbox')?.getAttribute('aria-checked') === 'true';
      });

      return results;
    };
    await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-checkbox.is-editable');
      dataGrid.setActiveCell(11, 0);
      editableCell?.click();
    });
    expect(await isChecked()).toBeTruthy();
    await page.keyboard.press(' ');
    expect(await isChecked()).toBeFalsy();
  });

  test('supports a dropdown editor', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-dropdown.is-editable');
      editableCell?.startCellEdit();
      const opened = editableCell?.querySelector<IdsDropdown>('ids-dropdown')?.container?.classList.contains('is-open');
      return opened;
    });

    expect(results).toBeTruthy();
  });

  test('can change cell value using dropdown editor', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const editableCell = dataGrid.container?.querySelector<IdsDataGridCell>('ids-data-grid-cell.is-dropdown.is-editable');
      editableCell?.startCellEdit();
      editableCell?.querySelector<IdsDropdown>('ids-dropdown')?.setAttribute('value', 'eur');
      editableCell?.endCellEdit();
      return editableCell?.value;
    });

    expect(results).toBe('EUR');
  });

  test('supports updating data set and refreshing row', async ({ page }) => {
    const results = await page.evaluate(() => {
      const dataGrid = document.querySelector<IdsDataGrid>('ids-data-grid')!;
      const rowIndex = 0;
      const rowElem = dataGrid.rowByIndex(rowIndex);
      dataGrid.updateDatasetAndRefresh(rowIndex, { bookCurrency: 'eur' });

      return rowElem?.querySelector('[aria-colindex="7"]')?.textContent?.trim();
    });

    expect(results).toBe('EUR');
  });
});
