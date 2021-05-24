// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { format } from 'util'
import { server } from 'tests/mockServer/server'

// Fail the tests if we have a console.error or warning
const error = global.console.error
const warn = global.console.warn

global.console.error = function (...args: any) {
  error(...args)
  throw new Error(format(...args))
}

global.console.warn = function (...args: any) {
  warn(...args)
  throw new Error(format(...args))
}

beforeAll(() => {
  // If we encounter an un-mocked request in our unit tests,
  // print a warning message to the console.
  // https://mswjs.io/docs/api/setup-server/listen
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  jest.restoreAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
