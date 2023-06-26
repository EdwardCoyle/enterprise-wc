import { customElement, scss } from '../../core/ids-decorators';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsModuleNavDisplayModeMixin from './ids-module-nav-display-mode-mixin';
import IdsDrawer from '../ids-drawer/ids-drawer';

import '../ids-accordion/ids-accordion';
import '../ids-button/ids-button';
import '../ids-icon/ids-icon';
import '../ids-text/ids-text';
import '../ids-toolbar/ids-toolbar';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils';

import styles from './ids-module-nav-bar.scss';

import type IdsAccordion from '../ids-accordion/ids-accordion';
import type IdsButton from '../ids-button/ids-button';
import type IdsSearchField from '../ids-search-field/ids-search-field';
import type IdsModuleNavContent from './ids-module-nav-content';

const CONTAINER_OPEN_CLASS = 'module-nav-is-open';

const Base = IdsModuleNavDisplayModeMixin(
  IdsKeyboardMixin(
    IdsDrawer
  )
);

/**
 * IDS Module Nav Bar Component
 * @type {IdsModuleNavBar}
 * @inherits IdsDrawer
 */
@customElement('ids-module-nav-bar')
@scss(styles)
export default class IdsModuleNavBar extends Base {
  globalKeydownListener?: (e: KeyboardEvent) => void;

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();

    this.edge = 'start';
    this.type = 'module-nav';
    if (this.visible && !this.displayMode) this.displayMode = 'collapsed';

    this.#connectSearchField();
    this.#refreshVariants();
    this.#attachEventHandlers();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback?.();
    this.#detachEventHandlers();
    this.#clearContainer();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes as an array
   */
  static get attributes() {
    return [
      ...super.attributes
    ];
  }

  // Slots:
  // - Role Switcher (IdsModuleNavSwitcher)
  // - Search (IdsSearchField)
  // - Main (IdsAccordionSection)
  // - Footer (IdsAccordionSection)
  // - Settings (IdsModuleNavSettings)
  // - Detail (any)
  template() {
    return `<div class="ids-drawer ids-module-nav-bar type-module-nav">
      <div class="ids-module-nav-bar-main">
        <div class="ids-module-nav-switcher-wrapper">
          <slot name="role-switcher"></slot>
        </div>
        <div class="ids-module-nav-search-wrapper">
          <slot name="search"></slot>
        </div>
        <div class="ids-module-nav-main">
          <slot></slot>
        </div>
        <div class="ids-module-nav-footer">
          <slot name="footer"></slot>
        </div>
        <div class="ids-module-nav-settings-wrapper">
          <slot name="settings"></slot>
        </div>
      </div>
      <div class="ids-module-nav-bar-detail">
        <slot name="detail"></slot>
      </div>
    </div>`;
  }

  /**
   * @readonly
   * @returns {IdsModuleNav | undefined} reference to the Module Nav parent element
   */
  get parent() {
    const parentEl = getClosest(this, 'ids-module-nav');
    if (parentEl) return parentEl;
    return undefined;
  }

  /**
   * @readonly
   * @returns {IdsModuleNavContent | undefined} reference to the content pane
   */
  get content() {
    const nextEl = this.nextElementSibling;
    if (nextEl?.tagName === 'IDS-MODULE-NAV-CONTENT') {
      return (nextEl as IdsModuleNavContent);
    }
    return undefined;
  }

  /**
   * @readonly
   * @returns {IdsAccordion} reference to an optionally-slotted IdsAccordion element
   */
  get accordion(): IdsAccordion | null {
    return this.querySelector<IdsAccordion>(`ids-accordion:not([slot])`);
  }

  /**
   * @readonly
   * @property {boolean} isFiltered true if the inner navigation accordion is currently being filtered
   */
  isFiltered = false;

  #refreshVariants() {
    const accordions = [...this.querySelectorAll<IdsAccordion>('ids-accordion')];
    accordions.forEach((acc) => {
      acc.colorVariant = 'module-nav';
    });

