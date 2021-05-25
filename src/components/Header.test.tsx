import React from 'react'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
// eslint-disable-next-line
import { renderComponent } from '../tests/utils'
import Header from './Header'

describe('Header', () => {
  it('should show correct home button', () => {
    renderComponent(<Header />)
    expect(screen.getByLabelText('Home Button')).toBeInTheDocument()
  })

  it('should show correct title', () => {
    renderComponent(<Header />)
    expect(screen.getByText('EVme')).toBeInTheDocument()
  })

  it('should be able to open sidebar', () => {
    renderComponent(<Header />)
    userEvent.click(screen.getByLabelText('Home Button'))
    expect(screen.getByText('HOME')).toBeInTheDocument()
  })
})
