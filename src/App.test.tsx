import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render correct app header', () => {
    render(<App />)
    expect(screen.getByText(/EVme/i)).toBeInTheDocument()
  })
})
