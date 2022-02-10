import { Box, Button, Card, CardContent, CardHeader, Divider, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import * as Yup from 'yup'
import { useAuth } from 'auth/AuthContext'
import { Page } from 'layout/LayoutRoute'

const initialValues = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export default function Settings(): JSX.Element {
  const { t } = useTranslation()
  const { updatePassword } = useAuth()

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required(
      t('settings.updatePassword.errors.currentPasswordRequired')
    ),
    newPassword: Yup.string()
      .required(t('settings.updatePassword.errors.newPasswordRequired'))
      .min(
        6,
        t('settings.updatePassword.errors.passwordMinimumLengthLimit', {
          length: 6,
        })
      ),
    confirmNewPassword: Yup.string()
      .required(t('settings.updatePassword.errors.confirmNewPasswordRequired'))
      .oneOf([Yup.ref('newPassword'), null], t('settings.updatePassword.errors.passwordMismatch')),
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      toast.promise(updatePassword(values.currentPassword, values.newPassword), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          return t('settings.updatePassword.success')
        },
        error: (err) => err,
      })
    },
  })

  return (
    <Page>
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <CardHeader title={t('settings.title')} subheader={t('settings.subTitle')} />
          <Divider />
          <CardContent>
            <TextField
              fullWidth
              label={t('settings.currentPassword')}
              margin="normal"
              id="currentPassword"
              name="currentPassword"
              type="password"
              variant="outlined"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.currentPassword)}
              helperText={formik.errors.currentPassword}
            />
            <TextField
              fullWidth
              label={t('settings.newPassword')}
              margin="normal"
              id="newPassword"
              name="newPassword"
              type="password"
              variant="outlined"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.newPassword)}
              helperText={formik.errors.newPassword}
            />
            <TextField
              fullWidth
              label={t('settings.confirmNewPassword')}
              margin="normal"
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              variant="outlined"
              value={formik.values.confirmNewPassword}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.confirmNewPassword)}
              helperText={formik.errors.confirmNewPassword}
            />
          </CardContent>
          <Divider />
          <Box display="flex" justifyContent="flex-end" p={2}>
            <Button color="primary" variant="contained" type="submit">
              {t('button.update')}
            </Button>
          </Box>
        </Card>
      </form>
    </Page>
  )
}
