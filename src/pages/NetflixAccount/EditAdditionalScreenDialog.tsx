import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, TextField } from '@mui/material'
import { GridTextField } from 'components/Styled'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
// import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { VisibilityOff, Visibility } from '@mui/icons-material'

interface EditAdditionalScreenProps {
    open: boolean
    additionalId: string
    email: string
    password: string
    onClose: () => void
}

export default function EditAdditionalScreenDialog(
    props: EditAdditionalScreenProps
  ): JSX.Element {
  const { t } = useTranslation()
  const {open, additionalId, email, password, onClose} = props
  const formik = useFormik({
    initialValues: {
        additionalId,
        email,
        password,
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
        console.log(JSON.stringify(values))
    },
  })
  const [isChanged, setIsChanged] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
      <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            {t('netflix.editScreen')}
          </Grid>
        </Grid>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
            <Grid container spacing={1}>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  disabled
                  name="email"
                  id="netflix_additional_edit_email"
                  label={t('netflix.mainInfo.email')}
                  fullWidth
                  variant="outlined"
                  value={email}
                />
              </GridTextField>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="netflix_additional_edit_password"
                  label={t('netflix.mainInfo.password')}
                  fullWidth
                  variant="outlined"
                  value={formik.values.password}
                  error={Boolean(formik.touched.password && formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  onChange={({ target }) => {setIsChanged(true); formik.setFieldValue('password', target.value)}}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
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
          <Button color="primary" disabled={!isChanged} variant="contained" type="submit">
            {t('button.update')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}