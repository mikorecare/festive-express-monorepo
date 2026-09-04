import { createClient } from "@supabase/supabase-js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const categoryId = String(query.category_id || "").trim();
  const stock = String(query.stock || "").trim();
  const status = String(query.status || "").trim();
  const search = String(query.search || "").trim();

  const config = useRuntimeConfig();
  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  );

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("products")
    .select("*, categories(id, name)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (categoryId) q = q.eq("category_id", categoryId);
  if (status) q = q.eq("status", status);

  if (stock === "instock") q = q.gt("stock", 0);
  else if (stock === "outofstock") q = q.lte("stock", 0);
  else if (stock === "lowstock") q = q.gt("stock", 0).lte("stock", 10);

  if (search) {
    q = q.or(`name.ilike.%${search}%,sku.ilike.%${search}%`);
  }

  const { data, error, count } = await q;
  if (error) {
    console.error("products list", error);
    throw createError({ statusCode: 500, message: "Failed to load products" });
  }

  return {
    products: data || [],
    total: count || 0,
    page,
    limit,
  };
});
