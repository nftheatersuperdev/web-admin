import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { theme } from 'GlobalStyles'
import { createMemoryHistory, History } from 'history'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Route, Router } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

interface CustomRenderOptions extends RenderOptions {
  route?: string
  path?: string
  viewport?: 'xs' | 'sm' | ' md' | ' lg' | ' xl'
  initialStore?: Record<string, string>
  historyState?: Record<string, string>
  history?: History
}

export const testInitialStore = {}

// Test render functions
export function renderComponent(
  children: React.ReactNode,
  renderConfig: CustomRenderOptions = {}
): RenderResult & { history: History<unknown> } {
  const {
    route = '/',
    path,
    historyState,
    viewport = 'lg',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...remainingOptions
  } = renderConfig
  if (historyState) {
    history.push(route, historyState)
  }

  const testTheme = { ...theme, props: { MuiWithWidth: { initialWidth: viewport } } }
  const queryClient = new QueryClient()

  const view = render(
    <ThemeProvider theme={testTheme}>
      <QueryClientProvider client={queryClient}>
        <Router history={history}>
          <Route path={path}>{children}</Route>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>,
    remainingOptions
  )
  // https://github.com/testing-library/react-testing-library/issues/218#issuecomment-436730757
  return {
    ...view,
    rerender: (newUi: React.ReactNode) =>
      renderComponent(newUi, {
        container: view.container,
        baseElement: view.baseElement,
      }),
    // adding `history` to the returned utilities to allow us to reference it in our tests
    // (just try to avoid using this to test implementation details).
    history,
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop(): void {}