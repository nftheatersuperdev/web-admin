import dayjs from 'dayjs'
import { Namespace, TFunction } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, DEFAULT_DATE_FORMAT_MONTH_TEXT } from 'utils'

export enum PackageStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

export const formatDateMonth = (date: string): string =>
  dayjs(date).format(DEFAULT_DATE_FORMAT_MONTH_TEXT)

export const formatDateMonthYearTime = (date: string): string =>
  dayjs(date).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)

export const publishedStatus = (isPublished: boolean, t: TFunction<Namespace>): string => {
  const stringText = isPublished
    ? t('subscriptionPackageManagement.table.cell.on')
    : t('subscriptionPackageManagement.table.cell.off')
  return stringText
}

export const packageStatusString = (status: string, t: TFunction<Namespace>): string => {
  switch (status) {
    case PackageStatus.Active:
      return t('subscriptionPackageManagement.table.cell.active')

    case PackageStatus.Inactive:
      return t('subscriptionPackageManagement.table.cell.inactive')

    case PackageStatus.Pending:
      return t('subscriptionPackageManagement.table.cell.pending')

    default:
      return ''
  }
}
