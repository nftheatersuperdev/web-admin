import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { noop, renderComponent } from 'tests/utils'
import Header from 'layout/Header'

describe('Header', () => {
  it('should show correct title', () => {
    renderComponent(<Header onSidebarToggle={noop} />)
    expect(screen.getByAltText('EVme Logo')).toBeInTheDocument()
  })

  it('should not show sidebar toggle on a desktop device', () => {
    renderComponent(<Header onSidebarToggle={noop} />)
    expect(screen.queryByLabelText('Sidebar Toggle')).not.toBeInTheDocument()
  })

  it('should be able to switch languages', async () => {
    renderComponent(<Header onSidebarToggle={noop} />)
    userEvent.click(
      screen.getByRole('button', {
        name: 'Change Language',
      })
    )

    expect(await screen.findByRole('button', { name: 'เปลี่ยนภาษา' })).toBeInTheDocument()
  })
})
