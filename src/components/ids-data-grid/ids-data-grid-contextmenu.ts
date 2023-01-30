import { eventPath, findInPath, HTMLElementEvent } from '../../utils/ids-event-path-utils/ids-event-path-utils.ts';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils.ts';
import type IdsPopupMenu from '../ids-popup-menu/ids-popup-menu.ts';
import type IdsDataGrid from './ids-data-grid.ts';

/**
 * Contextmenu arguments interface.
 */
export interface IdsDataGridContextmenuArgs {
  /* Column id */
  columnId?: string;
  /* Column data */
  columnData?: any;
  /* Column index */
  columnIndex?: number;
  /* Column group id */
  columnGroupId?: string;
  /* Column group data */
  columnGroupData?: any;
  /* Column group index */
  columnGroupIndex?: number;
  /* Field data */
  fieldData?: any;
  /* The grid api object */
  grid?: IdsDataGrid;
  /* Is header group */
  isHeaderGroup?: boolean;
  /* The popup menu element attached with contextmenu */
  menuEl?: IdsPopupMenu;
  /* The origin event dispatched */
  menuSelectedEvent?: any;
  /* Row data */
  rowData?: any;
  /* Row index */
  rowIndex?: number,
  /* Type of contextmenu as unique identifier */
  type?: string;
  /* The selected value for menu item */
  menuSelectedValue?: string;
}

/**
 * Selected event type for contextmenu.
 */
export type IdsDataGridContextmenuSelected = HTMLElementEvent<HTMLElement[]> & {
  detail: { value: string }
};

/**
 * Get context menu element
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param {boolean} isHeader menu for header vs body.
 * @returns {IdsPopupMenu|undefined} The menu element.
 */
function getContextmenuElem(this: IdsDataGrid, isHeader = false): IdsPopupMenu | undefined {
  const slotName = isHeader ? 'header-contextmenu' : 'contextmenu';
  const id = isHeader ? this.headerMenuId : this.menuId;
  const data = isHeader ? this.headerMenuData : this.menuData;
  const slot = (): any => this.shadowRoot?.querySelector(`slot[name="${slotName}"]`);
  let menu = slot()?.assignedElements()[0];
  if (!menu && id) {
    menu = this.closest('ids-container')?.querySelector(`#${id}`);
  }
  if (!menu && data) {
    this.insertAdjacentHTML('beforeend', `<ids-popup-menu slot="${slotName}" trigger-type="custom"></ids-popup-menu>`);
    menu = slot()?.assignedElements()[0];
    if (menu) menu.data = data;
  }
  return menu;
}

/**
 * Set compulsory attributes to given menu.
 * @private
 * @param {IdsPopupMenu} menu The menu element.
 * @returns {void}
 */
function setContextmenuCompulsoryAttributes(menu?: IdsPopupMenu): void {
  menu?.popup?.setAttribute('arrow', 'bottom');
  menu?.popup?.setAttribute('align', 'top, left');
  menu?.setAttribute('data-contextmenu-element', '');
}

/**
 * Show contextmenu.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
function showContextmenu(this: IdsDataGrid): boolean {
  const { menu: menuEl, target, callbackArgs } = this.contextMenuInfo;
  let isShow = false;
  if (menuEl && target && callbackArgs) {
    const args = { ...callbackArgs, menuEl };
    if (!this.triggerVetoableEvent('beforemenushow', args)) {
      return isShow;
    }
    menuEl.target = target;
    if (callbackArgs.type === 'header') (menuEl.popup as any).y = 10;
    menuEl.show();
    isShow = true;
    this.triggerEvent('menushow', this, { bubbles: true, detail: args });
  }
  return isShow;
}

/**
 * Get body cell callback arguments.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param  {HTMLElement[]} path List of path element.
 * @param  {HTMLElement} cellEl The cell element.
 * @returns {void}
 */
function contextmenuBodyCellArgs(this: IdsDataGrid, path: HTMLElement[], cellEl: HTMLElement): IdsDataGridContextmenuArgs {
  const rowIndex = stringToNumber(findInPath(path, '[role="row"]')?.getAttribute('data-index'));
  const columnIndex = stringToNumber(cellEl.getAttribute('aria-colindex')) - 1;
  const rowData = this.data[rowIndex];
  const columnData = this.columns[columnIndex];
  const columnId = columnData.id;
  const fieldData = rowData[columnId];

  // The arguments to pass along callback
  return {
    type: 'body-cell',
    rowData,
    rowIndex,
    columnData,
    columnId,
    columnIndex,
    fieldData,
    grid: this
  };
}

/**
 * Get header callback arguments.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param  {HTMLElement} columnheader The column header element.
 * @returns {void}
 */
