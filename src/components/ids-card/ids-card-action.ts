import { customElement, scss } from '../../core/ids-decorators.ts';
import Base from './ids-card-action-base.ts';
import styles from './ids-card-action.scss';

/**
 * IDS Card Action Component
 * @type {IdsCardAction}
 * @inherits IdsElement
 */
@customElement('ids-card-action')
@scss(styles)
export default class IdsCardAction extends Base {
  constructor() {
    super();
  }

  /**
   * Create the Template for the contents
   * @returns {string} The Template
   */
  template() {
    return `<div><slot></slot></div>`;
  }
}
