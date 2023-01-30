import { customElement, scss } from '../../core/ids-decorators.ts';
import { attributes } from '../../core/ids-attributes.ts';
import Base from './ids-list-box-option-base.ts';

import styles from './ids-list-box-option.scss';

/**
 * IDS List Box Option Component
 * @type {IdsListBoxOption}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @mixes IdsTooltipMixin
 * @part option - the option element
 */
@customElement('ids-list-box-option')
@scss(styles)
export default class IdsListBoxOption extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array<any>} The attributes in an array
   */
  static get attributes(): Array<any> {
    return [
      ...super.attributes,
      attributes.GROUP_LABEL,
      attributes.TOOLTIP
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', this.hasAttribute(attributes.GROUP_LABEL) ? 'none' : 'option');
    this.setAttribute('tabindex', '-1');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<slot></slot>`;
  }
}
