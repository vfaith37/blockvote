import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const StackedBarChart = () => {
  const data = {
    labels: [
      "President",
      "Vice Pres.",
      "Social Dir.",
      "Chaplain",
      "General Sec.",
      "Dir. of Sport",
      "DFR",
      "Dir. of Transport",
      "PRO",
    ],
    datasets: [
      {
        label: "100 lvl",
        data: [300, 500, 400, 600, 700, 500, 400, 600, 300],
        backgroundColor: "#D9D9D9",
      },
      {
        label: "200 lvl",
        data: [200, 300, 200, 300, 400, 300, 200, 300, 200],
        backgroundColor: "#979797",
      },
      {
        label: "300 lvl",
        data: [100, 200, 100, 200, 300, 200, 100, 200, 100], // Adjust the data for 300 level
        backgroundColor: "#484848", // Example color
      },
      {
        label: "400 lvl",
        data: [50, 100, 50, 100, 150, 100, 50, 100, 50], // Adjust the data for 400 level
        backgroundColor: "#5C6262", // Example color
        borderRadius: 10,
      
      },
      // Add more datasets for higher levels as needed
    ],
  };
  let delayed;
  const options = {
    plugins: {
    legend: {
          position: "top",
          align: "end",
        labels: {
          usePointStyle: true,
        },
      }
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
