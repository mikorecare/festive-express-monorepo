export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (!path.startsWith("/api/admin")) return;

  const user = await event.context.user;
  // or Nuxt supabase server:
  const { serverSupabaseUser } = await import("#supabase/server");
  const authUser = await serverSupabaseUser(event);

  if (!authUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  event.context.adminUser = authUser;
});
