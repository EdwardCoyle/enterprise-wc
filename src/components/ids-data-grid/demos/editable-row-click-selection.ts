import type IdsDataGrid from '../ids-data-grid';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu';
import type IdsMenuItem from '../../ids-menu/ids-menu-item';
import '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-editable')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

// Change row height with popup menu
rowHeightMenu?.addEventListener('selected', (e: Event) => {
  dataGrid.rowHeight = (e.target as IdsMenuItem).value as string;
});

(async function init() {
  // Do an ajax request
  const url: any = booksJSON;
  const columns: IdsDataGridColumn[] = [];
  const pageContainer: any = document.querySelector('ids-container');
  const calendar = pageContainer.localeAPI.calendar();

  // Set up columns
  columns.push({
    id: 'description',
    name: 'Description',
    field: 'description',
    sortable: true,
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        validate: 'required'
      }
    },
    readonly(row: number) {
      return row % 2 === 0;
    },
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: [/[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/, /[a-zA-Z]/]
      }
    },
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.date,
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: false,
        mask: 'date'
      }
    }
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.time,
    formatOptions: {
      locale: 'en-US',
      dateFormat: calendar.dateFormat.hour,
      timeStyle: 'short'
    },
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: false,
        mask: 'date',
        maskOptions: {
          format: calendar.dateFormat.hour
        }
      }
    }
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' },
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: 'number',
        maskOptions: {
          allowDecimal: true,
          integerLimit: 3,
          decimalLimit: 2
        }
      }
    },
  });
  columns.push({
    id: 'bookCurrency',
    name: 'Currency',
    field: 'bookCurrency',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.dropdown,
    editor: {
      type: 'dropdown',
      editorSettings: {
        dirtyTracker: true,
        validate: 'required',
        options: [
          {
            id: '',
            label: '',
            value: ''
          },
          {
            id: 'usd',
            label: 'USD',
            value: 'usd'
          },
          {
            id: 'eur',
            label: 'EUR',
            value: 'eur'
          },
          {
            id: 'yen',
            label: 'YEN',
            value: 'yen'
          }
        ]
      }
    }
  });
  columns.push({
    id: 'transactionCurrency',
    name: 'Transaction Currency',
    field: 'transactionCurrency',
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'integer',
    name: 'Price (Int)',
    field: 'price',
    formatter: dataGrid.formatters.integer,
    formatOptions: { locale: 'en-US' }, // Data Values are in en-US
    editor: {
      type: 'input',
      editorSettings: {
        autoselect: true,
        dirtyTracker: true,
        mask: 'number',
        maskOptions: {
          allowDecimal: false,
          integerLimit: 3
        },
        validate: 'required'
      }
    },
  });
  columns.push({
    id: 'location',
    name: 'Location',
    field: 'location',
    formatter: dataGrid.formatters.hyperlink,
    href: '#'
  });
  columns.push({
    id: 'postHistory',
    name: 'Post History',
    field: 'postHistory',
    formatter: dataGrid.formatters.checkbox,
    align: 'center',
    editor: {
      type: 'checkbox',
      editorSettings: {
        dirtyTracker: true,
      }
    },
  });

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };

  await setData();

  // Event Handlers
  dataGrid.addEventListener('beforecelledit', (e: Event) => {
    // Can be vetoed (<CustomEvent>e).detail.response(false);
    console.info(`Edit Started`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('celledit', (e: Event) => {
    console.info(`Currently Editing`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('endcelledit', (e: Event) => {
    console.info(`Edit Ended`, (<CustomEvent>e).detail);
  });

  dataGrid.addEventListener('cancelcelledit', (e: Event) => {
    console.info(`Edit Was Cancelled`, (<CustomEvent>e).detail);
  });

  // Example Buttons
  document.querySelector('#add-row')?.addEventListener('click', () => {
    dataGrid.addRow({ description: 'New Row', ledgder: 'CORE' });

    dataGrid.setActiveCell(0, dataGrid.data.length - 1);
    dataGrid.editFirstCell();
  });

  document.querySelector('#delete-row')?.addEventListener('click', () => {
    dataGrid.selectedRows.reverse().forEach((row: any) => {
      dataGrid.removeRow(row.index);
    });
  });

  document.querySelector('#clear-row')?.addEventListener('click', () => {
    dataGrid.selectedRows.reverse().forEach((row: any) => {
      dataGrid.clearRow(row.index);
    });
  });
}());
