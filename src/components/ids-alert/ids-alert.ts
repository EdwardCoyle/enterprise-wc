import { customElement, scss } from '../../core/ids-decorators.ts';
import { attributes } from '../../core/ids-attributes.ts';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils.ts';
import { sizes } from '../ids-icon/ids-icon-attributes.ts';

import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin.ts';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin.ts';
import IdsTooltipMixin from '../../mixins/ids-tooltip-mixin/ids-tooltip-mixin.ts';

import IdsElement from '../../core/ids-element.ts';

import '../ids-icon/ids-icon.ts';
import styles from './ids-alert.scss';

/**
 * IDS Alert Component
 * @type {IdsAlert}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsThemeMixin
 * @part icon - the icon element
 */
@customElement('ids-alert')
@scss(styles)
export default class IdsAlert extends IdsTooltipMixin(IdsThemeMixin(IdsEventsMixin(IdsElement))) {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Setup some special config for the tooltip
   * @param {any} tooltip the tooltip element
   */
  beforeTooltipShow(tooltip?: any) {
    // Color the tooltip
    if (tooltip.popup) {
      tooltip.popup?.container?.classList.add(`${this.toolTipTarget.getAttribute('icon')}-color`);
      tooltip.popup.y = 12;
    }
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The propertires in an array
   */
  static get attributes() {
    return [
      ...super.attributes,
      attributes.DISABLED,
      attributes.ICON,
      attributes.TOOLTIP,
      attributes.SIZE
    ];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    const cssClass = stringToBool(this.disabled) ? ' class="disabled"' : '';
    return `<ids-icon size="${this.size}"${cssClass} icon="${this.icon}" part="icon"></ids-icon>`;
  }

  /**
   * Sets to disabled
   * @param {boolean|string} value If true will set `disabled` attribute
   */
  set disabled(value: boolean | string) {
    const icon = this.shadowRoot?.querySelector('ids-icon');
    const val = stringToBool(value);
    if (val) {
      this.setAttribute(attributes.DISABLED, val.toString());
      icon?.classList.add(attributes.DISABLED);
    } else {
      this.removeAttribute(attributes.DISABLED);
      icon?.classList.remove(attributes.DISABLED);
    }
  }

  get disabled(): boolean {
    return stringToBool(this.getAttribute(attributes.DISABLED));
  }

  /**
   * Return the icon of the alert.
   * @returns {string | null} the path data
   */
  get icon(): string | null { return this.getAttribute(attributes.ICON); }

  /**
   * Set the icon
   * @param {string | null} value The Icon Type [success, info, error, warning]
   */
  set icon(value: string | null) {
    if (value) {
      this.setAttribute(attributes.ICON, value);
      this.shadowRoot?.querySelector('ids-icon')?.setAttribute(attributes.ICON, value);
    } else {
      this.removeAttribute(attributes.ICON);
    }
  }

  /**
   * Return the size. May be large, normal/medium or small
   * @returns {string} the size
   */
  get size(): string { return this.getAttribute(attributes.SIZE) || 'normal'; }

  set size(value: string | null) {
    if (value && sizes[value]) {
      this.setAttribute(attributes.SIZE, value);
      this.container?.querySelector('ids-icon')?.setAttribute(attributes.SIZE, value);
    } else {
      this.removeAttribute(attributes.SIZE);
      this.container?.querySelector('ids-icon')?.removeAttribute(attributes.SIZE);
    }
  }
}
