const logger = {
  warn: (meta: Record<string, unknown>, msg: string) => {
    if (typeof console !== "undefined") console.warn(`[${msg}]`, meta);
  },
  error: (meta: Record<string, unknown>, msg: string) => {
    if (typeof console !== "undefined") console.error(`[${msg}]`, meta);
  },
};

export default logger;
