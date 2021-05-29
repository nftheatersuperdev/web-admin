/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentType, useState } from 'react'
import { Route } from 'react-router-dom'
import styled from 'styled-components'
import Header from 'layout/Header'
import Sidebar from './Sidebar'

export interface LayoutRouteProps {
  component: ComponentType
  exact?: boolean
  path: string
}

const Main = styled.main`
  padding: 20px;
  margin-left: ${({ theme }) => theme.size.sidebar};
`

export default function LayoutRoute(props: LayoutRouteProps): JSX.Element {
  const { component: Component, exact = true, path } = props
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
          <Header onSidebarToggle={handleSidebarOpen} />
          <Sidebar isOpen={isSidebarOpen} onSidebarToggle={handleSidebarOpen} />
          <Main>
            {/* @ts-expect-error TODO */}
            <Component {...props} />
          </Main>
        </React.Fragment>
      )}
    />
  )
}
