/* eslint-disable react/forbid-component-props */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react'
import {
  Typography,
  Breadcrumbs,
  Card,
  Link,
  Button,
  TextField,
  Grid,
  MenuItem,
  Autocomplete,
  Checkbox,
  Chip,
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
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
import { getLocationList } from 'services/web-bff/location'
import { LocationResponse } from 'services/web-bff/location.type'

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
  chipLightGrey: {
    backgroundColor: '#E0E0E0',
    color: 'black',
    borderRadius: '64px',
    padding: '4px',
    margin: '2px',
  },
})

interface SelectOption {
  label: string
  value: string
}

export default function StaffProfileAdd(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const history = useHistory()
  const { t } = useTranslation()
  const classes = useStyles()

  const [selectLocation, setSelectLocation] = useState<{ value: string; label: string }[]>([])

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
  const [locationData, setLocationData] = useState<LocationResponse | null>()
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

  const {
    data: loactions,
    isFetched: isFetchedLoactions,
    isFetching: isFetchingLoactions,
  } = useQuery('get-location', () => getLocationList())

  useEffect(() => {
    if (isFetchedLoactions && loactions) {
      setLocationData(loactions)
    }
  }, [isFetchedLoactions, loactions])

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = <CheckBoxIcon fontSize="small" />

  const setLocationSelect = (locationData: LocationResponse) => {
    const resultDataSelect = []
    const defultLocation = {
      value: '00000000-0000-0000-0000-000000000000',
      label: 'All Location',
    }
    resultDataSelect.push(defultLocation)

    locationData.locations.forEach((location) => {
      const locationData = {
        value: location.id,
        label: location.areaNameEn,
      }
      resultDataSelect.push(locationData)
    })
    resultDataSelect.sort((a, b) => {
      const nameA = a.label.toLowerCase()
      const nameB = b.label.toLowerCase()

      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })

    return resultDataSelect
  }
  const locationSelect = locationData ? setLocationSelect(locationData) : []
  const setAllLocationSelected = () => {
    const defultLocation = [
      {
        value: '00000000-0000-0000-0000-000000000000',
        label: 'All Location',
      },
    ]
    setSelectLocation(defultLocation)
  }
  const handleAutocompleteChange = (values: SelectOption[]) => {
    const checkSelectAllLocation = values.find((data) => {
      return data.label === 'All Location'
    })
    if (values.length > 1 && checkSelectAllLocation) {
      setSelectLocation([])
      setAllLocationSelected()
    } else {
      setSelectLocation(values)
    }
  }

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
            <Grid item xs={6}>
              <Autocomplete
                disabled={isFetchingLoactions}
                fullWidth
                multiple
                limitTags={4}
                id="staff-profile-add__location_input"
                options={locationSelect}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                getOptionDisabled={(option) => {
                  return (
                    selectLocation.length > 0 &&
                    option.label !== 'All Location' &&
                    selectLocation[0].label === 'All Location'
                  )
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      checked={
                        selectLocation.length > 0 && selectLocation[0].label === 'All Location'
                          ? true
                          : selected
                      }
                    />
                    {option.label}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label={t('staffProfile.location')} />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option.label}
                      {...getTagProps({ index })}
                      key={index}
                      className={classes.chipLightGrey}
                    />
                  ))
                }
                value={selectLocation || []}
                onChange={(_event, value) => {
                  handleAutocompleteChange(value)
                }}
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
