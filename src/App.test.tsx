import { screen } from '@testing-library/react'
import { renderComponent } from 'tests/utils'
import App from './App'

describe('App', () => {
  it('should render correct app header', () => {
    renderComponent(<App />)
    expect(screen.getByText(/EVme/i)).toBeInTheDocument()
  })
})
