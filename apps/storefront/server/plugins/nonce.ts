export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        const nonce = event.context?.nonce

        if (!nonce) return

        const addNonceToScripts = (chunk: string) => {
            if (typeof chunk !== 'string') return chunk

            chunk = chunk.replace(
                /<script\s+([^>]*?)src=/g,
                `<script nonce="${nonce}" $1src=`
            )

            chunk = chunk.replace(
                /<script(?!\s+[^>]*?src=)(?!\s+[^>]*?nonce=)([^>]*)>/g,
                `<script nonce="${nonce}" $1>`
            )

            chunk = chunk.replace(
                /<script\s+([^>]*?)(?<!nonce=)(?<!nonce\s)>/g,
                `<script nonce="${nonce}" $1>`
            )

            return chunk
        }

        if (Array.isArray(html.head)) {
            html.head = html.head.map(addNonceToScripts)
        }

        if (Array.isArray(html.body)) {
            html.body = html.body.map(addNonceToScripts)
        }
    })
})