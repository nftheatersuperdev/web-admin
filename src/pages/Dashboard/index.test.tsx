import { screen } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import Dashboard from 'pages/Dashboard'

describe('Dashboard', () => {
  it('should show Dashboard', () => {
    renderComponent(<Dashboard />)
    expect(screen.getByText('Overall')).toBeInTheDocument()
  })
})
