function getCSSVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const chartColors = {
  get primary() { return getCSSVar("--color-primary") || "#4648d4"; },
  get error() { return getCSSVar("--color-error") || "#ba1a1a"; },
  get secondary() { return getCSSVar("--color-secondary") || "#49a454"; },
  get tertiary() { return getCSSVar("--color-tertiary") || "#b07b10"; },
};

export function chartColorWithOpacity(color: string, opacity: number): string {
  const hex = color.startsWith("#") ? color : `#${color}`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
