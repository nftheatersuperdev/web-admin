import styled from 'styled-components'
import { Box } from '@mui/material'
import { useMenuItems } from 'layout/menuItems'
import SidebarMUI from './Sidebar'

const drawerWidth = 258

const Drawer = styled.div`
  ${(props) => props.theme.breakpoints.up('md')} {
    width: ${drawerWidth}px;
    flex-shrink: 0;
  }
`

interface SidebarProps {
  isOpen: boolean
  onSidebarToggle: (state?: boolean) => void
}

function Sidebar({ isOpen, onSidebarToggle }: SidebarProps): JSX.Element {
  const menuItems = useMenuItems()

  return (
    <Drawer>
      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <SidebarMUI
          PaperProps={{ style: { width: drawerWidth } }}
          variant="temporary"
          open={isOpen}
          onClose={() => onSidebarToggle(false)}
          items={menuItems}
        />
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SidebarMUI PaperProps={{ style: { width: drawerWidth } }} items={menuItems} />
      </Box>
    </Drawer>
  )
}

export default Sidebar
