export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const amount = Number(body?.amount)
  if (!amount || amount < 0.01) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid amount' })
  }

  const demo = config.convergeDemo !== false
  const url = demo
    ? 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
    : 'https://api.convergepay.com/hosted-payments/transaction_token'

  const form = new URLSearchParams()
  form.set('ssl_merchant_id', config.convergeMerchantId)
  form.set('ssl_user_id', config.convergeUserId)
  form.set('ssl_pin', config.convergePin)
  form.set('ssl_transaction_type', 'ccsale')
  form.set('ssl_amount', amount.toFixed(2))
  form.set('ssl_first_name', String(body.first_name || ''))
  form.set('ssl_last_name', String(body.last_name || ''))
  form.set('ssl_email', String(body.email || ''))
  form.set('ssl_invoice_number', String(body.invoice_number || ''))

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  const text = await res.text()

  let token = text.trim()
  const xmlMatch = text.match(/<ssl_txn_auth_token>(.*?)<\/ssl_txn_auth_token>/i)
  if (xmlMatch?.[1]) token = xmlMatch[1].trim()

  if (!token || token.length < 10 || /error|denied|invalid/i.test(token)) {
    console.error('Converge token failed:', text)
    throw createError({
      statusCode: 422,
      statusMessage: 'Unable to start Converge payment',
      data: { debug: process.env.NODE_ENV === 'development' ? text : undefined },
    })
  }

  return { token }
})