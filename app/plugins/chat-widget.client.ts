declare global {
  interface Window {
    ChatWidget?: {
      initChatWidget: (config: { agentId: string }) => void
    }
  }
}

export default defineNuxtPlugin(() => {
  const initWidget = () => {
    if (window.ChatWidget?.initChatWidget) {
      window.ChatWidget.initChatWidget({
        agentId: 'd97c2ca5-19fc-47c9-90fb-ee552735f8e9'
      })
    } else {
      // Retry briefly if script is still loading
      setTimeout(initWidget, 200)
    }
  }

  onNuxtReady(() => {
    initWidget()
  })
})