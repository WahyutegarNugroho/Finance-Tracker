export const chartTooltip = {
  backgroundColor: "rgba(30, 30, 40, 0.9)",
  titleColor: "#ffffff",
  bodyColor: "#ffffff",
  padding: 10,
};

export const chartScales = (formatCurrency?: (v: number) => string) => ({
  x: {
    grid: { display: false },
    ticks: { color: "rgba(150, 150, 150, 0.8)" },
  },
  y: {
    grid: { color: "rgba(150, 150, 150, 0.1)" },
    ticks: {
      color: "rgba(150, 150, 150, 0.8)",
      ...(formatCurrency
        ? { callback: (tickValue: string | number) => formatCurrency(Number(tickValue)) as string }
        : {}),
    },
  },
});
