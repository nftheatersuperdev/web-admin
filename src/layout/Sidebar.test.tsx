import { screen } from '@testing-library/react'
import { noop, renderComponent } from 'tests/utils'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('should show sidebar items', () => {
    renderComponent(<Sidebar isOpen={true} onSidebarToggle={noop} />)
    expect(screen.getByRole('presentation')).toBeInTheDocument()
  })
})
