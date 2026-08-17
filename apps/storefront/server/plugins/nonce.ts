
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html, { event }) => {
        const nonce = event.context?.nonce

        if (!nonce) return

        const addNonceToScripts = (chunk: string) => {
            let result = chunk.replace(/<script(?![^>]*\bnonce\b)/g, `<script nonce="${nonce}"`)

            result = result.replace(/<script(?![^>]*\bnonce\b)(?![\s\S]*?src=)/g, `<script nonce="${nonce}"`)

            return result
        }

        if (Array.isArray(html.head)) {
            html.head = html.head.map(addNonceToScripts)
        }
        if (Array.isArray(html.body)) {
            html.body = html.body.map(addNonceToScripts)
        }
    })
})