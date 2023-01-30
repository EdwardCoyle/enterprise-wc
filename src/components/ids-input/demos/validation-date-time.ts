// Supporting components
import '../ids-input.ts';

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.e2e-input-mask')
    .forEach((item: any) => {
      item.maskOptions = { format: item.format };
    });
});
