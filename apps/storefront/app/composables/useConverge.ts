type PayResult = {
  ssl_txn_id?: string
  ssl_approval_code?: string
  [key: string]: any
}

export const useConverge = () => {
  const isPaying = ref(false)

  const loadScript = () => {
    return new Promise<void>((resolve, reject) => {
      if ((window as any).PayWithConverge) {
        resolve()
        return
      }
      const demo = true // match CONVERGE_DEMO
      const src = demo
        ? 'https://api.demo.convergepay.com/hosted-payments/PayWithConverge.js'
        : 'https://api.convergepay.com/hosted-payments/PayWithConverge.js'

      const s = document.createElement('script')
      s.src = src
      s.async = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Failed to load Converge script'))
      document.head.appendChild(s)
    })
  }

  const getToken = async (payload: {
    amount: number
    first_name: string
    last_name: string
    email: string
    invoice_number?: string
  }) => {
    return await $fetch<{ token: string }>('/api/converge/token', {
      method: 'POST',
      body: payload,
    })
  }

  const openLightbox = (token: string) => {
    return new Promise<PayResult>((resolve, reject) => {
      const PayWithConverge = (window as any).PayWithConverge
      if (!PayWithConverge) {
        reject(new Error('Converge script not loaded'))
        return
      }

      PayWithConverge.open(
        { ssl_txn_auth_token: token },
        {
          onError: (err: any) => reject(new Error(err || 'Payment error')),
          onCancelled: () => reject(new Error('cancelled')),
          onDeclined: (res: any) => reject(Object.assign(new Error('declined'), { res })),
          onApproval: (res: PayResult) => resolve(res),
        }
      )
    })
  }

  /**
   * Full flow: token → lightbox → approval payload
   */
  const pay = async (opts: {
    amount: number
    first_name: string
    last_name: string
    email: string
    invoice_number?: string
  }) => {
    isPaying.value = true
    try {
      await loadScript()
      const { token } = await getToken(opts)
      const result = await openLightbox(token)
      return result
    } finally {
      isPaying.value = false
    }
  }

  return {
    isPaying,
    loadScript,
    getToken,
    openLightbox,
    pay,
  }
}