    const btns = [...this.querySelectorAll<IdsButton>('ids-button')];
    btns.forEach((btn) => {
      btn.colorVariant = 'alternate';
    });
  }

  #attachEventHandlers() {
    this.#detachEventHandlers();
    this.onEvent('show.module-nav-show', this, () => {
      if (this.parent) {
        this.parent?.classList.add(CONTAINER_OPEN_CLASS);
        if (!this.displayMode) this.displayMode = 'collapsed';
      }
    });
    this.onEvent('hide.module-nav-hide', this, () => {
      if (this.parent) {
        this.parent?.classList.remove(CONTAINER_OPEN_CLASS);
        if (this.displayMode) this.displayMode = false;
      }
    });
  }

  #detachEventHandlers() {
    this.offEvent('show.module-nav-show');
    this.offEvent('hide.module-nav-hide');
  }

  #clearContainer() {
    this.parent?.classList.remove(CONTAINER_OPEN_CLASS);
  }

  /**
   * Attaches a slotted IdsSearchField component to the app menu
   */
  #connectSearchField() {
    const searchfield = this.querySelector<IdsSearchField>('ids-search-field[slot="search"]');
    if (searchfield) {
      searchfield.onSearch = (value: string) => {
        if (value !== '') {
          return this.filterAccordion(value);
        }

        this.clearFilterAccordion();
        return [];
      };
      this.offEvent('cleared.search');
      this.onEvent('cleared.search', searchfield, () => this.clearFilterAccordion());
    }
  }

  /**
   * Inherited from the Popup Open Events Mixin.
   * Runs when a click event is propagated to the window.
   * @returns {void}
   */
  onOutsideClick() {
    // Don't close the popup if md+ media query breakpoint
    if (window.innerWidth < 840) {
      this.hide();
    }
  }

  /**
   * Inherited from Module Nav Display Mode Mixin.
   * @param {string | false} currentValue current display mode value being changed
   * @param {string | false} newValue new display mode value to be set
   * @returns {void}
   */
  onDisplayModeChange(currentValue: string | false, newValue: string | false): void {
    this.visible = (newValue !== false);
    if (this.content) this.content.displayMode = this.displayMode;
  }

  /**
   * Performs a filter operation on accordion panels
   * @param {string} value text value with which to filter accordion panels
   * @returns {Array<HTMLElement>} containing matching accordion panels
   */
  filterAccordion = (value = '') => {
    // Do nothing if there is no accordion, or there are no accordion panels
    if (!this.accordion) {
      return [];
    }
    const panels = [...this.accordion.querySelectorAll('ids-accordion-panel')];
    if (!panels.length) {
      return [];
    }

    // Always remove previous highlight before applying a new one
    this.clearFilterAccordion();

    // Check each accordion panel for a match.
    // Accordion panels are shown/hidden as needed
    const valueRegex = new RegExp(value, 'gi');
    const markParentPanel = (thisPanel: any) => {
      if (thisPanel.hasParentPanel) {
        const parentPanel = thisPanel.parentElement;
        const parentHeader = parentPanel.header;

        if (!parentPanel.expanded) {
          parentPanel.expanded = true;
        }

        parentHeader.childFilterMatch = true;
        markParentPanel(parentPanel);
      }
    };

    return panels.filter((panel: any) => {
      const header = panel.header;
      const textContent = header.textContent.trim();
      const hasTextMatch = textContent.match(valueRegex);
      if (hasTextMatch) {
        // Highlight
        // NOTE: Apply text highlighter here (See #494)
        if (header.hiddenByFilter) {
          header.hiddenByFilter = false;
        }
        markParentPanel(panel);
        this.isFiltered = true;
        return header;
      }

      // Unhighlight
      if (!header.hiddenByFilter) {
        header.hiddenByFilter = true;
      }
    });
  };

  /**
   * Clears a navigation accordion's previous filter result
   * @private
   */
  clearFilterAccordion() {
    const filteredHeaders: any = [...this.accordion?.querySelectorAll('ids-accordion-header[hidden-by-filter]') ?? []];
    filteredHeaders.map((header: any) => {
      header.hiddenByFilter = false;
      return header;
    });

    // NOTE: Clear text highlighter here (See #494)
    this.#clearChildFilter();
    this.isFiltered = false;
  }

  /**
   * Resets the "child-filter-match" attribute on any accordion headers who's children matched a previous filter result
   * @returns {void}
   */
  #clearChildFilter() {
    const childFilterMatches: any = [...this.accordion?.querySelectorAll('[child-filter-match]') ?? []];
    childFilterMatches.map((header: any) => {
      header.childFilterMatch = false;
      return header;
    });
  }

  /**
   * Overrides `addOpenEvents` from IdsPopupOpenEventsMixin to add a global handler
   * for App Menu keyboard events that can cause the menu to close
   */
  addOpenEvents() {
    super.addOpenEvents();

    this.globalKeydownListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        this.hide();
      }
    };
    document.addEventListener('keydown', this.globalKeydownListener);
  }

  /**
   * Overrides `removeOpenEvents` from IdsPopupOpenEventsMixin
   */
  removeOpenEvents() {
    super.removeOpenEvents();
    if (this.globalKeydownListener) document.removeEventListener('keydown', this.globalKeydownListener);
  }
}
