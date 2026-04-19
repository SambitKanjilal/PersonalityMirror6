"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

type Props = {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
};

export default function RadarChart({
  openness,
  conscientiousness,
  extraversion,
  agreeableness,
  neuroticism,
}: Props) {
  const data = {
    labels: ["Openness", "Conscientious", "Extraversion", "Agreeableness", "Neuroticism"],
    datasets: [
      {
        label: "OCEAN",
        data: [openness, conscientiousness, extraversion, agreeableness, neuroticism],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        pointRadius: 4,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.25,
          color: "#6b7280",
          font: { size: 10 },
          backdropColor: "transparent",
        },
        grid: { color: "rgba(107, 114, 128, 0.2)" },
        pointLabels: { color: "#d1d5db", font: { size: 11 } },
        angleLines: { color: "rgba(107, 114, 128, 0.2)" },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { raw: unknown }) => `${(Number(ctx.raw) * 100).toFixed(0)}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  return <Radar data={data} options={options} />;
}
