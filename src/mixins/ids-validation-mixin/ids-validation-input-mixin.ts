import { IdsInputInterface } from '../../components/ids-input/ids-input-attributes.ts';
import { IdsBaseConstructor } from '../../core/ids-element.ts';
import type { IdsValidationErrorMessage } from './ids-validation-mixin.ts';

/**
 * Adds validation to any input field
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsValidationInputMixin = <T extends IdsBaseConstructor>(superclass: T) => class extends superclass {
  constructor(...args: any[]) {
    super(...args);
  }

  connectedCallback() {
    super.connectedCallback?.();
  }

  /**
   * Return if the field is valid or not
   * @returns {boolean} true if invalid
   */
  get isValid(): boolean { return (this as IdsInputInterface).input?.shadowRoot?.querySelectorAll('.validation-message').length === 0; }

  /**
   * Return if the current validation errors
   * @returns {Array<IdsValidationErrorMessage>} The current errors
   */
  get validationMessages(): Array<IdsValidationErrorMessage> {
    const msgs: Array<IdsValidationErrorMessage> = [];
    (this as IdsInputInterface).input?.shadowRoot?.querySelectorAll('.validation-message').forEach((message: Element) => {
      msgs.push({
        message: message.querySelector('ids-text')?.childNodes[1].textContent || '',
        type: message.getAttribute('type') || '',
        id: message.getAttribute('validation-id') || ''
      });
    });
    return msgs;
  }
};

export default IdsValidationInputMixin;
