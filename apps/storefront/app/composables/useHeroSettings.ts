export const useHeroSettings = () => {
  const supabase = useSupabaseClient();

  const heroH1White = useState("heroH1White", () => "RENT THE MAGIC");
  const heroH1Orange = useState("heroH1Orange", () => "ENJOY THE SEASON");
  const heroDescription1 = useState(
    "heroDescription1",
    () => "Giftwrapped in One Simple Package.",
  );
  const heroDescription2 = useState(
    "heroDescription2",
    () => "(No ladders. No tangled cords. No storage. No stress.)",
  );
  const heroButtonLabel = useState(
    "heroButtonLabel",
    () => "Explore the Packages",
  );
  const heroCountdownEnabled = useState("heroCountdownEnabled", () => true);

  const unwrap = (value: unknown) => {
    if (value == null) return "";
    if (typeof value === "string") return value.replace(/^"|"$/g, "");
    return String(value);
  };

  const loadHeroSettings = async () => {
    if (!import.meta.client) return;
    try {
      type SettingRow = {
        key: string;
        value: string | null;
      };
      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", [
          "hero_h1_white",
          "hero_h1_orange",
          "hero_description_1",
          "hero_description_2",
          "hero_button_label",
          "hero_countdown_enabled",
        ]);

      if (error) throw error;

      const rows = (data || []) as SettingRow[];

      for (const row of rows) {
        const value = unwrap(row.value);
        if (row.key === "hero_h1_white" && value) heroH1White.value = value;
        if (row.key === "hero_h1_orange" && value) heroH1Orange.value = value;
        if (row.key === "hero_description_1" && value)
          heroDescription1.value = value;
        if (row.key === "hero_description_2" && value)
          heroDescription2.value = value;
        if (row.key === "hero_button_label" && value)
          heroButtonLabel.value = value;
        if (row.key === "hero_countdown_enabled") {
          heroCountdownEnabled.value =
            value === "true" || value === "1" || value === "yes";
        }
      }
    } catch (e) {
      console.error("loadHeroSettings", e);
    }
  };

  return {
    heroH1White,
    heroH1Orange,
    heroDescription1,
    heroDescription2,
    heroButtonLabel,
    heroCountdownEnabled,
    loadHeroSettings,
  };
};
