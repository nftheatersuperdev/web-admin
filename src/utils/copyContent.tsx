import toast from 'react-hot-toast'

export const copyText = (text: string): void => {
  navigator.clipboard.writeText(text as string)
  toast.success('Copied!!!')
}
