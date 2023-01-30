// home page events
import '../ids-home-page.ts';

document.addEventListener('DOMContentLoaded', () => {
  const homePage: any = document.querySelector('#home-page-event-resized');
  homePage?.addEventListener('resized', (e: CustomEvent) => {
    console.info('resized: ', e.detail);
  });
});
