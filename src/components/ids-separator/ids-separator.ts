import { customElement, scss } from '../../core/ids-decorators';
import { attributes } from '../../core/ids-attributes';
import { setBooleanAttr } from '../../utils/ids-attribute-utils/ids-attribute-utils';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsColorVariantMixin from '../../mixins/ids-color-variant-mixin/ids-color-variant-mixin';
import IdsElement from '../../core/ids-element';

import styles from './ids-separator.scss';

const Base = IdsColorVariantMixin(
  IdsEventsMixin(
    IdsElement
  )
);

/**
 * IDS Separator Component
 * @type {IdsSeparator}
 * @inherits IdsElement
 * @mixes IdsColorVariantMixin
 * @mixes IdsEventsMixin
 * @part separator - the menu separator element
 */
@customElement('ids-separator')
@scss(styles)
export default class IdsSeparator extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    this.vertical = this.vertical;
  }

  static get attributes(): Array<string> {
    return [
      ...super.attributes,
      attributes.VERTICAL,
      attributes.NO_MARGINS
    ];
  }

  /**
   * Inherited from `IdsColorVariantMixin`
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants: Array<string> = ['alternate-formatter', 'module-nav'];

  /**
   * @returns {string} The components template
   */
  template(): string {
    let tagName = 'div';
    if (this.parentElement?.tagName === 'IDS-MENU-GROUP') {
      tagName = 'li';
    }
    return `<${tagName} part="separator" class="ids-separator${this.vertical ? ' vertical' : ''}${this.noMargins ? ' no-margins' : ''}"></${tagName}>`;
  }

  /**
   * Set the separator to be vertical
   */
  set vertical(val: boolean) {
    setBooleanAttr(attributes.VERTICAL, this, val);
  }

  get vertical(): boolean {
    return stringToBool(this.getAttribute(attributes.VERTICAL));
  }

  /**
   * Enforce no margins on the separator if defined
   */
  set noMargins(val: boolean) {
    setBooleanAttr(attributes.NO_MARGINS, this, val);
  }

  get noMargins(): boolean {
    return this.hasAttribute(attributes.NO_MARGINS);
  }
}
