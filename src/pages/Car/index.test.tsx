import { screen } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import Car from 'pages/Car'

describe('Car', () => {
  /**
   * @DESCRIPTION skip this test becase the ticket EV-1441 need to hide new car button
   */
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should show "New Car" button', () => {
    renderComponent(<Car />)
    expect(screen.getByText('New Car')).toBeInTheDocument()
  })
})
