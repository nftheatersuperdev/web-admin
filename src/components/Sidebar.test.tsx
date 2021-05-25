import React from 'react'
import { screen } from '@testing-library/react'
// eslint-disable-next-line
import { renderComponent } from '../tests/utils'
import Sidebar from './Sidebar'

describe('Sidebar', () => {
  it('should show correct home button', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    renderComponent(<Sidebar isOpen={true} setIsSidebarOpen={() => {}} />)
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })
})
