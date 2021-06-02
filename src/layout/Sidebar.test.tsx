import { screen } from '@testing-library/react'
import { noop, renderComponent } from 'tests/utils'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('should show sidebar items', () => {
    renderComponent(<Sidebar isOpen={true} onSidebarToggle={noop} />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Users')).toBeInTheDocument()
    expect(screen.getByText('Cars')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Subscriptions')).toBeInTheDocument()
  })
})
