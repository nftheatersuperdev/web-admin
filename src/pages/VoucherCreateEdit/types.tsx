import { VoucherBff } from 'services/web-bff/voucher.type'

export interface VoucherCreateEditParams {
  voucherCode: string
}

export interface VoucherDataAndRefetchProps {
  voucher?: VoucherBff
  refetch: () => void
}

export interface VoucherAbleToEditProps extends VoucherDataAndRefetchProps {
  isEdit: boolean
}
