export default defineEventHandler((event) => {
  const sessionCookie = getCookie(event, 'admin_session')

  if (!sessionCookie) {
    return null
  }

  try {
    return JSON.parse(sessionCookie)
  } catch (e) {
    return null
  }
})