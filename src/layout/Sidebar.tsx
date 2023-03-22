import { useState } from 'react'
import styled from 'styled-components'
import { Box } from '@mui/material'
import navItems from 'components/sidebar/navItems'
import SidebarMUI from 'components/sidebar/Sidebar'

const drawerWidth = 258

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`

interface SidebarProps {
  isOpen: boolean
  onSidebarToggle: (isOpen?: boolean) => void
}

function Sidebar({ isOpen, onSidebarToggle }: SidebarProps): JSX.Element {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false)

  console.log('isOpen ->', isOpen)
  console.log('onSidebarToggle ->', onSidebarToggle)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Drawer>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <SidebarMUI
          PaperProps={{ style: { width: drawerWidth } }}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          items={navItems}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SidebarMUI PaperProps={{ style: { width: drawerWidth } }} items={navItems} />
      </Box>
    </Drawer>
  )
}

export default Sidebar
