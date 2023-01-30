import IdsLocale from '../../components/ids-locale/ids-locale.ts';
import { attributes } from '../../core/ids-attributes.ts';
import { getClosest } from '../../utils/ids-dom-utils/ids-dom-utils.ts';
import { EventsMixinInterface } from '../ids-events-mixin/ids-events-mixin.ts';
import { IdsConstructor } from '../../core/ids-element.ts';

export interface LocaleMixinInterface {
  locale: IdsLocale;
  language: string;
  setDirection(): void;
}

export interface LocaleHandler {
  onLocaleChange?: (locale: IdsLocale) => void;
}

type Constraints = IdsConstructor<EventsMixinInterface & LocaleHandler>;

const IdsLocaleMixin = <T extends Constraints>(superclass: T) => class extends superclass implements LocaleMixinInterface {
  /** Flag for one initial event call */
  initialized = false;

  constructor(...args: any[]) {
    super(...args);
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.offEvent('languagechange.mixin');
    this.onEvent('languagechange.mixin', getClosest(this, 'ids-container'), () => {
      this.setDirection();
    });
    this.offEvent('localechange.mixin');
    this.onEvent('localechange.mixin', getClosest(this, 'ids-container'), () => {
      this.setDirection();
      if (typeof this.onLocaleChange === 'function') {
        this.onLocaleChange(this.locale);
      }
    });
  }

  static get attributes() {
    return [
      ...(superclass as any).attributes,
      attributes.LANGUAGE,
      attributes.LOCALE
    ];
  }

  /**
   * Provides access to a global `locale` instance
   * @returns {IdsLocale} link to the global locale instance
   */
  get locale(): IdsLocale {
    this.attachLocale();
    return this.state.locale;
  }

  /**
   * Get the language from the container
   * @returns {string} the language
   */
  get language() {
    this.attachLocale();
    return this.locale?.language;
  }

  /**
   * Get the language on the container
   * @param {string} value the language value
   */
  set language(value: string) {
    if (this.locale) this.locale.language = value;
  }

  /**
   * Set the direction attribute
   */
  setDirection() {
    if (this.locale?.isRTL()) {
      this.setAttribute('dir', 'rtl');
      this.container?.classList.add('rtl');
    } else {
      this.removeAttribute('dir');
      this.container?.classList.remove('rtl');
    }
  }

  /**
   * Attach the container locale to this instance
   */
  attachLocale() {
    if (this.tagName !== 'IDS-CONTAINER' && !this.state?.locale) {
      const container: any = document.querySelector('ids-container');
      this.state = this.state || {};
      this.state.locale = container?.state?.locale;
    }
  }
};

export default IdsLocaleMixin;
