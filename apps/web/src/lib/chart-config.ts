export const chartTooltip = {
  backgroundColor: "#08110A",
  borderColor: "#39E75F",
  borderWidth: 1,
  titleColor: "#39E75F",
  bodyColor: "#F5EFE6",
  titleFont: { size: 12, family: "Space Grotesk, sans-serif", weight: "bold" as const },
  bodyFont: { size: 11, family: "JetBrains Mono, monospace" },
  padding: { top: 8, right: 12, bottom: 8, left: 12 },
  cornerRadius: 8,
  displayColors: true,
  boxPadding: 4,
};

export const chartScales = (formatCurrency?: (v: number) => string) => ({
  x: {
    grid: { display: false },
    ticks: { color: "rgba(120, 120, 120, 0.8)", font: { family: "JetBrains Mono, monospace", size: 10 } },
    border: { display: false },
  },
  y: {
    grid: { color: "rgba(120, 120, 120, 0.15)", borderDash: [4, 4] },
    ticks: {
      color: "rgba(120, 120, 120, 0.8)",
      font: { family: "JetBrains Mono, monospace", size: 10 },
      padding: 8,
      ...(formatCurrency
        ? { callback: (tickValue: string | number) => formatCurrency(Number(tickValue)) as string }
        : {}),
    },
    border: { display: false },
  },
});
