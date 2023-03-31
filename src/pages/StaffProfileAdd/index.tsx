import {
  Typography,
  Breadcrumbs,
  Card,
  Link,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useAuth } from 'auth/AuthContext'
import { getAdminUserRoleLabel, ROLES } from 'auth/roles'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { createNewUser } from 'services/firebase-rest'
import { AdminUserRole } from 'services/web-bff/admin-user.type'
import { Page } from 'layout/LayoutRoute'
import PageTitle from 'components/PageTitle'

const useStyles = makeStyles({
  hide: {
    display: 'none',
  },
  headerTopic: {
    padding: '8px 16px',
  },
  detailContainer: {
    padding: '10px 25px',
  },
  bottomContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 25px',
  },
  deleteProfileButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

export default function StaffProfileAdd(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const history = useHistory()
  const { t } = useTranslation()
  const classes = useStyles()
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
      case ROLES.PRODUCT_SUPPORT:
        return AdminUserRole.PRODUCT_SUPPORT
      case ROLES.IT_ADMIN:
        return AdminUserRole.IT_ADMIN
      default:
        return AdminUserRole.OPERATION
    }
  }
  const { values, errors, touched, handleSubmit, handleChange, isSubmitting } = useFormik({
    // const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(t('authentication.error.invalidEmail'))
        .max(255)
        .required(t('authentication.error.emailRequired')),
      password: Yup.string()
        .min(8)
        .required(t('authentication.error.passwordRequired'))
        .matches(
          /(?=.{8,})(?=.*?[^\w\s])(?=.*?[0-9])(?=.*?[A-Z]).*?[a-z].*/,
          t('authentication.error.passwordCondition')
        ),
      firstName: Yup.string().max(255).required(t('validation.firstNameRequired')),
      lastName: Yup.string().max(255).required(t('validation.lastNameRequired')),
      role: Yup.string().max(255).required(t('validation.roleRequired')),
    }),
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true)
      toast
        .promise(
          createNewUser({
            accessToken,
            firstname: values.firstName,
            lastname: values.lastName,
            email: values.email,
            password: values.password,
            role: getValueRole(values.role),
          }),
          {
            loading: t('toast.loading'),
            success: t('adminUser.createDialog.success'),
            error: (error) =>
              t('adminUser.createDialog.failed', {
                error: error.message || error,
              }),
          }
        )
        .finally(() => {
          actions.resetForm()
          actions.setSubmitting(false)
          history.goBack()
        })
    },
  })

  return (
    <Page>
      <PageTitle title={t('sidebar.staffProfileAdd')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Link underline="hover" color="inherit" href="/staff-profiles">
          {t('sidebar.staffProfile')}
        </Link>
        <Typography color="primary">{t('sidebar.staffProfileAdd')}</Typography>
      </Breadcrumbs>
      <br />
      <form onSubmit={handleSubmit}>
        <Card>
          <div className={classes.headerTopic}>
            <Typography> {t('sidebar.staffProfileAdd')}</Typography>
          </div>
          <Grid container spacing={2} className={classes.detailContainer}>
            <Grid item xs={6}>
              <TextField
                error={Boolean(touched.firstName && errors.firstName)}
                fullWidth
                helperText={touched.firstName && errors.firstName}
                label={t('user.firstName')}
                name="firstName"
                onChange={handleChange}
                variant="outlined"
                value={values.firstName}
                id="staff-profile-add__firstname_input"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={t('user.lastName')}
                id="staff-profile-add__lastName_input"
                name="lastName"
                variant="outlined"
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
            <Grid item xs={6}>
              <TextField
                label={t('user.email')}
                id="staff-profile-add__email_input"
                name="email"
                type="email"
                variant="outlined"
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label={t('user.role')}
                id="staff-profile-add__role_select"
                name="role"
                variant="outlined"
                onChange={handleChange}
                value={values.role}
                error={Boolean(touched.role && errors.role)}
                helperText={touched.role && errors.role}
              >
                {Object.values(ROLES).map((role) => (
                  <MenuItem key={role} value={role}>
                    {getAdminUserRoleLabel(role, t)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="password"
                label={t('user.password')}
                id="staff-profile-add__password_input"
                name="password"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange}
                value={values.password}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Grid>
          </Grid>
          <Card>
            <div className={classes.bottomContrainer}>
              <Button type="submit" color="primary" variant="outlined" disabled={isSubmitting}>
                {t('button.save')}
              </Button>
              &nbsp;&nbsp;
              <Button variant="outlined" onClick={() => history.goBack()}>
                {t('button.cancel')}
              </Button>
            </div>
          </Card>
        </Card>
      </form>
    </Page>
  )
}
