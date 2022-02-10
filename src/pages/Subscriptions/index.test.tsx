import { screen } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import Subscriptions from './index'

describe('Subscriptions', () => {
  it('should render Omise button', () => {
    renderComponent(<Subscriptions />)
    expect(screen.getByRole('button', { name: 'Open Omise' })).toBeInTheDocument()
  })
})
