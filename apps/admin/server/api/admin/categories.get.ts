import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.supabaseUrl || config.public.supabase.url,
    config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("categories list", error);
    throw createError({
      statusCode: 500,
      message: "Failed to load categories",
    });
  }

  return { categories: data || [] };
});
