import { customElement, scss } from '../../core/ids-decorators';
import IdsInput from '../ids-input/ids-input';
import '../ids-toolbar/ids-toolbar';
import Base from './ids-list-builder-base';
import styles from './ids-list-builder.scss';
import IdsDraggable from '../ids-draggable/ids-draggable';

/**
 * IDS ListBuilder Component
 * @type {IdsListBuilder}
 * @inherits IdsListView
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
@customElement('ids-list-builder')
@scss(styles)
export default class IdsListBuilder extends Base {
  /**
   * Call the constructor and then initialize
   */
  constructor() {
    super();
  }

  /** Active editor of the selected list item */
  #selectedLiEditor: any;

  /**
   * A clone of the list item being dragged,
   * it appears during drag to help visualize where the dragged item's position
   */
  placeholder: any;

  connectedCallback() {
    this.sortable = true;
    this.selectable = 'single';
    // list-builder is not designed to handle thousands of items, so doesnt support virtual scroll
    this.virtualScroll = false;
    this.itemHeight = 46; // hard-coded
    this.#attachEventListeners();
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<string>} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      ...super.attributes,
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `
      <div class="ids-list-builder">
          <div class="header">
            <ids-toolbar tabbable="true">
              <ids-toolbar-section type="buttonset">
                <ids-button id="button-add">
                  <span slot="text" class="audible">Add List Item</span>
                  <ids-icon slot="icon" icon="add"></ids-icon>
                </ids-button>
                <div class="separator"></div>
                <ids-button id="button-up">
                  <span slot="text" class="audible">Move Up List Item</span>
                  <ids-icon slot="icon" icon="arrow-up"></ids-icon>
                </ids-button>
                <ids-button id="button-down">
                  <span slot="text" class="audible">Move Down List Item</span>
                  <ids-icon slot="icon" icon="arrow-down"></ids-icon>
                </ids-button>
                <div class="separator"></div>
                <ids-button id="button-edit">
                  <span slot="text" class="audible">Edit List Item</span>
                  <ids-icon slot="icon" icon="edit"></ids-icon>
                </ids-button>
                <ids-button id="button-delete">
                  <span slot="text" class="audible">Delete Down List Item</span>
                  <ids-icon slot="icon" icon="delete"></ids-icon>
                </ids-button>
              </ids-toolbar-section>
            </ids-toolbar>
          </div>
          ${super.template()}
      </div>
    `;
  }

  get data(): Array<any> {
    return super.data;
  }

  /**
   * Set the data set of the list
   * @param {Array<any>} val The list of items
   */
  set data(val: Array<any>) {
    super.data = val;

    // need to reattach event listeners when new data set dynamically adds list items
    this.#attachEventListeners();
  }

  /**
   * Attaches all the listeners which allow for clicking,
   * dragging, and keyboard interaction with the list items
   * @private
   * @returns {void}
   */
  #attachEventListeners(): void {
    this.#attachClickListeners(); // for toolbar buttons
    this.#attachKeyboardListeners(); // for selecting/editing list items
  }

  /**
   * Removes and unfocuses any active list item editor after updating the list item's value
   * @private
   * @returns {void}
   */
  #unfocusAnySelectedLiEditor(): void {
    if (this.#selectedLiEditor) {
      this.#removeSelectedLiEditor();
      this.updateDataFromDOM();
    }
  }

  /**
   * Helper function to update the list item inner text with the editor's input value
   * @private
   * @returns {void}
   */
  #updateSelectedLiWithEditorValue(): void {
    this.selectedLi.querySelector('ids-text').innerHTML = this.#selectedLiEditor.value;
  }

  /**
   * Helper function to remove the editor element from the DOM
   * @private
   * @returns {void}
   */
  #removeSelectedLiEditor(): void {
    this.offEvent('keyup', this.#selectedLiEditor);
    this.#selectedLiEditor.parentNode.classList.remove('is-editing');
    this.#selectedLiEditor.remove();
    this.#selectedLiEditor = null;
  }

  /**
   * Helper function to insert an editor into the DOM and hide the inner text of the list item
   * @param {boolean | null} newEntry whether or not this is an editor for a new or pre-existing list item
   * @private
   * @returns {void}
   */
  #insertSelectedLiWithEditor(newEntry: boolean | null = false): void {
    if (this.selectedLi) {
      if (!this.#selectedLiEditor) {
        const i = new IdsInput();

        // insert into DOM
        this.selectedLi.insertBefore(i, this.selectedLi.querySelector('ids-text'));

        // hide inner text
        this.selectedLi.classList.add('is-editing');

        // set the value of input
        this.#selectedLiEditor = i;
        i.value = newEntry ? 'New Value' : this.selectedLi.querySelector('ids-text').innerHTML;
        i.autoselect = 'true';
        i.noMargins = 'true';
        i.colorVariant = 'alternate';
        i.focus();

        // update inner text on keyup
        this.onEvent('keyup', i, () => this.#updateSelectedLiWithEditorValue());
      } else {
        this.#selectedLiEditor.focus();
      }
    }
  }

  /**
   * Add/remove the editor in one function,
   * used when `Enter` key is hit on a selected list item
   * @private
   * @returns {void}
   */
  #toggleEditor(): void {
    if (this.selectedLi) {
      if (!this.#selectedLiEditor) {
        this.#insertSelectedLiWithEditor();
      } else {
        this.#unfocusAnySelectedLiEditor();
      }
      this.focusLi(this.selectedLi);
    }
  }

  /**
   * Overrides the onClick() to include select functionality and unfocus any active editor inputs
   * @param {any} item the draggable list item
   * @returns {void}
   */
  onClick(item: any): void {
    super.onClick(item);
    this.#unfocusAnySelectedLiEditor();
  }

  /**
   * Attaches functionality for toolbar button interaction
   * @private
   * @returns {void}
   */
  #attachClickListeners(): void {
    // Add button
    this.onEvent('click', this.container.querySelector('#button-add'), () => {
      this.#unfocusAnySelectedLiEditor();

      const selectionNull = !this.selectedLi;
      // if an item is selected, create a node under it, otherwise create a node above the first item

      let targetDraggableItem = selectionNull ? this.container.querySelector('ids-draggable') : this.selectedLi.parentNode;
      if (!targetDraggableItem) {
        targetDraggableItem = new IdsDraggable();
      }
      const newDraggableItem = targetDraggableItem.cloneNode(true);

      const insertionLocation = selectionNull ? targetDraggableItem : targetDraggableItem.nextSibling;
      if (targetDraggableItem.parentNode) {
        targetDraggableItem.parentNode.insertBefore(newDraggableItem, insertionLocation);
      } else {
        this.container.querySelector('.ids-list-view-body').appendChild(newDraggableItem);
      }
      this.attachDragEventListenersForDraggable(newDraggableItem);
      this.#attachKeyboardListenersForLi(newDraggableItem.querySelector('div[part="list-item"]'));

      const listItem = newDraggableItem.querySelector('div[part="list-item"]');
      // remove any selected attribute on li that may have propogated from the clone
      if (listItem?.getAttribute('selected')) listItem.removeAttribute('selected');
      this.resetIndices();
      this.toggleSelectedLi(listItem);

      const newEntry = true;
      this.#insertSelectedLiWithEditor(newEntry);
    });

    // Up button
    this.onEvent('click', this.container.querySelector('#button-up'), () => {
      if (this.selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const prev = this.selectedLi.parentNode.previousElementSibling;
        if (prev) {
          this.swap(this.selectedLi.parentNode, prev);
        }
        this.updateDataFromDOM();
      }
    });

    // Down button
    this.onEvent('click', this.container.querySelector('#button-down'), () => {
      if (this.selectedLi) {
        this.#unfocusAnySelectedLiEditor();

        const next = this.selectedLi.parentNode.nextElementSibling;
        if (next) {
          this.swap(this.selectedLi.parentNode, next);
        }
        this.updateDataFromDOM();
      }
    });

    // Edit button
    this.onEvent('click', this.container.querySelector('#button-edit'), () => {
      this.#insertSelectedLiWithEditor();
    });

    // Delete button
    this.onEvent('click', this.container.querySelector('#button-delete'), () => {
      if (this.selectedLi) {
        this.selectedLi.parentNode.remove();
        if (this.#selectedLiEditor) this.#selectedLiEditor = null;
        this.resetIndices();
        this.updateDataFromDOM();
      }
    });
  }

  /**
   * Attach selection toggling, editing feature, and navigation focus functionality to keyboard events
   * @private
   * @returns {void}
   */
  #attachKeyboardListeners(): void {
    this.getAllLi().forEach((li: any) => {
      this.#attachKeyboardListenersForLi(li);
    });
  }

  /**
   * Helper function to attach keyboard events to each individual item
   * @private
   * @param {any} li the list item
   * @returns {void}
   */
  #attachKeyboardListenersForLi(li: any): void {
    this.onEvent('keydown', li, (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter': // edits the list item
          this.#toggleEditor();
          break;
        case ' ': // selects the list item
          if (!this.#selectedLiEditor) {
            event.preventDefault(); // prevent container from scrolling
            this.toggleSelectedLi(li);
          }
          break;
        case 'Tab':
          this.#unfocusAnySelectedLiEditor();
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.#unfocusAnySelectedLiEditor();
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.#unfocusAnySelectedLiEditor();
          break;
        default:
          break;
      }
    });
  }

  /**
   * Overrides the ids-sortable-mixin function to ensure there are no duplicate selected nodes as a result of cloning
   * @param {Node} node the node to be cloned
   * @returns {Node} the cloned node
   */
  createPlaceholderNode(node: Node): Node {
    const p = super.createPlaceholderNode(node);
    p.querySelector('div[part="list-item"]').removeAttribute('selected');
    return p;
  }

  /**
   * Reset indices
   * @returns {void}
   */
  resetIndices(): void {
    this.container.querySelectorAll('div[part="list-item"]').forEach((x: HTMLElement, i: number) => {
      x.setAttribute('index', i.toString());
    });
  }
}