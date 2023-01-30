import '../ids-time-picker.ts';

// Initialize the 4.x
document.addEventListener('DOMContentLoaded', () => {
  $('body').initialize();
  $('#time-field-normal').timepicker({
    timeFormat: 'h:mm a'
  });
});
