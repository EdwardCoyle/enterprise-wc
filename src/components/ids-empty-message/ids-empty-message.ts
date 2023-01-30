// Import Base and Decorators
import pathData from 'ids-identity/dist/theme-new/icons/empty/path-data.json';
import { customElement, scss } from '../../core/ids-decorators.ts';
import { attributes } from '../../core/ids-attributes.ts';

import Base from './ids-empty-message-base.ts';
import '../ids-icon/ids-icon.ts';
import '../ids-text/ids-text.ts';

import styles from './ids-empty-message.scss';

/**
 * IDS Empty Message Component
 * @type {IdsEmptyMessage}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part container - the container element
 */
@customElement('ids-empty-message')
@scss(styles)
export default class IdsEmptyMessage extends Base {
  constructor() {
    super();
  }

  /**
   * Invoked each time the custom element is add into a document-connected element
   */
  connectedCallback() {
    super.connectedCallback();
    this.#attachEventHandlers();
  }

  /**
   * Return the attributes we handle as getters and setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.ICON
    ];
  }

  iconData(): string {
    return (<any>pathData)[this.icon as any];
  }

  /**
   * Create the template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-empty-message" part="container">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" aria-hidden="true">${this.iconData()}</svg>
        <div class="label">
          <slot name="label"></slot>
        </div>
        <div class="description">
          <slot name="description"></slot>
        </div>
        <div class="button">
          <slot name="button"></slot>
        </div>
      </div>
    </div>`;
  }

  /**
   * Establish internal event handlers
   * @private
   * @returns {object} The object for chaining
   */
  #attachEventHandlers() {
    return this;
  }

  get icon(): string | null { return this.getAttribute(attributes.ICON); }

  set icon(value: string | null) {
    const svgIcon = this.shadowRoot?.querySelector('svg');
    const iconData = (pathData as any)[value as string];
    if (value && iconData) {
      svgIcon?.style.setProperty('display', '');
      this.setAttribute(attributes.ICON, value);
      if (svgIcon) svgIcon.innerHTML = iconData;
    } else {
      this.removeAttribute(attributes.ICON);
      svgIcon?.style.setProperty('display', 'none');
    }
  }
}
