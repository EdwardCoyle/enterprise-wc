import checkForAxeViolations from '../helpers/check-for-axe-violations';
import countObjects from '../helpers/count-objects';

describe('Ids Editor e2e Tests', () => {
  const url = 'http://localhost:4444/ids-editor/example.html';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });

  test('should toggle blockquote', async () => {
    let html = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2)').innerHTML;
    });
    expect(html.includes('<blockquote>Cross-platform')).toBeFalsy();
    html = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="blockquote"]') as HTMLElement).click();
      const blockquoteEl = doc.querySelector('#editor-container blockquote');
      return blockquoteEl.outerHTML;
    });
    expect(html.includes('<blockquote>Cross-platform')).toBeTruthy();
    html = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container blockquote');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="blockquote"]') as HTMLElement).click();
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      return p.outerHTML;
    });
    expect(html.includes('<p>Cross-platform')).toBeTruthy();
  });

  test('should set text-align left and center', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p[style="text-align: center;"]');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="aligncenter"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p[style="text-align: center;"]');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="alignleft"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p[style="text-align: center;"]');
    });
    expect(elem).toBeFalsy();
  });

  test('should set text-align left and right', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p[style="text-align: right;"]');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="alignright"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p[style="text-align: right;"]');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="alignleft"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p[style="text-align: right;"]');
    });
    expect(elem).toBeFalsy();
  });

  test('should toggle ordered list', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) ol li');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="orderedlist"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) ol li');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) ol li');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="orderedlist"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) ol li');
    });
    expect(elem).toBeFalsy();
  });

  test('should toggle unordered list', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) ul li');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="unorderedlist"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) ul li');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) ul li');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="unorderedlist"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) ul li');
    });
    expect(elem).toBeFalsy();
  });

  test('should toggle header elements', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container h1');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="formatblock"]') as HTMLElement).click();
      (document.querySelector('ids-editor ids-menu-item[value="h1"]') as HTMLElement).click();
      return doc.querySelector('#editor-container h1');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container h1');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="formatblock"]') as HTMLElement).click();
      (document.querySelector('ids-editor ids-menu-item[value="h2"]') as HTMLElement).click();
      return doc.querySelector('#editor-container h2');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container h2');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="formatblock"]') as HTMLElement).click();
      (document.querySelector('ids-editor ids-menu-item[value="h3"]') as HTMLElement).click();
      return doc.querySelector('#editor-container h3');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container h3');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="formatblock"]') as HTMLElement).click();
      (document.querySelector('ids-editor ids-menu-item[value="p"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2)');
    });
    expect(elem).toBeTruthy();
  });

  test('should toggle hyperlink', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) a');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="hyperlink"]') as HTMLElement).click();
      (doc.querySelector('#hyperlink-modal-apply-btn') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) a');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) a');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="hyperlink"]') as HTMLElement).click();
      doc.querySelector('#hyperlink-modal-checkbox-remove').checked = true;
      (doc.querySelector('#hyperlink-modal-apply-btn') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) a');
    });
    expect(elem).toBeFalsy();
  });

  test('should be able to activate buttons on selection change', async () => {
    let cssClass = await page.evaluate(() => {
      const el = (document.querySelector('ids-editor [editor-action="hyperlink"]') as any);
      return el.cssClass;
    });
    expect(cssClass).toEqual([]);
    cssClass = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      let el = doc.querySelector('#editor-container a');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      document.dispatchEvent(new Event('selectionchange', { bubbles: true }));

      el = document.querySelector('ids-editor [editor-action="hyperlink"]');
      return el.cssClass;
    });
    expect(cssClass).toBeTruthy();
  });

  test('should be able to use source formatter', async () => {
    const html = await page.evaluate(() => {
      const editor: any = document.querySelector('ids-editor');
      const doc = editor.shadowRoot;
      editor.sourceFormatter = true;
      (document.querySelector('ids-editor [editor-action="sourcemode"]') as HTMLElement).click();
      (document.querySelector('ids-editor [editor-action="editormode"]') as HTMLElement).click();
      editor.sourceFormatter = null;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      return el.outerHTML;
    });
    expect(html.includes('<p> Cross-platform')).toBeTruthy();
  });

  test('should toggle fore color', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container p:nth-child(2) font[color]');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="forecolor"]') as HTMLElement).click();
      const input = (document.querySelector('ids-editor .forecolor-input') as any);
      input.value = '#ff0000';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return doc.querySelector('#editor-container p:nth-child(2) font[color]');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2) font[color]');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 10);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="clearformatting"]') as HTMLElement).click();
      return doc.querySelector('#editor-container p:nth-child(2) font[color]');
    });
    expect(elem).toBeFalsy();
  });

  test('should be able to insert image', async () => {
    let elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      return doc.querySelector('#editor-container img');
    });
    expect(elem).toBeFalsy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container p:nth-child(2)');
      const sel: any = window.getSelection();
      const range = document.createRange();
      range.setStart(el.firstChild, 0);
      range.setEnd(el.firstChild, 0);
      sel.removeAllRanges();
      sel.addRange(range);
      (document.querySelector('ids-editor [editor-action="insertimage"]') as HTMLElement).click();
      (doc.querySelector('#insertimage-modal-apply-btn') as HTMLElement).click();
      return doc.querySelector('#editor-container img');
    });
    expect(elem).toBeTruthy();
    elem = await page.evaluate(() => {
      const doc = (document.querySelector('ids-editor') as any).shadowRoot;
      const el = doc.querySelector('#editor-container img');
      el.parentNode.removeChild(el);
      const p = doc.querySelector('#editor-container p:nth-child(2)');
      p.innerHTML = p.innerHTML.slice(1);
      return doc.querySelector('#editor-container img');
    });
    expect(elem).toBeFalsy();
  });
});
