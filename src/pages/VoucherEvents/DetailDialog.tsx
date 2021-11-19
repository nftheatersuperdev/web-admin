import { VoucherEvents as VoucherEventsType } from 'services/evme.types'

interface DetailDialogProps {
  open: boolean
  onClose: () => void
  data: VoucherEventsType
}

export default function DetailDialog({ open, onClose, data }: DetailDialogProps): JSX.Element {
  const handleOnClose = () => onClose()

  console.log('open ->', open)
  console.log('data ->', data)

  // eslint-disable-next-line react/button-has-type
  return <button onClick={() => handleOnClose()}>Lorem</button>
}
