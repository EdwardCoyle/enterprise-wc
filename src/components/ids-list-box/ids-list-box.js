import { customElement, scss } from '../../core/ids-decorators';
import IdsElement from '../../core/ids-element';
import IdsListBoxOption from './ids-list-box-option';
import styles from './ids-list-box.scss';

/**
 * IDS List Box Component
 * @type {IdsListBox}
 * @inherits IdsElement
 */
@customElement('ids-list-box')
@scss(styles)
export default class IdsListBox extends IdsElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('role', 'listbox');
    this.setAttribute('tabindex', '0');
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template() {
    return `<slot></slot>`;
  }
}
