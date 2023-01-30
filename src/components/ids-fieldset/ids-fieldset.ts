import { customElement, scss } from '../../core/ids-decorators.ts';
import Base from './ids-fieldset-base.ts';
import styles from './ids-fieldset.scss';

/**
 * IDS Fieldset Component
 * @type {IdsFieldset}
 * @inherits IdsElement
 * @mixes IdsThemeMixin
 * @mixes IdsEventsMixin
 * @part fieldset - the fieldset element
 */
@customElement('ids-fieldset')
@scss(styles)
export default class IdsFieldset extends Base {
  constructor() {
    super();
  }

  /**
   * Inner template contents
   * @returns {string} The template
   */
  template() {
    return `<fieldset class="ids-fieldset" part="fieldset"><slot></slot></fieldset>`;
  }
}
