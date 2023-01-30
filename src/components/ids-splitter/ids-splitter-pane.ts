import { customElement, scss } from '../../core/ids-decorators.ts';

// Import Mixins
import Base from './ids-splitter-base.ts';

import styles from './ids-splitter-pane.scss';

/**
 * IDS SplitterPane Component
 * @type {IdsSplitterPane}
 * @inherits IdsElement
 * @mixes IdsEventsMixin
 * @mixes IdsLocaleMixin
 * @mixes IdsThemeMixin
 * @part pane - the splitter pane container element
 */
@customElement('ids-splitter-pane')
@scss(styles)
export default class IdsSplitterPane extends Base {
  constructor() {
    super();
  }

  /**
   * Return the attributes we handle as getters/setters
   * @returns {Array} The attributes in an array
   */
  static get attributes(): Array<string> {
    return [...super.attributes];
  }

  /**
   * Create the Template for the contents
   * @returns {string} The template
   */
  template(): string {
    return `<div class="ids-splitter-pane" part="pane"><slot></slot></div>`;
  }

  /**
   * Invoked each time the custom element is appended into a document-connected element.
   */
  connectedCallback() {
    super.connectedCallback();
  }
}
