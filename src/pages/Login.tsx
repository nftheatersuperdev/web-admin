import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from 'routes'
import { useAuthContext } from 'auth/AuthContext'
import styled from 'styled-components'

const LoginHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export default function Login(): JSX.Element {
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const auth = useAuthContext()
  const [isRememberMe, setIsRememberMe] = useState(true)

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email(t('authentication.error.invalidEmail'))
        .max(255)
        .required(t('authentication.error.emailRequired')),
      password: Yup.string().max(255).required(t('authentication.error.passwordRequired')),
    }),
    onSubmit: (values, actions) => {
      toast.promise(auth.signInWithEmailAndPassword(values.email, values.password, isRememberMe), {
        loading: t('toast.loading'),
        success: () => {
          actions.setSubmitting(false)
          history.replace(ROUTE_PATHS.ROOT)
          return t('authentication.success')
        },
        error: (err) => {
          actions.setSubmitting(false)
          return err.message
        },
      })
    },
  })

  const handleLanguageChange = async () => {
    const newLang = ['en-US', 'en'].includes(i18n.language) ? 'th' : 'en'
    await i18n.changeLanguage(newLang, () => {
      resetForm()
    })
  }

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
        <form onSubmit={handleSubmit}>
          <LoginHeader>
            <Box mb={3}>
              <Typography color="textPrimary" variant="h2">
                {t('login.title')}
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2">
                {t('login.subTitle')}
              </Typography>
            </Box>

            <IconButton
              color="inherit"
              onClick={handleLanguageChange}
              aria-label={t('header.aria.changeLanguage')}
            >
              {i18n.language === 'th' ? '🇹🇭' : '🇺🇸'}
            </IconButton>
          </LoginHeader>

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

          <FormControlLabel
            control={
              <Checkbox
                checked={isRememberMe}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setIsRememberMe(event.target.checked)
                }}
                name="isRememberMe"
                color="primary"
              />
            }
            label={t('login.rememberMe')}
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
      </Container>
    </Box>
  )
}
