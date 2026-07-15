const cssVarCache = new Map<string, string>();
function getCSSVar(name: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  if (!cssVarCache.has(name)) {
    cssVarCache.set(name, getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
  }
  return cssVarCache.get(name)!;
}

export const chartColors = {
  get primary() { return getCSSVar("--color-primary", "#4648d4"); },
  get error() { return getCSSVar("--color-error", "#ba1a1a"); },
  get secondary() { return getCSSVar("--color-secondary", "#49a454"); },
  get tertiary() { return getCSSVar("--color-tertiary", "#b07b10"); },
};

export function chartColorWithOpacity(color: string, opacity: number): string {
  const hex = color.startsWith("#") ? color : `#${color}`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const categoryColorMap: Record<string, string> = {
  "Food & Dining": "#4648d4",
  "Food": "#4648d4",
  "Transportation": "#8b5cf6",
  "Groceries": "#ec4899",
  "Rent & Utilities": "#f59e0b",
  "Entertainment": "#b07b10",
  "Healthcare": "#ef4444",
  "Shopping": "#06b6d4",
  "Salary": "#006c49",
  "Freelance": "#10b981",
  "Investment": "#6366f1",
  "Makanan & Minuman": "#4648d4",
  "Transportasi": "#8b5cf6",
  "Belanja Bulanan": "#ec4899",
  "Sewa & Utilitas": "#f59e0b",
  "Hiburan": "#b07b10",
  "Kesehatan": "#ef4444",
  "Belanja": "#06b6d4",
  "Gaji": "#006c49",
  "Pekerjaan Lepas": "#10b981",
  "Investasi": "#6366f1",
};

const premiumPalette = [
  "#4648d4", "#006c49", "#b07b10", "#8b5cf6", "#06b6d4",
  "#ec4899", "#ef4444", "#6366f1", "#f59e0b", "#10b981",
];

export function getCategoryColor(name: string, index: number): string {
  if (!name) return premiumPalette[index % premiumPalette.length];
  const trimmed = name.trim();
  if (categoryColorMap[trimmed]) return categoryColorMap[trimmed];
  return premiumPalette[index % premiumPalette.length];
}
