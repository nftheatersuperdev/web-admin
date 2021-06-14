import dayjs from 'dayjs'
import * as Yup from 'yup'
import { FormikValues } from 'formik'
import { AdditionalExpenseInput } from 'services/evme.types'

export const transformToMutationInput = (data: FormikValues): AdditionalExpenseInput => {
  const { subscriptionId, price, type, status, noticeDate, note } = data
  return {
    subscriptionId,
    price,
    type,
    status,
    noticeDate: noticeDate ? dayjs(noticeDate).toISOString() : null,
    note,
  }
}

export const ExpenseTypes = ['maintenance', 'insurance', 'service', 'repair', 'replacement']
export const ExpenseStatuses = ['created', 'informed', 'pending', 'paid', 'cancelled']

export const validationSchema = Yup.object({
  subscriptionId: Yup.string().required('Subscription ID is required'),
  price: Yup.number().positive('Price must be positive number').required('Price is required'),
  type: Yup.string().required('Type of expense is required'),
  noticeDate: Yup.string().required('Date of expense notice is required'),
  status: Yup.string().required('Status is required'),
  note: Yup.string().notRequired(),
})