function contextmenuHeaderArgs(this: IdsDataGrid, columnheader: HTMLElement): IdsDataGridContextmenuArgs {
  const isHeaderGroup = columnheader.hasAttribute('column-group-id');
  // The arguments to pass along callback
  let callbackArgs: IdsDataGridContextmenuArgs = {
    type: 'header',
    isHeaderGroup,
    grid: this
  };
  if (isHeaderGroup) {
    // Header (Group)
    const columnGroupId = columnheader.getAttribute('column-group-id') as string;
    const columnGroupData = this.columnGroupDataById(columnGroupId);
    callbackArgs = {
      ...callbackArgs,
      columnGroupId,
      columnGroupData,
      rowIndex: 0,
      columnGroupIndex: this.columnGroupIdxById(columnGroupId),
    };
  } else {
    // Header (Non-Group)
    const columnId = columnheader.getAttribute('column-id') as string;
    const columnIndex = this.columnIdxById(columnId);
    const columnData = this.columns[columnIndex as number];
    callbackArgs = {
      ...callbackArgs,
      columnId,
      columnIndex,
      columnData,
      rowIndex: this.columnGroups ? 1 : 0,
    };
  }
  return callbackArgs;
}

/**
 * Handle contextmenu.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param {HTMLElementEvent<HTMLElement[]>} e The contextmenu event.
 * @param {IdsPopupMenu} menu The contextmenu element.
 * @param {IdsPopupMenu} headerMenu The header contextmenu element.
 * @returns {void}
 */
function handleContextmenu(
  this: IdsDataGrid,
  e: HTMLElementEvent<HTMLElement[]>,
  menu?: IdsPopupMenu,
  headerMenu?: IdsPopupMenu,
): void {
  const path = eventPath(e);
  if (menu?.visible) menu?.hide();
  if (headerMenu?.visible) headerMenu?.hide();
  this.contextMenuInfo = {};

  let args: { menu?: IdsPopupMenu, target?: HTMLElement, callbackArgs?: IdsDataGridContextmenuArgs } = {};
  const columnheader = findInPath(path, '[role="columnheader"]');
  const cellEl = findInPath(path, '[role="gridcell"]');

  if (cellEl && menu) {
    const callbackArgs = contextmenuBodyCellArgs.apply(this, [path, cellEl]);
    args = { menu, target: cellEl, callbackArgs };
  } else if (columnheader && headerMenu) {
    const callbackArgs = contextmenuHeaderArgs.apply(this, [columnheader]);
    args = { menu: headerMenu, target: columnheader, callbackArgs };
  }

  this.contextMenuInfo = { ...args };

  if (showContextmenu.apply(this)) e.preventDefault();
}

/**
 * Handle selected item for contextmenu.
 * @private
 * @param {IdsDataGrid} this The data grid object.
 * @param {IdsDataGridContextmenuSelected} e The selected item event for contextmenu.
 * @param {IdsPopupMenu} menuEl The menu element for contextmenu.
 * @returns {void}
 */
function handleContextmenuSelectedItem(
  this: IdsDataGrid,
  e: IdsDataGridContextmenuSelected,
  menuEl?: IdsPopupMenu,
): void {
  if (menuEl) {
    const args: IdsDataGridContextmenuArgs = {
      ...this.contextMenuInfo.callbackArgs,
      menuSelectedEvent: e,
      menuSelectedValue: e?.detail?.value,
      menuEl
    };
    this.triggerEvent('menuselected', this, { bubbles: true, detail: args });
  }
}

/**
 * Set contextmenu
 * @param {IdsDataGrid} this The data grid object.
 * @returns {void}
 */
export function setContextmenu(this: IdsDataGrid) {
  this.contextMenuInfo = {};
  const menu: IdsPopupMenu | undefined = getContextmenuElem.apply(this);
  const headerMenu: IdsPopupMenu | undefined = getContextmenuElem.apply(this, [true]);

  if (menu || headerMenu) {
    setContextmenuCompulsoryAttributes(menu);
    setContextmenuCompulsoryAttributes(headerMenu);

    // Contextmenu for header, header group and body cells.
    this.offEvent('contextmenu.datagrid', this.container);
    this.onEvent('contextmenu.datagrid', this.container, (e: HTMLElementEvent<HTMLElement[]>) => {
      handleContextmenu.apply(this, [e, menu, headerMenu]);
    });

    // Selected item for body cells.
    if (menu) {
      this.offEvent('selected.datagrid-contextmenu-item', menu);
      this.onEvent('selected.datagrid-contextmenu-item', menu, (e: IdsDataGridContextmenuSelected) => {
        handleContextmenuSelectedItem.apply(this, [e, menu]);
      });
    }

    // Selected item for header, and header group.
    if (headerMenu) {
      this.offEvent('selected.datagrid-contextmenu-item', headerMenu);
      this.onEvent('selected.datagrid-contextmenu-item', headerMenu, (e: IdsDataGridContextmenuSelected) => {
        handleContextmenuSelectedItem.apply(this, [e, headerMenu]);
      });
    }
  }
}
