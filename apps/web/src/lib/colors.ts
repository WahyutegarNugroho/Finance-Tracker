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

const categoryColorMap: Record<string, string> = {
  // English Default Categories
  "Food & Dining": "#4648d4",      // Indigo
  "Food": "#4648d4",
  "Transportation": "#8b5cf6",     // Violet/Purple
  "Groceries": "#ec4899",          // Pink/Rose
  "Rent & Utilities": "#f59e0b",   // Amber/Orange
  "Entertainment": "#b07b10",      // Gold/Ochre
  "Healthcare": "#ef4444",         // Terracotta Red
  "Shopping": "#06b6d4",           // Cyan/Teal
  "Salary": "#006c49",             // Sage Green
  "Freelance": "#10b981",          // Mint
  "Investment": "#6366f1",         // Slate Blue

  // Indonesian Default Categories
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

// Premium, modern, and harmonious dark/light mode palette (avoiding eye-searing colors)
const premiumPalette = [
  "#4648d4", // Indigo
  "#006c49", // Sage Green
  "#b07b10", // Gold/Ochre
  "#8b5cf6", // Soft Violet
  "#06b6d4", // Cyan
  "#ec4899", // Dusty Rose
  "#ef4444", // Terracotta Red
  "#6366f1", // Slate Blue
  "#f59e0b", // Warm Amber
  "#10b981", // Mint Green
];

export function getCategoryColor(name: string, index: number): string {
  if (!name) return premiumPalette[index % premiumPalette.length];
  
  const trimmed = name.trim();
  if (categoryColorMap[trimmed]) {
    return categoryColorMap[trimmed];
  }
  
  // Custom categories get diverse sequential colors from the premium palette
  return premiumPalette[index % premiumPalette.length];
}
