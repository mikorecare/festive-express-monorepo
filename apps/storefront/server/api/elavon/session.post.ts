export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const formData = new URLSearchParams()
    formData.append('ssl_merchant_id', process.env.ELAVON_MERCHANT_ID!)
    formData.append('ssl_user_id', process.env.ELAVON_USER_ID!)
    formData.append('ssl_pin', process.env.ELAVON_PIN!)
    formData.append('ssl_transaction_type', 'ccsale')
    formData.append('ssl_amount', body.amount)
    formData.append('ssl_get_token', 'Y')

    try {

        // const responseText = await $fetch<string>('https://demo.convergepay.com/hosted-payments/transaction_token', {
        //     method: 'POST',
        //     body: formData.toString(),
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        // })

        // const params = new URLSearchParams(responseText)
        // const token = params.get('ssl_token')

        // if (!token) {
        //     throw createError({ statusCode: 400, message: 'Elavon Token Handshake Failed' })
        // }

        return { success: true }
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Payment gateway configuration error' })
    }
})