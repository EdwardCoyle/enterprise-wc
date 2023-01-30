import '../../ids-icon/ids-icon.ts';
import '../../ids-header/ids-header.ts';
import '../../ids-toolbar/ids-toolbar.ts';

document.addEventListener('DOMContentLoaded', () => {
  const tabList: any = document.querySelector('ids-tabs');
  const tabContentContainer: any = document.querySelector('div.ids-tabs-content');
  let newTabCount = 0;

  const appMenuTab: any = document.querySelector('ids-tab[value="app-menu"]');
  appMenuTab.onAction = () => {
    console.info('Toggle App Menu');
  };

  const addTab: any = document.querySelector('ids-tab[value="add"]');
  addTab.onAction = () => {
    addTab.insertAdjacentHTML('beforebegin', `<ids-tab color-variant="module" value="new-tab-${newTabCount}" dismissible>New Tab ${newTabCount}</ids-tab>`);
    tabContentContainer.insertAdjacentHTML('beforeend', `<ids-tab-content value="new-tab-${newTabCount}">
      <ids-layout-grid auto="true">
        <ids-layout-grid-cell>
          <ids-text font-size="20" type="h2">New Tab #${newTabCount}</ids-text>
          <br />
          <ids-text type="p">Generated ${new Date()}</ids-text>
        </ids-layout-grid-cell>
      </ids-layout-grid>
    </ids-tab-content>`);
    newTabCount += 1;
  };

  const resetTab: any = document.querySelector('ids-tab[value="reset"]');
  resetTab.onAction = () => {
    [...tabList.querySelectorAll('ids-tab[value*="new-tab-"]')].forEach((tab) => {
      tab.remove();
    });
    [...tabContentContainer.querySelectorAll('ids-tab-content[value*="new-tab-"]')].forEach((panel) => {
      panel.remove();
    });
    newTabCount = 0;
  };
});
