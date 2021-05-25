import React, { ComponentType } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from './Header'

export interface LayoutRouteProps {
  component: ComponentType
  exact?: boolean
  path: string
  noHeader?: boolean
}

const Main = styled.main`
  padding: 20px;
`

export default function LayoutRoute({
  component: Component,
  exact = true,
  path,
  noHeader,
}: LayoutRouteProps): JSX.Element {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <React.Fragment>
          {noHeader ? null : <Header />}
          <Main>
            {/* @ts-expect-error TODO */}
            <Component {...props} />
          </Main>
        </React.Fragment>
      )}
    />
  )
}
