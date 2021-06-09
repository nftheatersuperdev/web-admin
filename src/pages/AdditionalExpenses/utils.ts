import dayjs from 'dayjs'
import { AdditionalExpenseInput, AdditionalExpense } from 'services/evme.types'

export const transformToMutationInput = (data: AdditionalExpenseInput): AdditionalExpenseInput => {
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

export const transformToFormData = (data: AdditionalExpense): AdditionalExpenseInput => {
  const { subscriptionId, price, type, noticeDate, status, note } = data

  return {
    subscriptionId,
    price,
    type,
    noticeDate: noticeDate ? dayjs(noticeDate).format('YYYY-MM-DDTHH:mm:ss') : null,
    status,
    note,
  }
}

export const ExpenseTypes = ['maintenance', 'insurance', 'service', 'repair', 'replacement']
export const ExpenseStatuses = ['created', 'informed', 'pending', 'paid', 'cancelled']
