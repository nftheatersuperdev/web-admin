import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import { routes, ROUTE_PATHS } from './routes'

// eslint-disable-next-line
// @ts-expect-error
function LayoutRoute({ component: Component, exact, path, noHeader, ...rest }) {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <React.Fragment>
          {noHeader ? null : <Header />}
          <main>
            <Component {...props} />
          </main>
        </React.Fragment>
      )}
    />
  )
}

function App(): JSX.Element {
  return (
    <React.Suspense fallback="TODO">
      <Router>
        <Switch>
          {routes.map(({ noHeader, exact, path, component }) => (
            <LayoutRoute
              key={path}
              exact={exact}
              noHeader={noHeader}
              path={path}
              component={component}
            />
          ))}
          <Redirect to={ROUTE_PATHS.ROOT} />
        </Switch>
      </Router>
    </React.Suspense>
  )
}

export default App
