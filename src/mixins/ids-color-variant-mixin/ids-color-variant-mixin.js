import { attributes } from '../../core';
// Import Utils
import { IdsStringUtils, IdsXssUtils } from '../../utils';

/**
 * A mixin that will provide the container element of an IDS Component with a class
 * reserved for flipping the foreground color (text color, icon fill, etc) to an alternate,
 * contrasting color.  This allows easy integration with alternate layouts, headers, app menu, etc.
 * @param {any} superclass Accepts a superclass and creates a new subclass from it
 * @returns {any} The extended object
 */
const IdsColorVariantMixin = (superclass) => class extends superclass {
  constructor() {
    super();

    /* istanbul ignore next */
    if (!this.state) {
      this.state = {};
    }
    this.state.colorVariant = null;

    // Overrides the IdsElement `render` method to also include an update
    // to color variant styling after it runs, keeping the visual state in-sync.
    this.render = () => {
      super.render();
      this.#refreshColorVariant();
    };
  }

  connectedCallback() {
    super.connectedCallback?.();
    this.colorVariant = this.getAttribute(attributes.COLOR_VARIANT);
  }

  static get attributes() {
    return [
      ...super.attributes,
      attributes.COLOR_VARIANT
    ];
  }

  /**
   * @returns {Array<string>} List of available color variants for this component
   */
  colorVariants = [];

  /**
   * @returns {string|null} the name of the color variant currently applied
   */
  get colorVariant() {
    return this.state.colorVariant;
  }

  /**
   * @param {string|null} val the name of the color variant to be applied
   */
  set colorVariant(val) {
    let safeVal = null;
    if (typeof val === 'string') {
      safeVal = IdsXssUtils.stripTags(val, '');
    }

    if (this.colorVariants.includes(safeVal)) {
      this.setAttribute(attributes.COLOR_VARIANT, `${safeVal}`);
    } else {
      this.removeAttribute(attributes.COLOR_VARIANT);
      safeVal = null;
    }

    /* istanbul ignore next */
    if (this.state.colorVariant !== safeVal) {
      this.state.colorVariant = safeVal;
      this.#refreshColorVariant(safeVal);
    }
  }

  /**
   * Refreshes the component's color variant state, driven by
   * a CSS class on the WebComponent's `container` element
   *
   * @param {string} variantName the variant name to "add" to the style
   * @returns {void}
   */
  #refreshColorVariant(variantName) {
    const thisVariantClass = `color-variant-${variantName}`;
    const cl = this.container.classList;

    this.colorVariants.forEach((variant) => {
      const variantClass = `color-variant-${variant}`;
      if (variantName !== null && variantClass === thisVariantClass && !cl.contains(variantClass)) {
        cl.add(variantClass);
      } else if (variantClass !== thisVariantClass && cl.contains(variantClass)) {
        cl.remove(variantClass);
      }
    });

    // Fire optional callback
    if (typeof this.onColorVariantRefresh === 'function') {
      this.onColorVariantRefresh();
    }
  }
};

export default IdsColorVariantMixin;