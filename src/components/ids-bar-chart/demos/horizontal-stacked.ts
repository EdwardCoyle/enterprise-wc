import '../ids-bar-chart.ts';
import componentsJSON from '../../../assets/data/components.json';

const url = componentsJSON;
const setData = async () => {
  const res = await fetch(url as any);
  const data = await res.json();

  const chart: any = document.querySelector('#horizontal-stacked-example');
  if (chart) {
    chart.data = data;
  }
};

setData();
