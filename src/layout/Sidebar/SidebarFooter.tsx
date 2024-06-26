import * as React from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'auth/AuthContext'
import { ROUTE_PATHS } from 'routes'
import { Avatar, Badge, Box, Grid, Menu, MenuItem, ListItemIcon, Typography } from '@mui/material'
import { deepOrange } from '@mui/material/colors'
import { AccountCircle, Settings, Logout } from '@mui/icons-material'
import { useQuery } from 'react-query'
import { getAdminUserProfile } from 'services/web-bff/admin-user'

const MenuLink = styled(Link)`
  text-decoration: none;
  color: #333;
`

const Footer = styled.div`
  background-color: ${(props) => props.theme.sidebar.footer.background} !important;
  padding: ${(props) => props.theme.spacing(2.75)} ${(props) => props.theme.spacing(4)};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`

const FooterText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
`

const FooterSubText = styled(Typography)`
  color: ${(props) => props.theme.sidebar.footer.color};
  font-size: 0.7rem;
  display: block;
  padding: 1px;
`

const FooterBadge = styled(Badge)`
  margin-right: ${(props) => props.theme.spacing(1)};
  span {
    background-color: ${(props) => props.theme.sidebar.footer.online.background};
    border: 1.5px solid ${(props) => props.theme.palette.common.white};
    height: 12px;
    width: 12px;
    border-radius: 50%;
  }
`

const GearIcon = styled(Settings)`
  color: #fff !important;
  cursor: pointer;
`

function SidebarFooter({ ...rest }): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()
  const { signOut } = useAuth()
  const { data: profile } = useQuery('user-profile', () => getAdminUserProfile(), {
    refetchOnWindowFocus: false,
  })

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleSignOut = async () => {
    await signOut()
    history.push(ROUTE_PATHS.LOGIN)
  }

  return (
    <Footer {...rest}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={2}>
          <Grid item lg={3}>
            <FooterBadge
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <Avatar sx={{ bgcolor: deepOrange[500] }} src="/logo-nftheater.png" />
            </FooterBadge>
          </Grid>
          <Grid item lg={6}>
            <FooterText variant="body2">
              {profile?.adminName ? `${profile.adminName}` : 'No Name'}
            </FooterText>
          </Grid>
          <Grid item lg={3}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="40px"
              onClick={handleClick}
            >
              <GearIcon fontSize="small" />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuLink to="/account">
          <MenuItem>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            {t('sidebar.profile')}
          </MenuItem>
        </MenuLink>
        <MenuLink to="/account/settings">
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            {t('sidebar.settings')}
          </MenuItem>
        </MenuLink>
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {t('header.menu.logout')}
        </MenuItem>
      </Menu>
    </Footer>
  )
}

export default SidebarFooter
