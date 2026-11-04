import { getAuthenticatedSupabase } from "../utils/auth";

const PUBLIC_API = [
  "/api/auth/login",
  "/api/auth/azure",
  "/api/auth/verify",
  "/api/track-order",
];

const clearAuthCookies = (event: any) => {
  const expired = { httpOnly: true, path: "/", maxAge: 0 };
  const expiredReadable = { httpOnly: false, path: "/", maxAge: 0 };
  setCookie(event, "sb-access-token", "", expired);
  setCookie(event, "sb-refresh-token", "", expired);
  setCookie(event, "sb-auth", "", expiredReadable);
  setCookie(event, "sb-user-id", "", expiredReadable);
};

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;
  if (!path.startsWith("/api")) return;
  if (PUBLIC_API.some((p) => path.startsWith(p))) return;

  try {
    const supabase = await getAuthenticatedSupabase(event);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error("Unauthorized");
    event.context.user = user;
  } catch {
    clearAuthCookies(event);
    throw createError({
      statusCode: 401,
      message: "Unauthorized - Invalid or expired token",
    });
  }
});