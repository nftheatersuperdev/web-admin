import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  FormControl,
  MenuItem,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { ROLES } from 'auth/roles'
import styled from 'styled-components'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { createNewUser } from 'services/firebase-rest'
import { AdminUserRole } from 'services/web-bff/admin-user.type'

interface AdminUserCreateDialogProps {
  open: boolean
  onClose: () => void
}

const ButtonActions = styled.div`
  padding: 10px 15px;

  button {
    margin-left: 10px;
  }
`

export default function AdminUserCreateDialog({
  open,
  onClose,
}: AdminUserCreateDialogProps): JSX.Element {
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

  const getValueRole = (role?: string): AdminUserRole => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return AdminUserRole.SUPER_ADMIN
      case ROLES.ADMIN:
        return AdminUserRole.ADMIN
      case ROLES.CUSTOMER_SUPPORT:
        return AdminUserRole.CUSTOMER_SUPPORT
      case ROLES.MARKETING:
        return AdminUserRole.MARKETING
      default:
        return AdminUserRole.OPERATION
    }
  }

  const { values, errors, touched, handleSubmit, handleChange, isSubmitting } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: ROLES.OPERATION,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(t('authentication.error.invalidEmail'))
        .max(255)
        .required(t('authentication.error.emailRequired')),
      firstName: Yup.string().max(255).required(t('validation.required')),
      lastName: Yup.string().max(255).required(t('validation.required')),
    }),
    onSubmit: (values, actions) => {
      toast.promise(
        createNewUser({
          firstname: values.firstName,
          lastname: values.lastName,
          email: values.email,
          password: values.password,
          role: getValueRole(values.role),
        }),
        {
          loading: t('toast.loading'),
          success: () => {
            actions.setSubmitting(false)
            return 'Done!'
          },
          error: (err) => {
            actions.setSubmitting(false)
            onClose()
            return err.message
          },
        }
      )
    },
  })

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <form onSubmit={handleSubmit}>
        <DialogTitle id="form-dialog-title">Create new admin user</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="firstName"
                label={t('user.firstName')}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={handleChange}
                value={values.firstName}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="lastName"
                label={t('user.lastName')}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={handleChange}
                value={values.lastName}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="email"
                label={t('user.email')}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                onChange={handleChange}
                value={values.email}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                id="password"
                label={t('user.password')}
                InputLabelProps={{
                  shrink: true,
                }}
                type="password"
                fullWidth
                onChange={handleChange}
                value={values.password}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
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
                  onChange={handleChange}
                  value={values.role}
                >
                  {Object.values(ROLES).map((value) => (
                    <MenuItem key={value} value={value}>
                      {getDisplayRole(value)}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <ButtonActions>
            <Button type="submit" color="primary" variant="outlined" disabled={isSubmitting}>
              Create
            </Button>
            <Button onClick={onClose} color="secondary" variant="outlined" disabled={isSubmitting}>
              {t('button.close')}
            </Button>
          </ButtonActions>
        </DialogActions>
      </form>
    </Dialog>
  )
}
