import '../ids-card.ts';

// Initialize the 4.x
$('body').initialize();
$('.btn-actions').on('selected', (e: Event, args: object) => {
  console.info(e, args);
});
