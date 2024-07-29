import { useToast } from 'primevue/usetoast'
import { NOTIFICATION_LIFETIME } from '../constants'

type NotifyType = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
type NotifyMessage = string

export function useNotifications() {
  const toast = useToast()

  const notify = (type: NotifyType, message: NotifyMessage, detail?: NotifyMessage) => {
    const params = {
      severity: type,
      summary: message,
      life: NOTIFICATION_LIFETIME,
    }

    if (detail) {
      params.detail = detail
    }

    toast.add(params)
  }

  const successNotify = (message: NotifyMessage, detail?: NotifyMessage) => notify('success', message, detail)
  const infoNotify = (message: NotifyMessage, detail?: NotifyMessage) => notify('info', message, detail)
  const warnNotify = (message: NotifyMessage, detail?: NotifyMessage) => notify('warn', message, detail)
  const errorNotify = (message: NotifyMessage, detail?: NotifyMessage) => notify('error', message, detail)
  const secondaryNotify = (message: NotifyMessage, detail?: NotifyMessage) => notify('secondary', message, detail)
  const contrastNotify = (message: NotifyMessage, detail?: NotifyMessage) => notify('contrast', message, detail)


  return {
    successNotify,
    infoNotify,
    warnNotify,
    errorNotify,
    secondaryNotify,
    contrastNotify,
  }
}
