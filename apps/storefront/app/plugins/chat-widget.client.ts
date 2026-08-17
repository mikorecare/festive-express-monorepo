declare global {
  interface Window {
    ChatWidget?: {
      initChatWidget: (config: { agentId: string }) => void
    }
  }
}

export default defineNuxtPlugin(() => {
  useHead({
    link: [
      {
        rel: 'stylesheet',
        href: 'https://embeddable-widgets.pages.dev/chat-widget.css'
      },
      {
        rel: 'stylesheet',
        href: '/css/chat-widget.css'
      }
    ],
    script: [
      {
        src: 'https://embeddable-widgets.pages.dev/chat-widget.umd.js',
        async: true,
        defer: true,
        onload: () => {
          if (window.ChatWidget?.initChatWidget) {
            window.ChatWidget.initChatWidget({
              agentId: 'd97c2ca5-19fc-47c9-90fb-ee552735f8e9'
            })
          }
        },
        onerror: (e) => {
          console.error('Failed to load chat widget:', e)
        }
      }
    ]
  })
})