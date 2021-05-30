/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentType, useState } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from 'layout/Header'
import Sidebar from './Sidebar'

export interface LayoutRouteProps {
  component: ComponentType
  exact?: boolean
  isPublic?: boolean
  path: string
}

const Main = styled.main<{ $isPublic?: boolean }>`
  padding: 20px;
  height: ${({ $isPublic }) => ($isPublic ? '100vh' : 0)};
  margin-left: ${({ theme, $isPublic }) => ($isPublic ? 0 : theme.size.sidebar)};
`

export default function LayoutRoute(props: LayoutRouteProps): JSX.Element {
  const { component: Component, exact = true, path, isPublic } = props
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  function handleSidebarOpen(state = !isSidebarOpen) {
    setIsSidebarOpen(state)
  }

  return (
    <Route
      exact={exact}
      path={path}
      render={(props) => (
        <React.Fragment>
          {isPublic ? null : <Header onSidebarToggle={handleSidebarOpen} />}
          {isPublic ? null : <Sidebar isOpen={isSidebarOpen} onSidebarToggle={handleSidebarOpen} />}
          <Main $isPublic={isPublic}>
            {/* @ts-expect-error TODO */}
            <Component {...props} />
          </Main>
        </React.Fragment>
      )}
    />
  )
}
