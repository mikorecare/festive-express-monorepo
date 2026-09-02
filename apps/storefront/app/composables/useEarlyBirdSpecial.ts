export const useEarlyBirdSpecial = () => {
  const supabase = useSupabaseClient();

  const earlyBirdExpiresAt = useState<string | null>(
    "earlyBirdExpiresAt",
    () => null,
  );
  const earlyBirdEnabled = useState<boolean>("earlyBirdEnabled", () => false);
  const earlyBirdTitle = useState<string>(
    "earlyBirdTitle",
    () => "Early Bird Special Pricing",
  );
  const earlyBirdDescription = useState<string>(
    "earlyBirdDescription",
    () => "See packages for details.",
  );
  const earlyBirdIconUrl = useState<string>("earlyBirdIconUrl", () => "");
  const earlyBirdIconSecondaryUrl = useState<string>(
    "earlyBirdIconSecondaryUrl",
    () => "",
  );

  const isEarlyBirdActive = (enabled?: boolean, expiresAt?: string | null) => {
    if (!enabled) return false;
    if (!expiresAt) return true;
    return new Date(expiresAt).getTime() > Date.now();
  };

  const isEarlyBirdLive = computed(() =>
    isEarlyBirdActive(earlyBirdEnabled.value, earlyBirdExpiresAt.value),
  );

  const effectivePrice = (
    price: number | string | null | undefined,
    salePrice: number | string | null | undefined,
  ) => {
    const sale = Number(salePrice);
    const base = Number(price ?? 0);
    if (
      isEarlyBirdLive.value &&
      salePrice != null &&
      salePrice !== "" &&
      !Number.isNaN(sale) &&
      sale > 0
    ) {
      return sale;
    }
    return base;
  };

  const showSale = (salePrice: number | string | null | undefined) =>
    isEarlyBirdLive.value &&
    salePrice != null &&
    salePrice !== "" &&
    Number(salePrice) > 0;

  const formatEndsLabel = computed(() => {
    if (!earlyBirdExpiresAt.value) return null;
    return new Date(earlyBirdExpiresAt.value).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  });

  const loadEarlyBird = async () => {
    if (!import.meta.client) return;
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", [
          "early_bird_enabled",
          "early_bird_expires_at",
          "early_bird_title",
          "early_bird_description",
          "early_bird_icon_url",
          "early_bird_icon_secondary_url",
        ]);

      if (error) throw error;

      const rows = (data || []) as { key: string; value: string | null }[];
      for (const row of rows) {
        const value =
          typeof row.value === "string"
            ? row.value.replace(/^"|"$/g, "")
            : row.value;

        if (row.key === "early_bird_expires_at") {
          earlyBirdExpiresAt.value = value;
        }
        if (row.key === "early_bird_enabled") {
          earlyBirdEnabled.value =
            value === "true" || value === "1" || value === "yes";
        }
        if (row.key === "early_bird_title" && value) {
          earlyBirdTitle.value = value;
        }
        if (row.key === "early_bird_description" && value) {
          earlyBirdDescription.value = value;
        }
        if (row.key === "early_bird_icon_url") {
          earlyBirdIconUrl.value = value || "";
        }
        if (row.key === "early_bird_icon_secondary_url") {
          earlyBirdIconSecondaryUrl.value = value || "";
        }
      }
    } catch (e) {
      console.error("loadEarlyBird", e);
      earlyBirdEnabled.value = false;
      earlyBirdExpiresAt.value = null;
      earlyBirdIconUrl.value = "";
      earlyBirdIconSecondaryUrl.value = "";
    }
  };

  return {
    earlyBirdExpiresAt,
    earlyBirdEnabled,
    earlyBirdTitle,
    earlyBirdDescription,
    earlyBirdIconUrl,
    earlyBirdIconSecondaryUrl,
    isEarlyBirdLive,
    isEarlyBirdActive,
    effectivePrice,
    showSale,
    formatEndsLabel,
    loadEarlyBird,
  };
};
