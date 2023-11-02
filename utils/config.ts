import type { ChartOptions } from "chart.js";

export const options = (chart_type: string) => {
  const chart_options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    // @ts-ignore
    pointRadius: 0.01,
    pointHoverRadius: 4,
    spanGaps: false,
    clip: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'x',
        displayColors: true,
        intersect: false,
        filter: function (tooltipItem: any, currentIndex: any, tooltipItems: any) {
          return tooltipItems[currentIndex].datasetIndex !== tooltipItems[currentIndex - 1]?.datasetIndex
        },
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        type: "timeseries",
        time: {
          displayFormats: {
            'hour': 'HH:mm',
            'week': 'MMM dd',
          }
        },
        position: "bottom",
        display: true,
      },
      y: {
        type: "linear",
        position: "left",
        display: true,
        beginAtZero: (chart_type == 'humidity') ? true : false,
        max: (chart_type == 'humidity') ? 100 : undefined,
        grace: (chart_type == 'temperature' || chart_type == 'air_pressure') ? '15%' : '0'
      }
    },
    // @ts-ignore
    animation: false
  };
  return chart_options;
};