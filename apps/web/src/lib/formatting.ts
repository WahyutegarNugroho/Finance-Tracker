function normalizeNumberInput(val: string, currency: string, keepFormatting: boolean): string {
  // ponytail: inline zero-decimal list → use Intl.NumberFormat resolvedOptions when supporting 10+ currencies
  const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";

  if (isDecimalAllowed) {
    let cleaned = val.replace(/,/g, ".").replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    if (keepFormatting) {
      const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const formattedDec = parts[1] !== undefined ? "." + parts[1] : "";
      return formattedInt + formattedDec;
    }
    return cleaned;
  }

  const cleaned = val.replace(/\D/g, "");
  return keepFormatting ? cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : cleaned;
}

export const formatWithDots = (val: string, currency: string) => normalizeNumberInput(val, currency, true);
export const cleanAmountInput = (val: string, currency: string) => normalizeNumberInput(val, currency, false);

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
