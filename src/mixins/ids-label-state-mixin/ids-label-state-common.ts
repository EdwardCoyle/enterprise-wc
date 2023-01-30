import { attributes } from '../../core/ids-attributes.ts';
import { stringToBool } from '../../utils/ids-string-utils/ids-string-utils.ts';

export type IdsLabelStateMode = null | 'hidden' | 'collapsed';

export const IdsLabelStateAttributes = [
  attributes.LABEL,
  attributes.LABEL_REQUIRED,
  attributes.LABEL_STATE
];

export const isLabelStateValid = (value: string | null) => value === null || ['hidden', 'collapsed'].includes(value);

export const isLabelRequiredValid = (value: string | boolean | null): boolean => {
  const isValid = typeof value !== 'undefined' && value !== null;
  return isValid ? stringToBool(value) : true;
};
