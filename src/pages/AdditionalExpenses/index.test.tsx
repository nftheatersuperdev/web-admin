import { screen } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import AdditionalExpenses from 'pages/AdditionalExpenses'

describe('AdditionalExpenses', () => {
  it('should show "Create Additional Expense" button', () => {
    renderComponent(<AdditionalExpenses />)
    expect(screen.getByText('Create Additional Expense')).toBeInTheDocument()
  })
})
