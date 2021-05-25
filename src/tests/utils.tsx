import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { createMemoryHistory, History } from 'history'
import React from 'react'
import { Route, Router } from 'react-router-dom'

interface CustomRenderOptions extends RenderOptions {
  route?: string
  path?: string
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
    history = createMemoryHistory({ initialEntries: [route] }),
    ...remainingOptions
  } = renderConfig
  if (historyState) {
    history.push(route, historyState)
  }

  const view = render(
    <Router history={history}>
      <Route path={path}>{children}</Route>
    </Router>,
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
