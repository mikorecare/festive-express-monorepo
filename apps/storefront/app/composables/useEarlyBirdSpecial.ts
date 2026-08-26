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
        ]);

      if (error) throw error;

      const rows = (data || []) as { key: string; value: string | null }[];
      for (const row of rows) {
        if (row.key === "early_bird_expires_at") {
          earlyBirdExpiresAt.value = row.value;
        }
        if (row.key === "early_bird_enabled") {
          earlyBirdEnabled.value =
            row.value === "true" || row.value === "1" || row.value === "yes";
        }
        if (row.key === "early_bird_title" && row.value) {
          earlyBirdTitle.value = row.value;
        }
        if (row.key === "early_bird_description" && row.value) {
          earlyBirdDescription.value = row.value;
        }
      }
    } catch (e) {
      console.error("loadEarlyBird", e);
      earlyBirdEnabled.value = false;
      earlyBirdExpiresAt.value = null;
    }
  };

  return {
    earlyBirdExpiresAt,
    earlyBirdEnabled,
    earlyBirdTitle,
    earlyBirdDescription,
    isEarlyBirdLive,
    isEarlyBirdActive,
    effectivePrice,
    showSale,
    formatEndsLabel,
    loadEarlyBird,
  };
};
