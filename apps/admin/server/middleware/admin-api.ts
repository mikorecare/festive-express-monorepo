import { getSupabase } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname;

  // Skip auth for login and callback routes
  if (path.startsWith("/api/auth/login") ||
    path.startsWith("/api/auth/azure") ||
    path.startsWith("/api/auth/verify")) {
    return;
  }

  if (!path.startsWith("/api")) return;

  try {
    // Get the access token from cookies manually
    const accessToken = getCookie(event, 'sb-access-token');

    if (!accessToken) {
      console.log('No access token found in cookies');
      throw createError({
        statusCode: 401,
        message: "Unauthorized - No access token"
      });
    }

    const supabase = getSupabase();

    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      console.log('Token verification failed:', error?.message);
      throw createError({
        statusCode: 401,
        message: "Unauthorized - Invalid or expired token"
      });
    }

    event.context.user = user;
  } catch (error) {
    console.error('Auth error:', error);
    throw createError({
      statusCode: 401,
      message: "Unauthorized - Authentication failed"
    });
  }
});