import React from 'react'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should render user page', () => {
    render(<App />)
    const linkElement = screen.getByText(/user/i)
    expect(linkElement).toBeInTheDocument()
  })
})
