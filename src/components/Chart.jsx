import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

// Renders real candidate vote counts when given { labels, values }; falls back
// to a neutral empty axis otherwise.
const StackedBarChart = ({ labels = [], values = [] }) => {
  const data = {
    labels: labels.length ? labels : ["No candidates yet"],
    datasets: [
      {
        label: "Votes",
        data: values.length ? values : [0],
        backgroundColor: "#0d9488",
        hoverBackgroundColor: "#14b8a6",
        borderRadius: 6,
        maxBarThickness: 56,
      },
    ],
  };
  let delayed;
  const options = {
    plugins: {
    legend: {
          display: false,
        },
    },
    animation: {
        onComplete: () => {
          delayed = true;
        },
        delay: (context) => {
          let delay = 0;
          if (context.type === 'data' && context.mode === 'default' && !delayed) {
            delay = context.dataIndex * 300 + context.datasetIndex * 100;
          }
          return delay;
        },
      },
      
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false, // Hide vertical lines
        },
        ticks: {
            color: 'white', // Set x-axis label color to white
          },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.2)", // Set horizontal lines color to white
        },
        ticks: {
            color: 'white', // Set x-axis label color to white
          },
      },
    },
  };

  return (
    // <div className="p-8">
    <Bar data={data} options={options} />
    // </div>
  );
};

export default StackedBarChart;
