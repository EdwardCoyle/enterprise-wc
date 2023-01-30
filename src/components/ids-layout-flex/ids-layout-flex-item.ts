import { customElement, scss } from '../../core/ids-decorators.ts';
import { attributes } from '../../core/ids-attributes.ts';
import { stringToNumber } from '../../utils/ids-string-utils/ids-string-utils.ts';

import Base from './ids-layout-flex-item-base.ts';
import styles from './ids-layout-flex-item.scss';

// List of flex item options
export const FLEX_ITEM_OPTIONS = {
  alignSelf: ['auto', 'baseline', 'center', 'stretch', 'flex-start', 'flex-end'],
  grow: [0, 1],
  shrink: [0, 1]
};

/**
 * IDS Layout Flex Item Component
 * @type {IdsLayoutFlexItem}
 * @inherits IdsElement
 */
@customElement('ids-layout-flex-item')
@scss(styles)
export default class IdsLayoutFlexItem extends Base {
  constructor() {
    super();
  }

  static get attributes(): any {
    return [
      ...super.attributes,
      attributes.ALIGN_SELF,
      attributes.GROW,
      attributes.SHRINK
    ];
  }

  connectedCallback() {
    super.connectedCallback();
  }

  template(): string {
    return `<slot></slot>`;
  }

  /**
   * Set the align self setting
   * @param {string} value The value
   */
  set alignSelf(value: string | null) {
    if (value && FLEX_ITEM_OPTIONS.alignSelf.includes(value)) {
      this.setAttribute(attributes.ALIGN_SELF, value);
    } else {
      this.removeAttribute(attributes.ALIGN_SELF);
    }
  }

  get alignSelf() { return this.getAttribute(attributes.ALIGN_SELF); }

  /**
   * Set the grow setting
   * @param {number|string} value The value
   */
  set grow(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_ITEM_OPTIONS.grow.includes(val)) {
      this.setAttribute(attributes.GROW, String(val));
    } else {
      this.removeAttribute(attributes.GROW);
    }
  }

  get grow() { return this.getAttribute(attributes.GROW); }

  /**
   * Set the shrink setting
   * @param {number|string} value The value
   */
  set shrink(value: number | string | null) {
    const val = stringToNumber(value);
    if (!Number.isNaN(val) && FLEX_ITEM_OPTIONS.shrink.includes(val)) {
      this.setAttribute(attributes.SHRINK, String(val));
    } else {
      this.removeAttribute(attributes.SHRINK);
    }
  }

  get shrink() { return this.getAttribute(attributes.SHRINK); }
}
