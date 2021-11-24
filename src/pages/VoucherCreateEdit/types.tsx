import { Voucher } from 'services/evme.types'

export interface VoucherCreateEditParams {
  voucherId: string
}

export interface VoucherDataAndRefetchProps {
  voucher?: Voucher
  refetch: () => void
}

export interface VoucherAbleToEditProps extends VoucherDataAndRefetchProps {
  isEdit: boolean
}
