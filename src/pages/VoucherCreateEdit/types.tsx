import { Voucher } from 'services/evme.types'

export interface VoucherCreateEditParams {
  voucherId: string
}

export interface VoucherGeneralInformationTabProps {
  voucher?: Voucher
  isEdit: boolean
  refetch: () => void
}
