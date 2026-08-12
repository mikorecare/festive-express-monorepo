export const useOrders = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase

  const authHeaders = (): Record<string, string> => {
    const token =
      useCookie('auth_token').value ||
      (import.meta.client ? localStorage.getItem('token') : null)

    if (!token) return { Accept: 'application/json' }
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }

  const getOrders = async (page = 1, status = '') => {
    return await $fetch(`${API_BASE}/orders`, {
      query: { page, status },
      headers: authHeaders()
    })
  }

  const deleteOrder = async (id: number) => {
    const token =
      useCookie('auth_token').value ||
      (import.meta.client ? localStorage.getItem('token') : null)

    console.log('useOrders token:', token)

    return await $fetch(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json'
      }
    })
  }

  return {
    getOrders,
    deleteOrder
  }
}