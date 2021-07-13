/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentType, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useAuthContext } from 'auth/AuthContext'
import { ROUTE_PATHS } from 'routes'
import Header from 'layout/Header'
import Sidebar from './Sidebar'

export const Page = styled.div`
  width: 100%;
`

const Main = styled.main<{ $isPublic?: boolean }>`
  display: flex;
  flex: 1 1 auto;
  padding: 20px;
  height: ${({ $isPublic }) => ($isPublic ? '100vh' : '100%')};
  margin-left: ${({ theme, $isPublic }) => ($isPublic ? 0 : theme.size.sidebar)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 0;
  }
`

export interface LayoutRouteProps {
  component: ComponentType
  exact?: boolean
  isPublic?: boolean
  path: string
}

interface AuthenticatedRouteProps extends LayoutRouteProps {
  isSidebarOpen: boolean
  handleSidebarOpen: (state?: boolean) => void
}

function PublicRoute({
  component: Component,
  exact,
  path,
}: Partial<LayoutRouteProps>): JSX.Element {
  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <Main $isPublic>
          {/* @ts-expect-error TODO */}
          <Component {...props} />
        </Main>
      )}
    />
  )
}

function PrivateRoute({
  component: Component,
  exact,
  path,
  isSidebarOpen,
  handleSidebarOpen,
}: AuthenticatedRouteProps): JSX.Element {
  const { currentUser } = useAuthContext()

  return (
    <Route
      exact={exact}
      path={path}
      render={(props) =>
        currentUser ? (
          <React.Fragment>
            <Header onSidebarToggle={handleSidebarOpen} />
            <Sidebar isOpen={isSidebarOpen} onSidebarToggle={handleSidebarOpen} />
            <Main>
              {/* @ts-expect-error TODO */}
              <Component {...props} />
            </Main>
          </React.Fragment>
        ) : (
          <Redirect to={{ pathname: ROUTE_PATHS.LOGIN, state: { from: props.location } }} />
        )
      }
    />
  )
}

export default function LayoutRoute(props: LayoutRouteProps): JSX.Element {
  const { component: Component, exact = true, path, isPublic } = props
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  function handleSidebarOpen(state = !isSidebarOpen) {
    setIsSidebarOpen(state)
  }

  // Renders unauthenticated routes such as our login page
  if (isPublic) {
    return <PublicRoute component={Component} exact={exact} path={path} />
  }

  // Otherwise, we want to render authenticated pages or show the login page
  // depending on whether the user is signed in already
  return (
    <PrivateRoute
      component={Component}
      exact={exact}
      path={path}
      isSidebarOpen={isSidebarOpen}
      handleSidebarOpen={handleSidebarOpen}
    />
  )
}
