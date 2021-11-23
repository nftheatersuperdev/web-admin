/* eslint-disable react/no-danger */
import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils'
import { VoucherEvents as VoucherEventsType } from 'services/evme.types'

interface DetailDialogProps {
  open: boolean
  onClose: () => void
  data: VoucherEventsType
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

const HTMLRender = styled.div`
  padding: 10px;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
`

export default function DetailDialog({ open, onClose, data }: DetailDialogProps): JSX.Element {
  const { t } = useTranslation()
  const handleOnClose = () => onClose()

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Event detail</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Event ID"
              margin="normal"
              variant="outlined"
              value={data.id}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Event log"
              margin="normal"
              variant="outlined"
              value={data.event.charAt(0).toUpperCase() + data.event.slice(1)}
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
              label="Voucher ID"
              margin="normal"
              variant="outlined"
              value={data.voucher.id}
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
              label="User ID"
              margin="normal"
              variant="outlined"
              value={data.user.id}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User Names"
              margin="normal"
              variant="outlined"
              value={`${data.user.firstName} ${data.user.lastName}`}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="User Email"
              margin="normal"
              variant="outlined"
              value={data.user.email}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Code"
              margin="normal"
              variant="outlined"
              value={data.code}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ALL Package"
              margin="normal"
              variant="outlined"
              value={data.isAllPackages ? 'Yes' : 'No'}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              margin="normal"
              variant="outlined"
              value={formatDate(data.startAt)}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Date"
              margin="normal"
              variant="outlined"
              value={formatDate(data.endAt)}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Percent Discount"
              margin="normal"
              variant="outlined"
              value={data.percentDiscount}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Limit"
              margin="normal"
              variant="outlined"
              value={data.amount}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Limit Per User"
              margin="normal"
              variant="outlined"
              value={data.limitPerUser}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography color="textPrimary" variant="caption">
              Description (English)
            </Typography>
            <HTMLRender>
              <div dangerouslySetInnerHTML={{ __html: data.descriptionEn }} />
            </HTMLRender>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography color="textPrimary" variant="caption">
              Description (Thai)
            </Typography>
            <HTMLRender>
              <div dangerouslySetInnerHTML={{ __html: data.descriptionTh }} />
            </HTMLRender>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace variant="outlined" onClick={() => handleOnClose()} color="default">
          {t('button.close')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
