export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div')
    
    toast.style.position = 'fixed'
    toast.style.top = '20px'
    toast.style.right = '20px'
    toast.style.padding = '16px 24px'
    toast.style.borderRadius = '8px'
    toast.style.color = 'white'
    toast.style.zIndex = '10000'
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
    toast.style.minWidth = '300px'
    toast.style.fontWeight = '500'
    toast.style.transition = 'all 0.4s'

    if (type === 'success') {
      toast.style.backgroundColor = '#27ae60'
    } else {
      toast.style.backgroundColor = '#e74c3c'
    }

    toast.textContent = message
    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.opacity = '0'
      toast.style.transform = 'translateY(-10px)'
      setTimeout(() => toast.remove(), 500)
    }, 4500)
  }

  return { showToast }
}