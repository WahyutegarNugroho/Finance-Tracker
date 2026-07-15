export function cleanAmount(val: string, currency: string): string {
  const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";
  if (isDecimalAllowed) {
    const cleaned = val.replace(/,/g, ".").replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    return parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;
  }
  return val.replace(/\D/g, "");
}

export function formatAmount(val: string, currency: string): string {
  const cleaned = cleanAmount(val, currency);
  const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";
  if (isDecimalAllowed) {
    const parts = cleaned.split(".");
    const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts[1] !== undefined ? formattedInt + "." + parts[1] : formattedInt;
  }
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const formatDate = (dateString: string, language: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatShortDate = (dateString: string, language: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(language === "id" ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const AVATAR_COLORS = ['#4648d4', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#6366f1', '#ef4444'];
export const getAvatarUrl = (name: string | null | undefined): string => {
  const displayName = name || 'User';
  const initials = displayName.split(' ').map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'U';
  const colorIndex = displayName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  const bg = AVATAR_COLORS[colorIndex];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="${bg}"/><text x="50" y="50" text-anchor="middle" dominant-baseline="central" fill="white" font-family="system-ui,sans-serif" font-size="36" font-weight="600">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};
