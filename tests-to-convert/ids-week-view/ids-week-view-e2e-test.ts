import { AxePuppeteer } from '@axe-core/puppeteer';
import type IdsWeekView from '../../src/components/ids-week-view/ids-week-view';
import countObjects from '../helpers/count-objects';

describe('Ids Week View Tests', () => {
  const url = 'http://localhost:4444/ids-week-view/example.html';
  const name = 'ids-week-view';

  beforeAll(async () => {
    await page.goto(url, { waitUntil: ['networkidle2', 'load'] });
  });


  test('should render one day and show correct day', async () => {
    // Set startDay = endDate to render one day view
    await page.evaluate((el: string) => {
      const element = document.querySelector<any>(el);

      element.startDate = '11/08/2021';
      element.endDate = '11/08/2021';
    }, name);

    // Has is-day-view css class
    const hasCssClass = await page.$eval(name, (el: any) => Array.from(el.shadowRoot.querySelectorAll('.week-view-header-wrapper')).every((item: any) => item.classList.contains('is-day-view')));

    // Day numeric element content
    const dayNumeric = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week.is-emphasis')?.textContent);

    // Weekday element content
    const weekDay = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week:not(.is-emphasis)')?.textContent);

    // Month range in calendar toolbar datepicker
    // const monthYear =
    // await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector<any>('ids-date-picker').value);

    expect(hasCssClass).toBeTruthy();
    expect(dayNumeric).toEqual('8');
    expect(weekDay).toEqual('Mon');
    // expect(monthYear).toEqual('November 2021');
  });

  test('should change dates', async () => {
    // Previous date
    await page.$eval(name, (el: IdsWeekView) => el.changeDate('previous'));

    let dayNumeric = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week.is-emphasis')?.textContent);

    let weekDay = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week:not(.is-emphasis)')?.textContent);

    expect(dayNumeric).toEqual('7');
    expect(weekDay).toEqual('Sun');

    // Next date
    await page.$eval(name, (el: IdsWeekView) => el.changeDate('next'));
    await page.$eval(name, (el: IdsWeekView) => el.changeDate('next'));

    dayNumeric = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week.is-emphasis')?.textContent);

    weekDay = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week:not(.is-emphasis)')?.textContent);

    expect(dayNumeric).toEqual('9');
    expect(weekDay).toEqual('Tue');

    // Today day
    await page.$eval(name, (el: IdsWeekView) => el.changeDate('today'));

    dayNumeric = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-header-day-of-week.is-emphasis')?.textContent);

    expect(+dayNumeric).toEqual(new Date().getDate());

    // Set regular week with different months to test month range and today button
    await page.evaluate((el: string) => {
      const element = document.querySelector<any>(el);

      element.startDate = '11/29/2021';
      element.endDate = '12/05/2021';
      element.firstDayOfWeek = 0;
    }, name);

    // Month range
    // let monthYear =
    // await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector<any>('ids-date-picker').value);
    // expect(monthYear).toEqual('Nov - December 2021');

    // Click today
    await page.$eval(name, (el: any) => el.changeDate('today'));

    dayNumeric = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-header-wrapper.is-today .is-emphasis').textContent);

    expect(+dayNumeric).toEqual(new Date().getDate());

    // Set different years
    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      element.startDate = '12/27/2021';
      element.endDate = '01/02/2022';
      element.firstDayOfWeek = 1;
    }, name);

    // Month range
    // monthYear = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('ids-date-picker').value);
    // expect(monthYear).toEqual('Dec 2021 - Jan 2022');
  });

  it.skip('should support changing locale', async () => {
    await page.evaluate((el: any) => {
      const element = document.querySelector(el);

      element.startDate = '11/08/2021';
      element.endDate = '11/08/2021';

      // IdsGlobal.getLocale().setLocale('ar-SA');
      // IdsGlobal.getLocale().setLanguage('ar');
    }, name);

    // Wait till calendars loading
    await page.waitForFunction(() => !document.querySelector<any>('ids-week-view').shadowRoot.querySelector('.week-view-header-day-of-week:nth-child(1)').classList.contains('is-emphasis'));

    const weekDayHasIsEmphasis = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-header-day-of-week:nth-child(1)').classList.contains('is-emphasis'));

    const dayNumericHasIsEmphasis = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-header-day-of-week:nth-child(2)').classList.contains('is-emphasis'));

    const dayNumeric = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-header-day-of-week.is-emphasis').textContent);

    const weekDay = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-header-day-of-week:not(.is-emphasis)').textContent);

    expect(weekDayHasIsEmphasis).toBeFalsy();
    expect(dayNumericHasIsEmphasis).toBeTruthy();
    expect(dayNumeric).toEqual('٣');
    expect(weekDay).toEqual('الاثنين');
  });

  test('should hide timeline if current time is out of start/end hour range', async () => {
    // Change start/end hour to make timeline hidden
    await page.evaluate((el: string) => {
      const now = new Date();
      const hours = now.getHours();
      const startHour = hours >= 12 ? 6 : 18;
      const endHour = hours >= 12 ? 7 : 19;
      const element = document.querySelector<any>(el);

      element.showTimeline = true;
      element.startHour = startHour;
      element.endHour = endHour;
    }, name);

    const timelineShiftCssVar = await page.$eval(name, (el: any) => el.shadowRoot?.querySelector('.week-view-hour-row')?.style.cssText);

    expect(timelineShiftCssVar).toEqual('--timeline-shift: 0px;');
  });

  test('should show/hide timeline', async () => {
    // Hide timeline
    await page.evaluate((el: string) => {
      const element = document.querySelector<any>(el);

      element.showTimeline = false;
    }, name);

    let timeline = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-time-marker'));

    expect(timeline).toBeNull();

    // Show timeline
    await page.evaluate((el: string) => {
      const element = document.querySelector<any>(el);

      element.showTimeline = true;
    }, name);

    timeline = await page.$eval(name, (el: HTMLElement) => el.shadowRoot?.querySelector('.week-view-time-marker'));

    expect(timeline).not.toBeNull();
  });

  test('should change timeline position with interval', async () => {
    // Show timeline and change interval
    await page.evaluate((el: string) => {
      const element = document.querySelector<any>(el);

      // Set small timeline interval to test position change
      element.timelineInterval = 500;
    }, name);

    const positionBefore = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-hour-row')?.dataset.diffInMilliseconds);

    await page.waitForTimeout(1000);

    const positionAfter = await page.$eval(name, (el: any) => el.shadowRoot.querySelector('.week-view-hour-row')?.dataset.diffInMilliseconds);

    expect(positionBefore).not.toEqual(positionAfter);
  });
});
