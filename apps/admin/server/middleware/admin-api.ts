import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (!path.startsWith("/api")) return;

  const authUser = await serverSupabaseUser(event);
  if (!authUser) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  event.context.user = authUser;
});