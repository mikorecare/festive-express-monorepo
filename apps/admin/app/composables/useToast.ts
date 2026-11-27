type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading' | 'neutral'

export const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = 'success',
    duration: number = 4500
  ) => {
    if (import.meta.server) return

    const toast = document.createElement('div')

    const styles: Record<ToastType, { color: string; icon: string }> = {
      success: { color: '#27ae60', icon: '✓' },
      error: { color: '#e74c3c', icon: '✕' },
      info: { color: '#2980b9', icon: 'ℹ' },
      warning: { color: '#e67e22', icon: '⚠' },
      loading: { color: '#8e44ad', icon: '⏳' },
      neutral: { color: '#34495e', icon: '●' },
    }

    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: 'white',
      zIndex: '10000',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      minWidth: '300px',
      maxWidth: '450px',
      fontWeight: '500',
      transition: 'all 0.4s ease',
      backgroundColor: styles[type].color,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    })

    // Notification icon
    const icon = document.createElement('span')
    icon.textContent = styles[type].icon
    icon.style.fontSize = '20px'

    // Notification message
    const content = document.createElement('span')
    content.textContent = message
    content.style.flex = '1'

    // Close button
    const closeButton = document.createElement('button')
    closeButton.textContent = '×'
    closeButton.setAttribute('aria-label', 'Close notification')

    Object.assign(closeButton.style, {
      background: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '22px',
      cursor: 'pointer',
      padding: '0',
      marginLeft: '8px',
    })

    const dismiss = () => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(-10px)'
      setTimeout(() => toast.remove(), 400)
    }

    closeButton.onclick = dismiss

    toast.setAttribute('role', type === 'error' ? 'alert' : 'status')
    toast.append(icon, content, closeButton)
    document.body.appendChild(toast)

    // A duration of 0 keeps the toast visible
    if (duration > 0) {
      setTimeout(dismiss, duration)
    }

    return { dismiss }
  }

  return { showToast }
}