import { screen, fireEvent } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import ConfirmDialog from 'components/ConfirmDialog'

describe('ConfirmDialog', () => {
  it('should visible confirm dialog', () => {
    renderComponent(<ConfirmDialog open title="This is a confirmation dialog" />)
    expect(screen.getByText('This is a confirmation dialog')).toBeVisible()
  })

  it('should invisible confirm dialog', () => {
    renderComponent(<ConfirmDialog open={false} title="This is a confirmation dialog" />)
    expect(screen.queryByText('This is a confirmation dialog')).not.toBeInTheDocument()
  })

  it('should currect call the onClick handler when click on confirm button', () => {
    const handleConfirmClick = jest.fn()

    renderComponent(
      <ConfirmDialog open title="This is a confirmation dialog" onConfirm={handleConfirmClick} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'confirm' }))

    expect(handleConfirmClick).toHaveBeenCalledTimes(1)
  })

  it('should currect call the onClick handler when click on cancel button', () => {
    const handleCancelClick = jest.fn()

    renderComponent(
      <ConfirmDialog open title="This is a confirmation dialog" onCancel={handleCancelClick} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'cancel' }))

    expect(handleCancelClick).toHaveBeenCalledTimes(1)
  })
})
