import { customElement, scss } from '../../core/ids-decorators.ts';
import { attributes } from '../../core/ids-attributes.ts';
import '../ids-hyperlink/ids-hyperlink.ts';
import Base from './ids-skip-link-base.ts';

import styles from './ids-skip-link.scss';

/**
 * IDS IdsSkipLink Component
 * @type {IdsSkiplink}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part link - the link element
 */
@customElement('ids-skip-link')
@scss(styles)
export default class IdsSkiplink extends Base {
  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [
      attributes.HREF,
      attributes.MODE
    ];
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template(): string {
    return `<a href="${this.href}" class="ids-skip-link ids-hyperlink" part="link"><slot></slot></a>`;
  }

  /**
   * Set the link href
   * @param {string} value Set the link's href to some link
   */
  set href(value: string | null) {
    if (value) {
      this.setAttribute(attributes.HREF, value);
      this.container?.setAttribute(attributes.HREF, value);
      return;
    }
    this.removeAttribute(attributes.HREF);
    this.container?.removeAttribute(attributes.HREF);
  }

  get href(): string | null { return this.getAttribute(attributes.HREF); }
}
