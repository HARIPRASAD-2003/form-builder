// utils/formulas.ts

export const formulaHelpers = {
  // Date helpers
  yearsBetween: (date: string) => {
    if (!date) return 0;
    const d = new Date(date);
    return Math.floor(
      (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
  },
  monthsBetween: (date: string) => {
    if (!date) return 0;
    const d = new Date(date);
    return (
      (new Date().getFullYear() - d.getFullYear()) * 12 +
      (new Date().getMonth() - d.getMonth())
    );
  },
  daysBetween: (date: string) => {
    if (!date) return 0;
    const d = new Date(date);
    return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  },
  today: () => new Date().toISOString().split("T")[0],

  // Math helpers
  sum: (...nums: any[]) =>
    nums.reduce((a, b) => a + Number(b || 0), 0),
  avg: (...nums: any[]) =>
    nums.reduce((a, b) => a + Number(b || 0), 0) / nums.length || 0,
  min: (...nums: any[]) =>
    Math.min(...nums.map((n) => Number(n || 0))),
  max: (...nums: any[]) =>
    Math.max(...nums.map((n) => Number(n || 0))),
  round: (n: number, decimals = 0) =>
    Number(Number(n).toFixed(decimals)),

  // String helpers
  concat: (...args: any[]) => args.join(""),
  upper: (s: any) => String(s).toUpperCase(),
  lower: (s: any) => String(s).toLowerCase(),
  trim: (s: any) => String(s).trim(),
};
