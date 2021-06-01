import { screen } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import Car from 'pages/Car'

describe('Car', () => {
  it('should show "New Car" button', () => {
    renderComponent(<Car />)
    expect(screen.getByText('New Car')).toBeInTheDocument()
  })
})
