import avatarPlaceholder from '../../../assets/images/avatar-placeholder.jpg.ts';

const avatarImg: any = window.document.getElementById('avatar');
avatarImg.src = avatarPlaceholder;

document.addEventListener('DOMContentLoaded', () => {
  const appMenuDrawer: any = document.querySelector('#app-menu');
  const appMenuTriggerBtn: any = document.querySelector('#app-menu-trigger');

  appMenuDrawer.target = appMenuTriggerBtn;
  appMenuTriggerBtn.addEventListener('click', () => {
    appMenuTriggerBtn.disabled = true;
  });

  appMenuDrawer.addEventListener('hide', () => {
    appMenuTriggerBtn.disabled = false;
  });

  appMenuDrawer.addEventListener('selected', (e: CustomEvent) => {
    console.info(`Header "${(e.target as any).textContent.trim()}" was selected.`);
  });
});
