import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  FormLabel,
  MenuItem,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ROLES } from 'auth/roles'
import { User } from 'services/evme.types'

interface AdminUserDetailDialogProps {
  open: boolean
  onClose: () => void
  user: Partial<User>
}

export default function AdminUserDetailDialog({
  open,
  onClose,
  user,
}: AdminUserDetailDialogProps): JSX.Element {
  const { t } = useTranslation()

  const getDisplayRole = (role?: string): string => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return t('role.superAdmin')
      case ROLES.ADMIN:
        return t('role.admin')
      case ROLES.CUSTOMER_SUPPORT:
        return t('role.customerSupport')
      case ROLES.OPERATION:
        return t('role.operation')
      case ROLES.MARKETING:
        return t('role.marketing')
      default:
        return '-'
    }
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('user.detailDialog.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              id="firstName"
              label={t('user.firstName')}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={user.firstName || '-'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="lastName"
              label={t('user.lastName')}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={user.lastName || '-'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              id="email"
              label={t('user.email')}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                readOnly: true,
              }}
              fullWidth
              value={user.email || '-'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <TextField
                fullWidth
                select
                label={t('user.role')}
                id="role"
                name="role"
                value={user.role?.toLocaleLowerCase()}
                InputProps={{
                  readOnly: true,
                }}
              >
                {Object.values(ROLES).map((value) => (
                  <MenuItem key={value} value={value}>
                    {getDisplayRole(value)}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl component="fieldset">
              <FormLabel component="legend">{t('user.status')}</FormLabel>
              <FormControlLabel
                control={
                  <Switch checked={!user.disabled} id="disabled" name="disabled" color="primary" />
                }
                label={user.disabled ? t('user.disabled') : t('user.enabled')}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
