export const formatPriceLevel = (level: string | null) => {
  if (!level) return "—";
  const map: Record<string, string> = {
    PRICE_LEVEL_FREE: "Free",
    PRICE_LEVEL_INEXPENSIVE: "$",
    PRICE_LEVEL_MODERATE: "$$",
    PRICE_LEVEL_EXPENSIVE: "$$$",
    PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
  };
  return map[level] ?? level.replace("PRICE_LEVEL_", "").toLowerCase();
};

export const statusBadgeClass = (status: string) => {
  switch (status) {
    case "analyzed":
      return "bg-emerald-500 text-white";
    case "scraped":
      return "bg-blue-500 text-white";
    case "failed":
      return "bg-rose-500 text-white";
    default:
      return "bg-slate-200 text-slate-700";
  }
};

export const verdictLabel = (v: string) =>
  ({
    we_cheaper: "We're cheaper",
    they_cheaper: "They're cheaper",
    similar: "Similar",
    not_comparable: "Not comparable",
  } as Record<string, string>)[v] ?? v;

export const verdictClass = (v: string) =>
  ({
    we_cheaper: "bg-emerald-100 text-emerald-700",
    they_cheaper: "bg-rose-100 text-rose-700",
    similar: "bg-slate-100 text-slate-600",
    not_comparable: "bg-amber-100 text-amber-700",
  } as Record<string, string>)[v] ?? "bg-slate-100 text-slate-600";

// impact: high is good (green). effort: high is bad (rose).
export const levelClass = (level: string, goodWhenHigh: boolean) => {
  if (level === "medium") return "bg-amber-100 text-amber-700";
  const isHigh = level === "high";
  return isHigh === goodWhenHigh
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
};
