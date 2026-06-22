import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  "#3B82F6", // blue
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#06B6D4", // cyan
  "#F97316", // orange
  "#6366F1", // indigo
];

export default function CategoryPie({ items }) {
  const labels = items.map((x) => x.category);
  const values = items.map((x) => x.total);
  const colors = items.map((_, i) => PALETTE[i % PALETTE.length]);

  const data = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: values,
        backgroundColor: colors,
        borderColor: colors.map((c) => c + "cc"),
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 16,
          font: { size: 13 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.label}: ${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
}
