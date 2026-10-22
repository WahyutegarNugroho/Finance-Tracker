export const chartColors = {
  get primary() { return "#39E75F"; },
  get error() { return "#FB923C"; },
  get secondary() { return "#7DD3FC"; },
  get tertiary() { return "#FDE047"; },
};

export function chartColorWithOpacity(color: string, opacity: number): string {
  const hex = color.startsWith("#") ? color : `#${color}`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const categoryColorMap: Record<string, string> = {
  "Food & Dining": "#FB923C",
  "Food": "#FB923C",
  "Transportation": "#7DD3FC",
  "Groceries": "#39E75F",
  "Rent & Utilities": "#FDE047",
  "Entertainment": "#C084FC",
  "Healthcare": "#F87171",
  "Shopping": "#38BDF8",
  "Salary": "#39E75F",
  "Freelance": "#4ADE80",
  "Investment": "#FBBF24",
  "Makanan & Minuman": "#FB923C",
  "Transportasi": "#7DD3FC",
  "Belanja Bulanan": "#39E75F",
  "Sewa & Utilitas": "#FDE047",
  "Hiburan": "#C084FC",
  "Kesehatan": "#F87171",
  "Belanja": "#38BDF8",
  "Gaji": "#39E75F",
  "Pekerjaan Lepas": "#4ADE80",
  "Investasi": "#FBBF24",
};

const premiumPalette = [
  "#39E75F", 
  "#FB923C", 
  "#7DD3FC", 
  "#FDE047", 
  "#C084FC", 
  "#F472B6", 
  "#34D399", 
  "#38BDF8", 
  "#A3E635", 
  "#FBBF24",
];

export function getCategoryColor(name: string, index: number): string {
  if (!name) return premiumPalette[index % premiumPalette.length];
  const trimmed = name.trim();
  if (categoryColorMap[trimmed]) return categoryColorMap[trimmed];
  return premiumPalette[index % premiumPalette.length];
}
