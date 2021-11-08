import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import styled from 'styled-components'
import { formatDate } from 'utils'
import { useTranslation } from 'react-i18next'
import { User } from 'services/evme.types'

interface UserDetailDialogProps {
  open: boolean
  user?: User | null
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

export default function UserDetailDialog({
  open,
  user,
  onClose,
}: UserDetailDialogProps): JSX.Element {
  const { t } = useTranslation()

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
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('user.createdDate')}
              margin="normal"
              variant="outlined"
              value={formatDate(user?.createdAt)}
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
              value={formatDate(user?.updatedAt)}
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
              value={user?.userGroups}
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
