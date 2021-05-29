import { screen } from '@testing-library/react'
import { noop, renderComponent } from 'tests/utils'
import Header from 'layout/Header'

describe('Header', () => {
  it('should show correct title', () => {
    renderComponent(<Header onSidebarToggle={noop} />)
    expect(screen.getByText('EVme')).toBeInTheDocument()
  })

  it('should not show sidebar toggle on a desktop device', () => {
    renderComponent(<Header onSidebarToggle={noop} />)
    expect(screen.queryByLabelText('Sidebar Toggle')).not.toBeInTheDocument()
  })
})
