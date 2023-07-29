import React, { ComponentType, useState } from 'react'
import { Route, Redirect, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from 'auth/AuthContext'
import { Role, hasAllowedRole } from 'auth/roles'
import { ROUTE_PATHS } from 'routes'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export const Page = styled.div`
  width: 100%;
`

const Main = styled.main<{ $isPublic?: boolean }>`
  display: flex;
  flex: 1 1 auto;
  padding: 20px;
  height: ${({ $isPublic }) => ($isPublic ? '100vh' : '100%')};
  margin-left: ${({ theme, $isPublic }) => ($isPublic ? 0 : theme.size.sidebar)};
  ${({ theme }) => theme.breakpoints.down('md')} {
    margin-left: 0;
  }
`

export interface LayoutRouteProps {
  component: ComponentType
  exact?: boolean
  isPublic?: boolean
  path: string
  allowedRoles?: Role[]
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
  const { getToken } = useAuth()
  const isAuthenticated = !!getToken()

  return (
    <Route
      exact={exact}
      path={path}
      render={(props) =>
        path === ROUTE_PATHS.LOGIN && isAuthenticated ? (
          <Redirect to={{ pathname: ROUTE_PATHS.ROOT }} />
        ) : (
          <Main $isPublic>
            {/* @ts-expect-error TODO */}
            <Component {...props} />
          </Main>
        )
      }
    />
  )
}

function PrivateRoute({
  component: Component,
  exact,
  path,
  isSidebarOpen,
  handleSidebarOpen,
  allowedRoles,
}: AuthenticatedRouteProps): JSX.Element {
  const { getToken, getRole } = useAuth()
  const isAuthenticated = !!getToken()
  const role = getRole()

  const render = (props: RouteComponentProps): React.ReactNode => {
    if (!isAuthenticated) {
      return <Redirect to={{ pathname: ROUTE_PATHS.LOGIN, state: { from: props.location } }} />
    }

    if (!hasAllowedRole(role, allowedRoles)) {
      return <Redirect to={{ pathname: ROUTE_PATHS.FORBIDDEN }} />
    }

    return (
      <React.Fragment>
        <Navbar onSidebarToggle={handleSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} onSidebarToggle={handleSidebarOpen} />
        <Main>
          {/* @ts-expect-error TODO */}
          <Component {...props} />
        </Main>
      </React.Fragment>
    )
  }

  return <Route exact={exact} path={path} render={render} />
}

export default function LayoutRoute(props: LayoutRouteProps): JSX.Element {
  const { component: Component, exact = true, path, isPublic, allowedRoles = [] } = props
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      allowedRoles={allowedRoles}
    />
  )
}
