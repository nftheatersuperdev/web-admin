import toast from 'react-hot-toast'
import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import styled from 'styled-components'
import { formatDate } from 'utils'
import { useAuth } from 'auth/AuthContext'
import { ROLES } from 'auth/roles'
import { useTranslation } from 'react-i18next'
import { reActivateCustomer } from 'services/web-bff/user'
import { User } from 'services/web-bff/user.type'

interface UserDetailDialogProps {
  open: boolean
  user?: User | null
  onClose: (refetch?: boolean) => void
}

const SelectFormControl = styled(FormControl)`
  margin: 15px 0 0 0;
  width: 100%;
`
const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

export default function UserDetailDialog({
  open,
  user,
  onClose,
}: UserDetailDialogProps): JSX.Element {
  const { t } = useTranslation()
  const { getRole } = useAuth()
  const currentUserRole = getRole()
  const isDeletedUser = user?.isActive !== true
  const isUserOperator = currentUserRole === ROLES.ADMIN || currentUserRole === ROLES.SUPER_ADMIN
  const isEnableToUpdateStatus = isUserOperator && isDeletedUser

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (isEnableToUpdateStatus && user) {
      const isActive = Boolean(event.target.value) === true
      if (isActive) {
        toast.promise(reActivateCustomer(user.id), {
          loading: t('toast.loading'),
          success: () => {
            onClose(true)
            return t('user.detailDialog.reActivate.success')
          },
          error: (error) => {
            return error.message
          },
        })
      }
    }
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">User Detail</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ID"
              margin="normal"
              variant="outlined"
              value={user?.id}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.firstName')}
              margin="normal"
              variant="outlined"
              value={user?.firstName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.lastName')}
              margin="normal"
              variant="outlined"
              value={user?.lastName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.phone')}
              margin="normal"
              variant="outlined"
              value={user?.phoneNumber}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.email')}
              margin="normal"
              variant="outlined"
              value={user?.email}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.kyc.status')}
              margin="normal"
              variant="outlined"
              value={user?.kycStatus}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <SelectFormControl variant="outlined">
              <InputLabel id="isActive">{t('user.status')}</InputLabel>
              <Select
                fullWidth
                labelId="isActive"
                id="isActive"
                name="isActive"
                label={t('user.status')}
                value={String(user?.isActive)}
                readOnly={!isEnableToUpdateStatus}
                onChange={handleStatusChange}
              >
                <MenuItem key="active" value="true">
                  {t('user.statuses.active')}
                </MenuItem>
                <MenuItem key="deleted" value="false">
                  {t('user.statuses.deleted')}
                </MenuItem>
              </Select>
            </SelectFormControl>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('user.rejectedReason')}
              margin="normal"
              variant="outlined"
              value={user?.kycReason}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.createdDate')}
              margin="normal"
              variant="outlined"
              value={formatDate(user?.createdDate)}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.updatedDate')}
              margin="normal"
              variant="outlined"
              value={formatDate(user?.updatedDate)}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('userGroups.title')}
              margin="normal"
              variant="outlined"
              value={user?.customerGroups}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace variant="outlined" onClick={() => onClose()} color="default">
          {t('button.close')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
