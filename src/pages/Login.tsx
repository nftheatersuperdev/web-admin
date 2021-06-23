import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik } from 'formik'
import { Box, Button, Container, TextField, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from 'routes'

export default function Login(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()

  return (
    <Box
      display="flex"
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Container maxWidth="sm">
        <Formik
          initialValues={{
            email: 'demo@devias.io',
            password: 'Password123',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email('Must be a valid email')
              .max(255)
              .required('Email is required'),
            password: Yup.string().max(255).required('Password is required'),
          })}
          onSubmit={() => {
            history.replace(ROUTE_PATHS.ROOT)
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <Box mb={3}>
                <Typography color="textPrimary" variant="h2">
                  {t('login.title')}
                </Typography>
                <Typography color="textSecondary" gutterBottom variant="body2">
                  {t('login.subTitle')}
                </Typography>
              </Box>
              <TextField
                error={Boolean(touched.email && errors.email)}
                fullWidth
                helperText={touched.email && errors.email}
                label={t('login.email')}
                margin="normal"
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                type="email"
                value={values.email}
                variant="outlined"
              />
              <TextField
                error={Boolean(touched.password && errors.password)}
                fullWidth
                helperText={touched.password && errors.password}
                label={t('login.password')}
                margin="normal"
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
                type="password"
                value={values.password}
                variant="outlined"
              />
              <Box py={2}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  {t('button.signIn')}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Container>
    </Box>
  )
}
