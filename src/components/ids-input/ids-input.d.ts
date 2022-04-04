type IdsMaskTypes = {
  /** Adds a mask to the input */
  mask: Array<RegExp|string> | CallableFunction | string

  /** Adds options that are considered by a mask function when generating a mask */
  maskOptions?: Record<string, unknown>

  /** If true, displays the literals and fillable space of the mask as a placeholder inside the field */
  maskGuide?: boolean;

  /** If true, combined with `maskGuide`, attempts to keep previously-entered input from shifting within the field */
  maskRetainPositions?: boolean;
}

type IdsValidationErrorMessageTypes = {
  /** The unique id in the check messages */
  id: string;

  /** The Type of message and icon */
  type: 'error' | 'info' | 'alert' | 'warn';

  /** The localized message text */
  message: string;

  /** The Type of message icon */
  icon: string;
}

type IdsValidationTypes = {
  /** Add a message to the input */
  addMessage(settings: IdsValidationErrorMessageTypes);

  /** Remove a message(s) from the input */
  removeMessage(settings: IdsValidationErrorMessageTypes);
}

export default class IdsInput extends HTMLElement {
  /** When set the input will select all text on focus */
  autoselect: boolean;

  /** When set the input will render as transparent background */
  bgTransparent: boolean;

  /** Sets whether the capslock indicator appears */
  capsLock: 'true' | 'false' | boolean;

  /** When set the input will add a clearable x button */
  clearable: boolean;

  /** When set the input will add a clearable x button to forced for readonly */
  clearableForced: boolean;

  /** Sets the current color variant */
  colorVariant: 'alternate' | 'alternate-formatter' | string;

  /** Sets the component to be compact mode */
  compact: 'true' | 'false' | boolean;

  /** Sets the component base field height (default 'md') */
  fieldHeight: 'md' | 'xs' | 'sm' | 'lg';

  /** Sets the dirty tracking feature on to indicate a changed field */
  dirtyTracker: boolean;

  /** Sets checkbox to disabled * */
  disabled: boolean;

  /** Sets the input label text * */
  label: string;

  /** Determines the visibility state of this component's inner input field's label */
  labelState: null | 'hidden' | 'collapsed';

  /** Sets whether or not no-margins around the component */
  noMargins: 'true' | 'false ' | boolean;

  /** Sets the input placeholder text * */
  placeholder: string;

  /** Sets whether a password type input is curretly visible */
  passwordVisible: 'true' | 'false ' | boolean;

  /** Sets the size (width) of input * */
  size: 'xs' | 'sm ' | 'mm' | 'md' | 'lg' | 'full' | string;

  /** Sets whether revealable password functionality is available */
  reveablePassword: 'true' | 'false' | boolean;

  /** Sets the input to readonly state * */
  readonly: boolean;

  /* Sets whether the input allows tabbing */
  tabbable: boolean;

  /* Sets up a string based tooltip */
  tooltip?: string;

  /** Sets the text alignment * */
  textAlign: 'left' | 'center ' | 'right' | string;

  /** Sets the input type * */
  type: 'text' | 'password' | 'email' | 'number' | string;

  /** Sets the validation check to use * */
  validate: 'required' | 'email' | string;

  /** Sets the validation events to use * */
  validationEvents: 'blur' | string;

  /** Sets the `value` attribute * */
  value: string | number;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;

  /** Set the theme version */
  version: 'new' | 'classic' | string;

  IdsValidationTypes;

  IdsMaskTypes;
}
