// Supporting components
import '../ids-popup.ts';
import css from '../../../assets/css/ids-popup/index.css.ts';

const cssLink = `<link href="${css}" rel="stylesheet">`;
(document.querySelector('head') as any).insertAdjacentHTML('afterbegin', cssLink);

document.addEventListener('DOMContentLoaded', () => {
  const popup: any = document.querySelector('#popup-1');
  if (!popup) {
    return;
  }

  // Implement `onPlace` callback to alter popup values and provide logging
  popup.onPlace = (popupRect: any) => {
    // eslint-disable-next-line
    console.info('Before `onPlace` occurs:', popupRect.x, popupRect.y);

    popupRect.x += 100;
    popupRect.y += 50;

    // eslint-disable-next-line
    console.info('After `onPlace` occurs:', popupRect.x, popupRect.y);

    return popupRect;
  };
});
