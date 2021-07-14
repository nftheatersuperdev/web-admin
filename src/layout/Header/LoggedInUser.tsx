import { useState, Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'auth/AuthContext'
import { Menu, IconButton, MenuItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core'
import { PowerSettingsNew as LogOutIcon, AccountCircle } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from 'routes'
import dayjs from 'dayjs'

export default function LoggedInUser(): JSX.Element | null {
  const { t } = useTranslation()
  const history = useHistory()
  const { currentUser, signOut } = useAuth()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (!currentUser) {
    return null
  }

  const lastSignIn = currentUser?.metadata?.lastSignInTime
    ? dayjs(currentUser?.metadata?.lastSignInTime).format('DD/MM/YYYY HH:mm')
    : ''

  return (
    <Fragment>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        id="menu-appbar"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem button={false}>
          <ListItemText primary={currentUser?.email} secondary={lastSignIn} />
        </MenuItem>
        <Divider />

        <MenuItem
          onClick={async () => {
            await signOut()
            history.push(ROUTE_PATHS.LOGIN)
          }}
        >
          <ListItemIcon>
            <LogOutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={t('header.menu.logout')} />
        </MenuItem>
      </Menu>
    </Fragment>
  )
}
