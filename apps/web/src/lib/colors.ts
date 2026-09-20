const cssVarCache = new Map<string, string>();
function getCSSVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  if (!cssVarCache.has(name)) {
    cssVarCache.set(name, getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  }
  return cssVarCache.get(name)!;
}

export const chartColors = {
  get primary() { return getCSSVar("--color-primary", "#006c4c"); },
  get error() { return getCSSVar("--color-error", "#ba1a1a"); },
  get secondary() { return getCSSVar("--color-secondary", "#4c6357"); },
  get tertiary() { return getCSSVar("--color-tertiary", "#805600"); },
};

export function chartColorWithOpacity(color: string, opacity: number): string {
  const hex = color.startsWith("#") ? color : `#${color}`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const categoryColorMap: Record<string, string> = {
  "Food & Dining": "#006c4c",
  "Food": "#006c4c",
  "Transportation": "#4c6357",
  "Groceries": "#2e7d32",
  "Rent & Utilities": "#805600",
  "Entertainment": "#b07b10",
  "Healthcare": "#ba1a1a",
  "Shopping": "#00695c",
  "Salary": "#006c49",
  "Freelance": "#10b981",
  "Investment": "#1b5e20",
  "Makanan & Minuman": "#006c4c",
  "Transportasi": "#4c6357",
  "Belanja Bulanan": "#2e7d32",
  "Sewa & Utilitas": "#805600",
  "Hiburan": "#b07b10",
  "Kesehatan": "#ba1a1a",
  "Belanja": "#00695c",
  "Gaji": "#006c49",
  "Pekerjaan Lepas": "#10b981",
  "Investasi": "#1b5e20",
};

const premiumPalette = [
  "#006c4c", "#4c6357", "#805600", "#00695c", "#2e7d32",
  "#10b981", "#ba1a1a", "#1b5e20", "#b07b10", "#52634f",
];

export function getCategoryColor(name: string, index: number): string {
  if (!name) return premiumPalette[index % premiumPalette.length];
  const trimmed = name.trim();
  if (categoryColorMap[trimmed]) return categoryColorMap[trimmed];
  return premiumPalette[index % premiumPalette.length];
}
