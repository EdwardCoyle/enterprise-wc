import { customElement, scss } from '../../core/ids-decorators.ts';
import { attributes } from '../../core/ids-attributes.ts';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils.ts';
import Base from './ids-dropdown-base.ts';
import '../ids-trigger-field/ids-trigger-field.ts';
import '../ids-trigger-field/ids-trigger-button.ts';
import '../ids-input/ids-input.ts';
import '../ids-popup/ids-popup.ts';
import '../ids-list-box/ids-list-box.ts';
import '../ids-text/ids-text.ts';
import '../ids-icon/ids-icon.ts';

import styles from './ids-dropdown.scss';
import type IdsPopup from '../ids-popup/ids-popup.ts';
import type IdsTriggerButton from '../ids-trigger-field/ids-trigger-button.ts';
import type IdsListBox from '../ids-list-box/ids-list-box.ts';
import type IdsTriggerField from '../ids-trigger-field/ids-trigger-field.ts';
import type IdsListBoxOption from '../ids-list-box/ids-list-box-option.ts';
import type IdsIcon from '../ids-icon/ids-icon.ts';
import { IdsPopupElementRef } from '../ids-popup/ids-popup-attributes.ts';

export type IdsDropdownOption = {
  id?: string,
  label: string,
  value: string,
  icon?: string,
  groupLabel?: boolean,
  // ids-multiselect shared
  selected?: boolean,
  index?: number
};

export type IdsDropdownOptions = Array<IdsDropdownOption>;

/**
 * IDS Dropdown Component
 * @type {IdsDropdown}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsDirtyTrackerMixin
 * @mixes IdsEventsMixin
 * @mixes IdsFieldHeightMixin
 * @mixes IdsKeyboardMixin
 * @mixes IdsLabelStateParentMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsPopupOpenEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsTooltipMixin
 * @mixes IdsValidationMixin
 * @part dropdown - the tag element
 */
@customElement('ids-dropdown')
@scss(styles)
export default class IdsDropdown extends Base {
  isFormComponent = true;

  hasIcons = false;

  popup?: IdsPopup | null;

  trigger?: IdsTriggerButton | null;

  listBox?: IdsListBox | null;

  labelEl?: HTMLLabelElement | null;

