import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

function Chart() {
  const [chartData, setChartData] = useState([
    35,
    42,
    38,
    55,
    48,
    62,
    50,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev];

        newData.shift();

        newData.push(
          Math.floor(Math.random() * 80 + 20)
        );

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const data = {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
    ],

    datasets: [
      {
        label: "Network Traffic",

        data: chartData,

        borderColor: "#06b6d4",

        backgroundColor: "rgba(6,182,212,0.25)",

        fill: true,

        tension: 0.4,

        pointRadius: 5,

        pointHoverRadius: 8,

        pointBackgroundColor: "#06b6d4",

        borderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 1000,
    },

    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        backgroundColor: "#0f172a",

        titleColor: "#fff",

        bodyColor: "#06b6d4",
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
        },

        grid: {
          color: "#1e293b",
        },
      },

      y: {
        min: 0,

        max: 100,

        ticks: {
          color: "#94a3b8",
        },

        grid: {
          color: "#1e293b",
        },
      },
    },
  };

  return (
    <div className="h-[350px]">
      <Line
        data={data}
        options={options}
      />
    </div>
  );
}

export default Chart;