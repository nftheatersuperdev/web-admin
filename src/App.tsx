import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import { User } from './pages/User'

// eslint-disable-next-line
// @ts-expect-error
function LayoutRoute({ component: Component, exact, path, noHeader, ...rest }) {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <React.Fragment>
          <Header />
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
    <Router>
      <Switch>
        <LayoutRoute noHeader exact path="/" component={User} />
        <Redirect to="/" />
      </Switch>
    </Router>
  )
}

export default App
