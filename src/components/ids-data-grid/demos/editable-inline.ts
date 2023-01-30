import type IdsDataGrid from '../ids-data-grid.ts';
import type IdsPopupMenu from '../../ids-popup-menu/ids-popup-menu.ts';
import type IdsMenuItem from '../../ids-menu/ids-menu-item.ts';
import '../ids-data-grid.ts';
import type { IdsDataGridColumn } from '../ids-data-grid-column.ts';
import booksJSON from '../../../assets/data/books.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-editable')!;
const rowHeightMenu = document.querySelector<IdsPopupMenu>('#row-height-menu')!;

// Change row height with popup menu
rowHeightMenu?.addEventListener('selected', (e: Event) => {
  const value = (e.target as IdsMenuItem).value;
  if (value !== 'is-list') {
    dataGrid.rowHeight = value as string;
  }
  if (value === 'is-list') {
    dataGrid.listStyle = !dataGrid.listStyle;
  }
});

rowHeightMenu?.addEventListener('deselected', (e: Event) => {
  const value = (e.target as IdsMenuItem).value;
  if (value === 'is-list') {
    dataGrid.listStyle = !dataGrid.listStyle;
  }
});

(async function init() {
  // Do an ajax request
  const url: any = booksJSON;
  const columns: IdsDataGridColumn[] = [];

  // Set up columns
  columns.push({
    id: 'selectionCheckbox',
    name: 'selection',
    sortable: false,
    resizable: false,
    formatter: dataGrid.formatters.selectionCheckbox,
    align: 'center'
  });
  columns.push({
    id: 'rowNumber',
    name: '#',
    formatter: dataGrid.formatters.rowNumber,
    sortable: false,
    resizable: true,
    reorderable: true,
    readonly: true,
    width: 65
  });
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
      inline: true,
      editorSettings: {
        autoselect: true,
        dirtyTracker: true
      }
    }
  });
  columns.push({
    id: 'ledger',
    name: 'Ledger',
    field: 'ledger',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.text
  });
  columns.push({
    id: 'publishDate',
    name: 'Pub. Date',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.date
  });
  columns.push({
    id: 'publishTime',
    name: 'Pub. Time',
    field: 'publishDate',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.time
  });
  columns.push({
    id: 'price',
    name: 'Price',
    field: 'price',
    resizable: true,
    reorderable: true,
    formatter: dataGrid.formatters.decimal,
    formatOptions: { locale: 'en-US' } // Data Values are in en-US
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
      inline: true,
      editorSettings: {
        dirtyTracker: true,
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

  dataGrid.columns = columns;
  const setData = async () => {
    const res = await fetch(url);
    const data = await res.json();
    dataGrid.data = data;
  };

  setData();

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
}());
