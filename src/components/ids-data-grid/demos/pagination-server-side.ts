import productsJSON from '../../../assets/data/products.json';

import '../ids-data-grid';
import '../../ids-container/ids-container';

import type IdsDataGrid from '../ids-data-grid';
import type { IdsDataGridColumn } from '../ids-data-grid-column';
import type IdsText from '../../ids-text/ids-text';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-paging-server-side')!;
const toolbarTitleText = document.querySelector<IdsText>('#title-text')!;

(async function init() {
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
    id: 'id',
    name: 'ID',
    field: 'id',
    formatter: dataGrid.formatters.text,
    width: 80,
    sortable: true
  });
  columns.push({
    id: 'color',
    name: 'Color',
    field: 'color',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'inStock',
    name: 'In Stock',
    field: 'inStock',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'productId',
    name: 'Product Id',
    field: 'productId',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'productName',
    name: 'Product Name',
    field: 'productName',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'unitPrice',
    name: 'Unit Price',
    field: 'unitPrice',
    formatter: dataGrid.formatters.text,
    sortable: true
  });
  columns.push({
    id: 'units',
    name: 'Units',
    field: 'units',
    formatter: dataGrid.formatters.text,
    sortable: true
  });

  dataGrid.pagination = 'server-side';
  dataGrid.columns = columns;

  // Do an ajax request
  const url: any = productsJSON;
  const response = await fetch(url);
  const data = await response.json();

  const mockServerSideRequest = async (pageNumber = 1, pageSize = 10) => {
    const last = pageNumber * pageSize;
    const start = last - pageSize;
    return {
      results: data.slice(start, start + pageSize),
      totalResults: data.length,
    };
  };

  const populatePaginatedDatagrid = async (pageNumber = 1, pageSize = 10) => {
    const {
      results,
      totalResults,
    } = await mockServerSideRequest(pageNumber, pageSize);

    dataGrid.data = results;
    dataGrid.pageTotal = totalResults;
  };

  await populatePaginatedDatagrid(1, 10); // load data for 1st page

  dataGrid.pager.addEventListener('pagenumberchange', async (e: Event) => {
    console.info(`server-side page-number # ${(<CustomEvent>e).detail.value}`);
    const pageNumber = (<CustomEvent>e).detail.value;
    const pageSize = dataGrid.pageSize;
    await populatePaginatedDatagrid(pageNumber, pageSize);
  });

  dataGrid.pager.addEventListener('pagesizechange', async (e: Event) => {
    console.info(`server-side page-size # ${(<CustomEvent>e).detail.value}`);
    const pageSize = (<CustomEvent>e).detail.value;
    const pageNumber = dataGrid.pageNumber;
    await populatePaginatedDatagrid(pageNumber, pageSize);
  });

  // Updates the toolbar title with number of currently-selected items
  const updateTitleText = () => {
    const selectedRows = dataGrid.selectedRowsAcrossPages;
    toolbarTitleText.textContent = selectedRows.length ? `${selectedRows.length} Result${selectedRows.length > 1 ? 's' : ''}` : '';
  };
  dataGrid.addEventListener('rowselected', updateTitleText);
  dataGrid.addEventListener('rowdeselected', updateTitleText);

  console.info('Loading Time:', window.performance.now());
  console.info('Page Memory:', (window.performance as any).memory);
}());