  constructor() {
    super();
    this.state = { selectedIndex: 0 };
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
    this.popup = this.container?.querySelector('ids-popup');
    this.trigger = this.container?.querySelector('ids-trigger-button');
    this.listBox = this.querySelector('ids-list-box');
    this.labelEl = this.input?.labelEl;

    this
      .#addAria()
      .#attachEventHandlers()
      .#attachKeyboardListeners();

    this.value = this.getAttribute('value');
    this.resetDirtyTracker();
    this.container?.classList.toggle('typeahead', this.typeahead);
    this.listBox?.setAttribute(attributes.SIZE, this.size);
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ALLOW_BLANK,
      attributes.CLEARABLE,
      attributes.CLEARABLE_TEXT,
      attributes.DISABLED,
      attributes.GROUP,
      attributes.GROUP_LABEL,
      attributes.NO_MARGINS,
      attributes.PLACEHOLDER,
      attributes.READONLY,
      attributes.SIZE,
      attributes.TYPEAHEAD,
      attributes.VALUE
    ];
  }

  #optionsData: IdsDropdownOptions = [];

  #isMultiSelect: boolean = this.nodeName === 'IDS-MULTISELECT';

  /**
   * List of available color variants for this component
   * @returns {Array<string>}
   */
  colorVariants: Array<string> = ['alternate-formatter', 'borderless', 'in-cell'];

  /**
   * Push color variant to the container element
   * @returns {void}
   */
  onColorVariantRefresh(): void {
    if (this.input) this.input.colorVariant = this.colorVariant;
  }

  onLabelChange(): void {
    if (this.input) this.input.label = this.label;
  }

  /**
   * Push label-state to the container element
   * @returns {void}
   */
  onLabelStateChange(): void {
    if (this.input) this.input.labelState = this.labelState;
  }

  onLabelRequiredChange(): void {
    if (this.input) this.input.labelRequired = this.labelRequired;
  }

  /**
   * Push field-height/compact to the container element
   * @param {string} val the new field height setting
   */
  onFieldHeightChange(val: string) {
    if (val) {
      const attr = val === 'compact' ? { name: 'compact', val: '' } : { name: 'field-height', val };
      this.input?.setAttribute(attr.name, attr.val);
      this.listBox?.setAttribute(attr.name, attr.val);
    } else {
      this.input?.removeAttribute('compact');
      this.input?.removeAttribute('field-height');
      this.listBox?.removeAttribute('compact');
      this.listBox?.removeAttribute('field-height');
    }
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const colorVariant = this.colorVariant ? ` color-variant="${this.colorVariant}"` : '';
    const fieldHeight = this.fieldHeight ? ` field-height="${this.fieldHeight}"` : '';
    const labelState = this.labelState ? ` label-state="${this.labelState}"` : '';
    const compact = this.compact ? ' compact' : '';
    const noMargins = this.noMargins ? ' no-margins' : '';
    this.hasIcons = this.querySelector('ids-list-box-option ids-icon') !== null;

    return `
    <div class="ids-dropdown">
      <ids-trigger-field
        ${!this.typeahead && !this.disabled ? ' readonly="true"' : ''}
        ${this.disabled ? ' disabled="true"' : ''}
        ${this.readonly ? '' : ' readonly-background'}
        cursor="pointer"
        size="${this.size}"
        label="${this.label}"
        placeholder="${this.placeholder}"
        part="trigger-field"
        ${colorVariant}${fieldHeight}${compact}${noMargins}${labelState}
        ${this.validate ? ` validate="${this.validate}"` : ''}
        ${this.validate && this.validationEvents ? ` validation-events="${this.validationEvents}"` : ''}
      >
        <ids-trigger-button
          slot="trigger-end"
          part="trigger-button"
          tabbable="false"
          disabled="${this.disabled}"
        >
          <ids-text audible="true" translate-text="true">DropdownTriggerButton</ids-text>
          <ids-icon icon="dropdown" part="icon"></ids-icon>
        </ids-trigger-button>
      </ids-trigger-field>
      <ids-popup type="menu" part="popup">
        <slot slot="content">
        </slot>
      </ids-popup>
    </div>`;
  }

  /**
   * Add internal aria attributes
   * @private
   * @returns {object} This API object for chaining
   */
  #addAria() {
    const attrs: any = {
      role: 'combobox',
      'aria-expanded': 'false',
      'aria-autocomplete': 'list',
      'aria-haspopup': 'listbox',
      'aria-description': this.locale?.translate('PressDown'),
      'aria-controls': this.listBox?.getAttribute('id') || `ids-list-box-${this.id}`
    };

    if (this.listBox) {
      this.listBox.setAttribute('id', `ids-list-box-${this.id}`);
      this.listBox.setAttribute('aria-label', `Listbox`);
    }
    Object.keys(attrs).forEach((key: any) => this.setAttribute(key, attrs[key]));
    return this;
  }

  /**
   * Add internal aria attributes while open
   * @private
   * @returns {void}
   */
  #setAriaOnMenuOpen(): void {
    this.setAttribute('aria-expanded', 'true');

    // Add aria for the open state
    const selected = this.selectedOption || this.querySelector('ids-list-box-option:not([group-label])');
    this.listBox?.setAttribute('tabindex', '0');

    if (selected && this.value) {
      this.selectOption(selected);

      if (!this.typeahead) {
        selected.focus();
      }
    }
  }

  /**
   * Add internal aria attributes while closed
   * @private
   * @returns {void}
   */
  #setAriaOnMenuClose() {
    this.setAttribute('aria-expanded', 'false');
    this.listBox?.removeAttribute('tabindex');

    const selected = this.selected;

    if (selected) {
      this.deselectOption(selected);
    }
  }

  get input() {
    return this.container?.querySelector<IdsTriggerField>('ids-trigger-field');
  }

  /**
   * Set the value of the dropdown using the value/id attribute if present
   * @param {string} value The value/id to use
   */
  set value(value: string | null) {
    const elem = this.querySelector<IdsListBoxOption>(`ids-list-box-option[value="${value}"]`);

    if (!elem && !this.clearable) {
      return;
    }

    this.clearSelected();
    this.selectOption(elem);
    this.selectIcon(elem);
    this.selectTooltip(elem);
    if (this.input) this.input.value = value === 'blank' ? '' : (elem as any)?.textContent.trim();
    this.state.selectedIndex = [...((elem?.parentElement as any)?.children || [])].indexOf(elem);

    // Send the change event
    if (this.value === value) {
      this.triggerEvent('change', this, {
        bubbles: true,
        detail: {
          elem: this,
          value: this.value
        }
      });
    }
    this.setAttribute(attributes.VALUE, String(value));
  }

  get value(): string | null {
    return this.getAttribute(attributes.VALUE);
  }

  /**
   * Returns the selected Listbox option based on the Dropdown's value.
   * @returns {HTMLElement| null} the selected option
   */
  get selectedOption(): HTMLElement | null {
    return this.querySelector(`ids-list-box-option[value="${this.value}"]`);
  }

  /**
   * Returns the currently-selected Listbox option
   * (may be different from the Dropdown's value because of user input)
   * @readonly
   * @returns {HTMLElement|null} Reference to a selected Listbox option if one is present
   */
  get selected(): HTMLElement | null {
    return this.querySelector('ids-list-box-option.is-selected');
  }

  /**
   * Set the selected option by index
   * @param {number} value the index to use
   */
  set selectedIndex(value:number) {
    if (Number.isInteger(value) && this.options[value]) {
      const elem = this.options[value];
      this.value = elem.getAttribute(attributes.VALUE);
      this.state.selectedIndex = value;
    }
  }

  get selectedIndex() { return this.state.selectedIndex; }

  /**
   * Returns the currently available options
   * @returns {Array<any>} the array of options
   */
  get options() {
    return this.querySelectorAll<IdsListBoxOption>('ids-list-box-option');
  }

  /**
   * Sets the readonly attribute
   * @param {string|boolean} value string value from the readonly attribute
   */
  set readonly(value) {
    const isReadonly = stringToBool(value);

    if (isReadonly) {
      this.removeAttribute(attributes.DISABLED);
      if (this.input) {
        this.input.disabled = false;
        this.input.cursor = 'initial';
        this.input.readonlyBackground = false;
      }
      this.setAttribute(attributes.READONLY, 'true');
      return;
    }
    if (this.input) {
      this.input.disabled = false;
      this.input.cursor = 'pointer';
      this.input.readonlyBackground = true;
    }
    this.removeAttribute(attributes.READONLY);
  }

  get readonly() {
    return stringToBool(this.getAttribute(attributes.READONLY)) || false;
  }

  /**
   * Sets the disabled attribute
   * @param {string|boolean} value string value from the disabled attribute
   */
  set disabled(value) {
    const isDisabled = stringToBool(value);
    if (isDisabled) {
      this.removeAttribute(attributes.READONLY);
      if (this.input) {
        this.input.disabled = true;
        this.input.readonly = false;
        this.input.cursor = 'initial';
        this.input.bgTransparent = false;
      }
      this.setAttribute(attributes.DISABLED, 'true');
      return;
    }

    if (this.input) {
      this.input.disabled = false;
      this.input.cursor = 'pointer';
      this.input.bgTransparent = true;
    }

    this.removeAttribute(attributes.DISABLED);
  }

  get disabled() {
    return stringToBool(this.getAttribute(attributes.DISABLED)) || false;
  }

  /**
   * Sets allow-blank setting
   * @param {string|boolean} value adds blank option if true
   */
  set allowBlank(value: boolean | string) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.ALLOW_BLANK, '');
      this.#insertBlankOption();
    } else {
      this.#removeBlank();
      this.removeAttribute(attributes.ALLOW_BLANK);
      if (this.value === 'blank') {
        this.removeAttribute(attributes.VALUE);
      }
    }
  }

  /**
   * Gets allow-blank value
   * @returns {boolean} allow-blank value
   */
  get allowBlank(): boolean {
    return stringToBool(this.getAttribute(attributes.ALLOW_BLANK));
  }

  /**
   * Set the aria and state on the element
   * @param {HTMLElement} option the option to select
   * @private
   */
  selectOption(option: HTMLElement | undefined | null) {
    if (!this.popup?.visible) return;

    option?.setAttribute('aria-selected', 'true');
    option?.classList.add('is-selected');
    option?.setAttribute('tabindex', '0');

    if (option?.id) {
      this.listBox?.setAttribute('aria-activedescendant', option.id);
    }
  }

  /**
   * Removes selected attributes from an option
   * @param {HTMLElement} option element to remove attributes
   */
  deselectOption(option: HTMLElement | undefined | null) {
    option?.removeAttribute('aria-selected');
    option?.classList.remove('is-selected');
    option?.setAttribute('tabindex', '-1');
  }

  /**
   * Set the icon to be visible (if used)
   * @private
   * @param {HTMLElement} option the option to select
   */
  selectIcon(option: HTMLElement | undefined | null) {
    let dropdownIcon = this.input?.querySelector<IdsIcon>('ids-icon[slot="trigger-start"]');

    if (!dropdownIcon && !option) return;

    if (!this.hasIcons) {
      if (dropdownIcon) {
        dropdownIcon.remove();
      }
      return;
    }
    const icon: any = option?.querySelector('ids-icon');

    if (!dropdownIcon) {
      const dropdownIconContainer = document.createElement('span');
      dropdownIconContainer.slot = 'trigger-start';
      dropdownIconContainer.classList.add('icon-container');
      dropdownIcon = document.createElement('ids-icon') as IdsIcon;
      dropdownIcon.icon = icon?.icon;
      dropdownIcon.setAttribute('slot', 'trigger-start');
      dropdownIconContainer.append(dropdownIcon);
      this.input?.appendChild(dropdownIconContainer);
    } else {
      dropdownIcon.icon = icon?.icon;
    }
  }

  /**
   * Set the tooltip to be visible for the selected option
   * @private
   * @param {HTMLElement} option the option to select
   */
  selectTooltip(option: HTMLElement | undefined | null) {
    const tooltip = option?.getAttribute('tooltip');
    if (tooltip) {
      this.tooltip = tooltip;
    }
  }

  /**
   * Remove the aria and state from the currently selected element
   */
  clearSelected() {
    const option = this.querySelector<IdsListBoxOption>('ids-list-box-option[aria-selected]');
    this.deselectOption(option);
  }

  /**
   * Insert blank option into list box
   */
  #insertBlankOption(): void {
    const list = this.querySelector('ids-list-box');
    const blankOption = `<ids-list-box-option value="blank" aria-label="Blank">${this.clearableText ?? '&nbsp;'}</ids-list-box-option>`;
    this.#removeBlank();
    list?.insertAdjacentHTML('afterbegin', blankOption);
  }

  /**
   * Remove blank options from list box
   */
  #removeBlank(): void {
    this.querySelector('ids-list-box-option[value="blank"]')?.remove();
  }

  #configurePopup() {
    if (!this.popup) return;

    this.popup.type = 'dropdown';
    this.popup.alignTarget = this.input?.fieldContainer as IdsPopupElementRef;
    this.popup.align = 'bottom, left';
    this.popup.arrow = 'none';
    this.popup.y = -1;
    this.popup.x = 0;

    // Fix aria if the menu is closed
    if (!this.popup.visible) {
      this.#setAriaOnMenuClose();
    }
  }

  /**
   * Open the dropdown list
   * @param {boolean} shouldSelect whether or not the input text should be selected
   */
  async open(shouldSelect = false) {
    if (this.disabled || this.readonly) {
      return;
    }

    // Trigger an async callback for contents
    if (typeof this.state.beforeShow === 'function') {
      const stuff = await this.state.beforeShow();
      this.loadDataSet(stuff);
      if (this.typeahead) {
        this.#optionsData = stuff;
      }
    }

    // Open the popup and add a class
    this.#configurePopup();
    if (this.popup) this.popup.visible = true;
    this.addOpenEvents();
    if (this.input) this.input.active = true;

    // Focus and select input when typeahead is enabled
    if (this.typeahead) {
      this.input?.removeAttribute(attributes.READONLY);
      this.input?.focus();
    }

    if (shouldSelect) {
      this.input?.input?.select();
    }

    this.container?.classList.add('is-open');
    this.#setAriaOnMenuOpen();
  }

  /**
   * Populate the DOM with the dataset
   * @param {IdsDropdownOptions} dataset The dataset to use with value, label ect...
   * @private
   */
  loadDataSet(dataset: IdsDropdownOptions) {
    let html = '';

    const listbox = this.querySelector('ids-list-box');
    if (listbox) listbox.innerHTML = '';

    dataset.forEach((option: IdsDropdownOption) => {
      html += this.#templatelistBoxOption(this.#sanitizeOption(option));
    });
    listbox?.insertAdjacentHTML('afterbegin', html);
    if (this.allowBlank) {
      this.#insertBlankOption();
    }
    this.value = this.getAttribute(attributes.VALUE);
  }

  /**
   * An async function that fires as the dropdown is opening allowing you to set contents.
   * @param {Function} func The async function
   */
  set beforeShow(func) {
    this.state.beforeShow = func;
  }

  get beforeShow() { return this.state.beforeShow; }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @param {PointerEvent} e native pointer event
   * @returns {void}
   */
  onOutsideClick(e: any): void {
    if (!(e.composedPath()?.includes(this.popup) || e.composedPath()?.includes(this.input?.fieldContainer))) {
      this.close(true);
    }
  }

  /**
   * Close the dropdown popup
   * @param {boolean} noFocus if true do not focus on close
   */
  close(noFocus?: boolean) {
    if (this.popup) {
      this.popup.visible = false;
      if (this.input) this.input.active = false;
    }
    this.#setAriaOnMenuClose();
    this.removeOpenEvents();

    if (!noFocus) {
      this.input?.focus();
    }

    if (this.typeahead) {
      // In case unfinished typeahead (typing is in process)
      // closing popup will reset dropdown to the initial value
      this.input?.setAttribute(attributes.READONLY, 'true');
      const initialValue: string | null | undefined = this.selectedOption?.textContent?.trim();
      if (this.input) this.input.value = initialValue || '';
      this.loadDataSet(this.#optionsData);
      (window.getSelection() as Selection).removeAllRanges();
      this.#triggerIconChange('dropdown');
    }

    this.container?.classList.remove('is-open');
  }

  /**
   * Toggle the dropdown list open/closed state
   * @private
   */
  toggle(): void {
    if (!this.popup?.visible) {
      this.open(this.typeahead);
    } else {
      this.close();
    }
  }

  /**
   * Establish Internal Event Handlers
   * @private
   * @returns {object} The object for chaining.
   */
  #attachEventHandlers() {
    this.attachClickEvent();

    // Disable text selection on tab (extra info in the screen reader)
    this.offEvent('focus.dropdown-input');
    this.onEvent('focus.dropdown-input', this.input, () => {
      (window.getSelection() as Selection).removeAllRanges();
    });

    // Handle the Locale Change
    this.offEvent('languagechange.dropdown-container');
    this.onEvent('languagechange.dropdown-container', this.closest('ids-container'), () => {
      this.#addAria();
    });

    return this;
  }

  attachClickEvent() {
    this.offEvent('click.dropdown-list-box');
    this.onEvent('click.dropdown-list-box', this.listBox, (e: any) => {
      // Excluding group labels
      if (e.target?.hasAttribute(attributes.GROUP_LABEL) || e.target.closest('ids-list-box-option')?.hasAttribute(attributes.GROUP_LABEL)) {
        return;
      }

      if (e.target.nodeName === 'IDS-LIST-BOX-OPTION') {
        this.value = e.target.getAttribute('value');
      }

      if (e.target.closest('ids-list-box-option')) {
        this.value = e.target.closest('ids-list-box-option').getAttribute('value');
      }

      this.close();
    });

    this.offEvent('click.dropdown-input');
    this.onEvent('click.dropdown-input', this.input?.input, () => {
      if (!this.typeahead) {
        this.toggle();
      }

      // Stays opened when clicking to input in typeahead
      if (this.typeahead && !this.popup?.visible) {
        this.open(true);
      }
    });

    // Should not open if clicked on label
    this.offEvent('click.dropdown-label');
    this.onEvent('click.dropdown-label', this.labelEl, (e: MouseEvent) => {
      e.preventDefault();

      this.input?.focus();
    });

    this.offEvent('click.dropdown-trigger');
    this.onEvent('click.dropdown-trigger', this.trigger, () => {
      this.toggle();
    });
  }

  #attachTypeaheadEvents() {
    // Handle Key Typeahead
    this.offEvent('keydownend.dropdown-typeahead');
    this.onEvent('keydownend.dropdown-typeahead', this, (e: CustomEvent) => {
      this.#typeAhead(e.detail.keys);
    });
  }

  #removeTypeaheadEvents() {
    this.offEvent('keydownend.dropdown-typeahead');
  }

  /**
   * Establish Internal Keyboard shortcuts
   * @private
   * @returns {object} This API object for chaining
   */
  #attachKeyboardListeners() {
    // Handle up and down arrow
    this.listen(['ArrowDown', 'ArrowUp'], this, (e: KeyboardEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      if (!this.popup?.visible) {
        this.open(this.typeahead);
        return;
      }

      const selected: any = this.selected;
      const next = selected?.nextElementSibling;
      const prev = selected?.previousElementSibling;

      if (e.key === 'ArrowUp' && e.altKey) {
        if (!this.#isMultiSelect) {
          this.value = selected?.getAttribute(attributes.VALUE) || '';
        }
        this.close();
        return;
      }

      if (e.key === 'ArrowDown' && next) {
        if (next.hasAttribute(attributes.GROUP_LABEL) && !next.nextElementSibling) return;
        this.deselectOption(selected);
        this.selectOption(next.hasAttribute(attributes.GROUP_LABEL) ? next.nextElementSibling : next);

        next.focus();
      }

      // Handles a case when the value is cleared
      if (e.key === 'ArrowDown' && !selected) {
        this.#selectFirstOption();
      }

      if (e.key === 'ArrowUp' && prev) {
        if (prev.hasAttribute(attributes.GROUP_LABEL) && !prev.previousElementSibling) return;
        this.deselectOption(selected);
        this.selectOption(prev.hasAttribute(attributes.GROUP_LABEL) ? prev.previousElementSibling : prev);

        prev.focus();
      }
    });

    // Close on escape
    this.listen(['Escape'], this, () => {
      this.close();
    });

    if (!this.#isMultiSelect) {
      // Select or Open on space/enter
      this.listen([' ', 'Enter'], this, (e: KeyboardEvent) => {
        // Excluding space key when typing
        if (e.key === ' ' && this.typeahead) return;

        if (!this.popup?.visible) {
          this.open(this.typeahead);
          return;
        }

        const value = this.selected?.getAttribute(attributes.VALUE) || '';
        this.value = value;
        this.close();
      });
    }

    // Select on Tab
    this.listen(['Tab'], this, (e: KeyboardEvent) => {
      if (!this.popup?.visible) {
        return;
      }

      if (e.shiftKey) {
        this.input?.focus();
      }

      const selected = this.selected;
      this.value = selected?.getAttribute(attributes.VALUE) || '';
      this.close(true);
    });

    // Delete/backspace should clear the value
    this.listen(['Backspace', 'Delete'], this, () => {
      if (!this.clearable || (this.clearable && this.typeahead && this.popup?.visible)) return;

      if (this.allowBlank) {
        this.value = 'blank';
      } else {
        // ids-multiselect shared
        (this.value as any) = this.#isMultiSelect ? [] : '';
        if (this.input) this.input.value = '';
      }

      this.input?.focus();
    });

    return this;
  }

  /**
   * Handle typeahead functionality
   * @param {string} text keydownend event detail keys
   * @returns {void}
   */
  #typeAhead(text: string) {
    // Accepts the keyboard input while closed
    const excludeKeys = ['Backspace', 'Delete'];

    if (!this.popup?.visible) {
      if (!excludeKeys.some((item) => text?.includes(item))) {
        if (this.input) this.input.value = text;
        this.open(false);
      } else {
        return;
      }
    }

    const inputValue = this.input?.value ?? '';
    const resultsArr = this.#findMatches(inputValue);
    const results = resultsArr.map((item: IdsDropdownOption) => {
      const regex = new RegExp(inputValue, 'gi');
      const optionText = item.groupLabel ? item.label : item.label?.replace(
        regex,
        `<span class="highlight">${inputValue?.toLowerCase()}</span>`
      );

      return this.#templatelistBoxOption({
        ...item,
        label: optionText
      });
    }).join('');

    if (results && this.listBox) {
      this.listBox.innerHTML = results;
      this.#selectFirstOption();
    } else if (this.listBox) {
      this.listBox.innerHTML = `<ids-list-box-option>${this.locale.translate('NoResults')}</ids-list-box-option>`;
    }

    // Change location of the popup after results are populated and the popup's height change
    this.popup?.place();

    this.#triggerIconChange('search');

    // Remove selected input icon when start typing
    this.input?.querySelector('.icon-container')?.remove();
  }

  /**
   * Helper to replace trigger button icon
   * @param {string} icon ids-icon icon value
   */
  #triggerIconChange(icon: string) {
    const triggerIcon = this.container?.querySelector<IdsTriggerButton>('ids-trigger-button')?.querySelector<IdsIcon>('ids-icon');

    if (triggerIcon?.icon && triggerIcon.icon !== icon) {
      triggerIcon.icon = icon;
    }
  }

  /**
   * Select first no blank with value option
   */
  #selectFirstOption() {
    this.clearSelected();

    if (this.options.length > 0) {
      const firstWithValue = [...this.options].filter((item) => {
        const value = item.getAttribute(attributes.VALUE);
        const groupLabel = item.hasAttribute(attributes.GROUP_LABEL);

        return value && value !== 'blank' && !groupLabel;
      })[0];

      this.selectOption(firstWithValue);
    }
  }

  /**
   * Create the list box option template.
   * @param {IdsDropdownOption} option data object
   * @returns {string} ids-list-box-option template
   */
  #templatelistBoxOption(option: IdsDropdownOption): string {
    return `<ids-list-box-option
      ${option.id ? `id=${option.id}` : ''}
      ${option.value ? `value="${option.value}"` : 'value=""'}
      ${option.groupLabel ? 'group-label' : ''}>${option.icon ? `<ids-icon icon="${option.icon}"></ids-icon>` : ''}${option.label || ''}</ids-list-box-option>`;
  }

  /**
   * Helper to get group index for given option index in the options list
   * @param {Array<number>} groupLabels group label indexes in the options list
   * @param {number} optionIndex option index in the options list
   * @returns {number} group label index for given option
   */
  #getGroupIndex(groupLabels: Array<number>, optionIndex: number) {
    return groupLabels.reduce((initialIndex: number, groupIndex: number, index: number) => {
      if (groupIndex < optionIndex && (groupLabels[index + 1] > optionIndex || !groupLabels[index + 1])) {
        return groupIndex;
      }

      return initialIndex;
    }, -1);
  }

  /**
   * Helper to get group option for given option index in the options list
   * @param {number} optionIndex option index in the options list
   * @returns {IdsDropdownOption | undefined} group label for given option index
   */
  #getGroupLabelOption(optionIndex: number): IdsDropdownOption | undefined {
    // Get group labels indexes in the all options list
    const groupLabels: Array<number> = this.#optionsData.reduce(
      (result: Array<number>, option: IdsDropdownOption, index: number) => {
        if (option?.groupLabel) {
          return [...result, index];
        }

        return result;
      },
      []
    );
    const groupLabelIndex = this.#getGroupIndex(groupLabels, optionIndex);

    return this.#optionsData[groupLabelIndex];
  }

  /**
   * Find matches between the input value and the dataset
   * @param {string | RegExp} inputValue value of the input field
   * @returns {IdsDropdownOptions} containing matched values
   */
  #findMatches(inputValue: string | RegExp): IdsDropdownOptions {
    return this.#optionsData.reduce((options: Array<IdsDropdownOption>, option: IdsDropdownOption, index: number) => {
      const regex = new RegExp(inputValue, 'gi');

      if (option.label?.match(regex) && !option.groupLabel) {
        const groupLabelOption = this.#getGroupLabelOption(index);
        // Check if group label option is already added to the list
        const groupLabelAdded = options.some(
          (item: IdsDropdownOption) => item.label === groupLabelOption?.label
        );

        if (groupLabelOption && !groupLabelAdded) {
          return [...options, groupLabelOption, option];
        }

        return [...options, option];
      }

      return options;
    }, []);
  }

  /**
   * Map slotted ids-list-box-option elements to the dataset
   */
  #setOptionsData() {
    this.#optionsData = [...this.options].map((item) => ({
      id: item.id,
      label: item.textContent?.trim() ?? '',
      value: item.getAttribute(attributes.VALUE) as string,
      icon: item.querySelector<IdsIcon>('ids-icon')?.icon,
      groupLabel: item.hasAttribute(attributes.GROUP_LABEL)
    }));
  }

  #sanitizeOption(option: IdsDropdownOption): IdsDropdownOption {
    return ({
      ...option,
      id: this.xssSanitize(option?.id ?? '') as string,
      value: this.xssSanitize(option.value) as string,
      label: this.xssSanitize(option.label) as string
    });
  }

  /**
   * Pass down `validate` attribute into IdsTriggerField
   * @param {string} value The `validate` attribute
   */
  set validate(value: string | null) {
    if (value) {
      this.setAttribute(attributes.VALIDATE, value.toString());
      if (this.input) this.input.setAttribute(attributes.VALIDATE, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATE);
      if (this.input) this.input.removeAttribute(attributes.VALIDATE);
    }
  }

  get validate(): string | null {
    return this.getAttribute(attributes.VALIDATE);
  }

  /**
   * Pass down `validation-events` attribute into IdsTriggerField
   * @param {string} value The `validation-events` attribute
   */
  set validationEvents(value: string) {
    if (value) {
      this.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
      if (this.input) this.input.setAttribute(attributes.VALIDATION_EVENTS, value.toString());
    } else {
      this.removeAttribute(attributes.VALIDATION_EVENTS);
      if (this.input) this.input.removeAttribute(attributes.VALIDATION_EVENTS);
    }
  }

  get validationEvents(): string { return this.getAttribute(attributes.VALIDATION_EVENTS) || 'change'; }

  /**
   * Sets the no margins attribute
   * @param {boolean} value The value for no margins attribute
   */
  set noMargins(value: boolean) {
    if (stringToBool(value)) {
      this.setAttribute(attributes.NO_MARGINS, '');
      if (this.input) this.input.setAttribute(attributes.NO_MARGINS, '');
      return;
    }
    this.removeAttribute(attributes.NO_MARGINS);
    if (this.input) this.input.removeAttribute(attributes.NO_MARGINS);
  }

  get noMargins(): boolean {
    return stringToBool(this.getAttribute(attributes.NO_MARGINS));
  }

  /**
   * Set the dropdown size
   * @param {string} value The value
   */
  set size(value: string) {
    if (value) {
      this.setAttribute(attributes.SIZE, value);
      this.listBox?.setAttribute(attributes.SIZE, value);
    } else {
      this.removeAttribute(attributes.SIZE);
      this.listBox?.removeAttribute(attributes.SIZE);
    }
    if (this.input) this.input.setAttribute(attributes.SIZE, this.size);
  }

  get size(): string { return this.getAttribute(attributes.SIZE) ?? 'md'; }

  /**
   * Set typeahead attribute
   * @param {string | boolean | null} value typeahead value
   */
  set typeahead(value: string | boolean | null) {
    const val = stringToBool(value);

    if (val) {
      this.setAttribute(attributes.TYPEAHEAD, String(val));
      this.#attachTypeaheadEvents();
      this.#setOptionsData();
    } else {
      this.removeAttribute(attributes.TYPEAHEAD);
      this.#removeTypeaheadEvents();
    }

    this.container?.classList.toggle('typeahead', val);
  }

  /**
   * Get the typeahead attribute
   * @returns {boolean} typeahead attribute value converted to boolean
   */
  get typeahead(): boolean {
    return stringToBool(this.getAttribute(attributes.TYPEAHEAD));
  }

  /**
   * When set the value can be cleared with Backspace/Delete
   * @param {boolean|string|null} value clearable value
   */
  set clearable(value: boolean | string | null) {
    const boolVal = stringToBool(value);

    if (boolVal) {
      this.setAttribute(attributes.CLEARABLE, String(boolVal));
    } else {
      this.removeAttribute(attributes.CLEARABLE);
    }
  }

  get clearable() { return stringToBool(this.getAttribute(attributes.CLEARABLE)); }

  /**
   * When set the blank option will have a text
   * @param {string|null} value blank option text
   */
  set clearableText(value: string | null) {
    if (value) {
      this.setAttribute(attributes.CLEARABLE_TEXT, value);
    } else {
      this.removeAttribute(attributes.CLEARABLE_TEXT);
    }

    if (this.allowBlank) {
      this.#insertBlankOption();
    }
  }

  get clearableText() { return this.getAttribute(attributes.CLEARABLE_TEXT); }

  /**
   * Sets the placeholder attribute
   * @param {string} value - the placeholder's text
   */
  set placeholder(value: string) {
    if (value) {
      this.setAttribute(attributes.PLACEHOLDER, value);
      this.input?.setAttribute(attributes.PLACEHOLDER, value);
    } else {
      this.removeAttribute(attributes.PLACEHOLDER);
      this.input?.removeAttribute(attributes.PLACEHOLDER);
    }
  }

  /**
   * Get the placeholder attribute
   * @returns {string} default is ""
   */
  get placeholder(): string {
    return this.getAttribute(attributes.PLACEHOLDER) ?? '';
  }
}
