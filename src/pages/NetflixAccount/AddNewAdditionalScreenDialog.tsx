import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { GridTextField } from 'components/Styled'

interface AddNewAdditionalScreenDialogProps {
  open: boolean
  accountId: string
  accountName: string
  onClose: () => void
}

export default function AddNewAdditionalScreenDialog(
  props: AddNewAdditionalScreenDialogProps
): JSX.Element {
  const { open, accountId, accountName, onClose } = props
  console.log(accountId)
  const { t } = useTranslation()
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('netflix.addScreen')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <GridTextField item xs={12} sm={12}>
            <TextField
              type="text"
              disabled
              name="accountName"
              id="netflix_add_account_name"
              label={t('netflix.mainInfo.accountName')}
              fullWidth
              variant="outlined"
              value={accountName}
            />
          </GridTextField>
          <GridTextField item xs={12} sm={12}>
            <TextField
              type="email"
              name="email"
              placeholder="กรุณาระบุอีเมลล์ของจอเสริม"
              id="netflix_add_email"
              label={t('netflix.mainInfo.email')}
              fullWidth
              variant="outlined"
              // value={formik.values.email}
              // error={Boolean(formik.touched.email && formik.errors.email)}
              // helperText={formik.touched.email && formik.errors.email}
              // onChange={({ target }) => formik.setFieldValue('email', target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={12}>
            <TextField
              type="text"
              name="password"
              placeholder="กรุณาระบุรหัสผ่านของจอเสริม"
              id="netflix_add_password"
              label={t('netflix.mainInfo.password')}
              fullWidth
              variant="outlined"
              // value={formik.values.password}
              // error={Boolean(formik.touched.password && formik.errors.password)}
              // helperText={formik.touched.password && formik.errors.password}
              // onChange={({ target }) => formik.setFieldValue('password', target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose()
          }}
          color="primary"
        >
          {t('button.cancel')}
        </Button>
        <Button color="primary" variant="contained" type="submit">
          {t('button.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
