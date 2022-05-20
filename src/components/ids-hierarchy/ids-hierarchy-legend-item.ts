import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import Base from './ids-hierarchy-legend-item-base';

import styles from './ids-hierarchy-legend-item.scss';

/**
 * IDS Hierarchy Legend Item Component
 * @type {IdsHierarchyLegendItem}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 */
@customElement('ids-hierarchy-legend-item')
@scss(styles)
export default class IdsHierarchyLegendItem extends Base {
  constructor() {
    super();
  }

  /**
   * ids-hierarchy-legend `connectedCallback` implementation
   * @returns {void}
   */
  connectedCallback() {
    super.connectedCallback?.();
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes() {
    return [
      attributes.COLOR,
      attributes.TEXT
    ];
  }

  template() {
    return `
      <div class="ids-hierarchy-legend-item">
        <ids-text>${this.text}</ids-text>
      </div>
    `;
  }

  /**
   * Set the value of the text attribute
   * @param {string} value the value of the attribute
   */
  set text(value: string) {
    if (value) {
      this.setAttribute('text', value);
    } else {
      this.removeAttribute('text');
    }
  }

  /**
   * @returns {string|undefined} containing value of the text attribute
   */
  get text() {
    return this.getAttribute('text');
  }

  get color(): string {
    return this.getAttribute(attributes.COLOR);
  }

  /**
   * Set the color of the bar
   * @param {string} value The color value, this can be a hex code with the #
   */
  set color(value: string) {
    this.setAttribute(attributes.COLOR, value);

    let color = value;
    if (this.color.substring(0, 1) !== '#') {
      color = `var(--ids-color-palette-${this.color})`;
    }

    this.container.style.setProperty('--background', color);
  }
}
