import * as Yup from 'yup'
import { FormikValues } from 'formik'
import { TFunction, Namespace } from 'react-i18next'
import { AdditionalExpenseInput, SubFilter } from 'services/evme.types'

export const transformToMutationInput = (data: FormikValues): AdditionalExpenseInput => {
  const { subscriptionId, price, type, status, noticeDate, note } = data
  return {
    subscriptionId,
    price,
    type,
    status,
    noticeDate: noticeDate ? noticeDate.toISOString() : null,
    note,
  }
}

interface SelectOption {
  label: string
  value: string
}

export const getExpenseTypeOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('additionalExpense.type.maintenance'),
    value: 'maintenance',
  },
  {
    label: t('additionalExpense.type.insurance'),
    value: 'insurance',
  },
  {
    label: t('additionalExpense.type.service'),
    value: 'service',
  },
  {
    label: t('additionalExpense.type.repair'),
    value: 'repair',
  },
  {
    label: t('additionalExpense.type.replacement'),
    value: 'replacement',
  },
]

export const getExpenseStatusOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('additionalExpense.status.created'),
    value: 'created',
  },
  {
    label: t('additionalExpense.status.informed'),
    value: 'informed',
  },
  {
    label: t('additionalExpense.status.pending'),
    value: 'pending',
  },
  {
    label: t('additionalExpense.status.paid'),
    value: 'paid',
  },
  {
    label: t('additionalExpense.status.cancelled'),
    value: 'cancelled',
  },
]

export const validationSchema = Yup.object({
  subscriptionId: Yup.string().required('Subscription ID is required'),
  price: Yup.number().positive('Price must be positive number').required('Price is required'),
  type: Yup.string().required('Type of expense is required'),
  noticeDate: Yup.date().required('Date of expense notice is required'),
  status: Yup.string().required('Status is required'),
  note: Yup.string().notRequired(),
})

export const getSubFilterByKeyword = (keyword: string | null | undefined): SubFilter => {
  if (!keyword) {
    return {}
  }

  return {
    or: [
      {
        user: {
          firstName: { iLike: `${keyword}%` },
        },
      },
      {
        car: {
          plateNumber: { iLike: `${keyword}%` },
        },
      },
    ],
  }
}
