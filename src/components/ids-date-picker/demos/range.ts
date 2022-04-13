// Supporting components
import '../ids-date-picker';

const rangePickerSettings: any = document.querySelector('#e2e-datepicker-settings-value');
const rangePickerForward: any = document.querySelector('#e2e-datepicker-forward');
const rangePickerBackward: any = document.querySelector('#e2e-datepicker-backward');
const rangePickerMax: any = document.querySelector('#e2e-datepicker-max');
const rangePickerMin: any = document.querySelector('#e2e-datepicker-min');
const rangePickerNotIncluded: any = document.querySelector('#e2e-datepicker-not-included');
const rangePickerIncluded: any = document.querySelector('#e2e-datepicker-included');

// Example to set start/end of the range via component settings
if (rangePickerSettings) {
  rangePickerSettings.rangeSettings = {
    start: '2/5/2018',
    end: '2/28/2018'
  };

  rangePickerSettings.addEventListener('dayselected', (e: any) => {
    console.info('Range Selected', e.detail.rangeStart, e.detail.rangeEnd);
  });
}

// Example range selection forward
if (rangePickerForward) {
  rangePickerForward.rangeSettings = {
    selectForward: true
  };
}

// Example range selection backward
if (rangePickerBackward) {
  rangePickerBackward.rangeSettings = {
    selectBackward: true
  };
}

// Example range max days
if (rangePickerMax) {
  rangePickerMax.rangeSettings = {
    maxDays: 2
  };
}

// Example range min days
if (rangePickerMin) {
  rangePickerMin.rangeSettings = {
    minDays: 5
  };
}

// Example range disabled not included
if (rangePickerNotIncluded) {
  rangePickerNotIncluded.rangeSettings = {
    start: '2/5/2018',
    end: '2/28/2018'
  };
  rangePickerIncluded.disable = {
    dates: ['2/7/2018', '2/9/2018']
  };
}

// Example range disabled included
if (rangePickerIncluded) {
  rangePickerIncluded.rangeSettings = {
    start: '2/5/2018',
    end: '2/28/2018',
    includeDisabled: true
  };
  rangePickerIncluded.disable = {
    dates: ['2/7/2018', '2/9/2018']
  };
}
