export const formatWithDots = (val: string, currency: string) => {
  const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";

  if (isDecimalAllowed) {
    let cleaned = val.replace(/,/g, ".").replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }

    const formattedInt = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const formattedDec = parts[1] !== undefined ? "." + parts[1] : "";
    return formattedInt + formattedDec;
  } else {
    return val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};

export const cleanAmountInput = (inputVal: string, currency: string): string => {
  const isDecimalAllowed = currency !== "IDR" && currency !== "JPY";

  if (isDecimalAllowed) {
    inputVal = inputVal.replace(/,/g, ".");
    let cleaned = inputVal.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = parts[0] + "." + parts.slice(1).join("");
    }
    return cleaned;
  }
  return inputVal.replace(/\D/g, "");
};

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
