import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
import { Drawer as MuiDrawer, ListItemButton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { SidebarItemsType } from './types'
import SidebarNav from './SidebarNav'
import Footer from './SidebarFooter'

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`

const Brand = styled(ListItemButton)<{
  component?: React.ReactNode | unknown
  to?: string
}>`
  padding: 20px 0 0 15px !important;
  background: #444243 !important;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none !important;
  }

  img {
    height: 75px !important;
  }
`

export interface SidebarProps {
  PaperProps: {
    style: {
      width: number
    }
  }
  variant?: 'permanent' | 'persistent' | 'temporary'
  open?: boolean
  onClose?: () => void
  items: {
    title: string
    pages: SidebarItemsType[]
  }[]
  showFooter?: boolean
}

function Sidebar({ items, ...rest }: SidebarProps): JSX.Element {
  const { t } = useTranslation()

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Drawer variant="permanent" {...rest}>
      <Brand component={NavLink as unknown} to="/">
        <img src={process.env.PUBLIC_URL + '/logo-nftheater.png'} alt={t('header.aria.logo')} />
      </Brand>
      <SidebarNav items={items} />
      <Footer />
    </Drawer>
  )
}

export default Sidebar
