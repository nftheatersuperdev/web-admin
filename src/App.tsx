import React from 'react'
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom'
import { routes, ROUTE_PATHS } from './routes'
import LayoutRoute from './layout/LayoutRoute'

function App(): JSX.Element {
  return (
    <React.Suspense fallback="TODO">
      <Router>
        <Switch>
          {routes.map(({ exact, path, component }) => (
            <LayoutRoute key={path} exact={exact} path={path} component={component} />
          ))}
          <Redirect to={ROUTE_PATHS.ROOT} />
        </Switch>
      </Router>
    </React.Suspense>
  )
}

export default App
