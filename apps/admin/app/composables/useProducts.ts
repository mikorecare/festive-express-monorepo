// composables/useProducts.ts
export const useProducts = () => {
  const config = useRuntimeConfig()
  const API_BASE = config.public.apiBase || 'http://localhost:8000/api'

  const authHeaders = (): Record<string, string> => {
    const token = useCookie('auth_token').value
    if (!token) return {}
    return { Authorization: `Bearer ${token}` }
  }

  const getProducts = async (params: Record<string, any> = {}) => {
    return await $fetch(`${API_BASE}/products`, {
      headers: authHeaders(),
      query: params
    })
  }

  const getProduct = async (id: number) => {
    return await $fetch(`${API_BASE}/products/${id}`, {
      headers: authHeaders()
    })
  }

  const createProduct = async (productData: any) => {
    return await $fetch(`${API_BASE}/products`, {
      method: 'POST',
      body: productData,
      headers: authHeaders()
    })
  }

  const updateProduct = async (id: number, productData: any) => {
    return await $fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      body: productData,
      headers: authHeaders()
    })
  }

  const deleteProduct = async (id: number) => {
    return await $fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    })
  }

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}