/* eslint-disable react/forbid-component-props */
/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import {
  Typography,
  Breadcrumbs,
  Card,
  Link,
  Button,
  TextField,
  Grid,
  Autocomplete,
  Checkbox,
  Chip,
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { ROLES } from 'auth/roles'
import { useAuth } from 'auth/AuthContext'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { createNewUser } from 'services/firebase-rest'
import { getRoles } from 'services/web-bff/admin-user-role'
import { Role } from 'services/web-bff/admin-user-role.type'
import { Page } from 'layout/LayoutRoute'
import PageTitle from 'components/PageTitle'
import { EnabledTextField } from 'components/Styled'
import { getLocationList } from 'services/web-bff/location'
import { LocationResponse } from 'services/web-bff/location.type'
import { useStyles } from './styles'

interface SelectOption {
  label: string
  value: string
}

export default function StaffProfileAdd(): JSX.Element {
  const accessToken = useAuth().getToken() || ''
  const history = useHistory()
  const { i18n, t } = useTranslation()
  const classes = useStyles()
  const { data: rolesList } = useQuery('get-roles', () => getRoles())
  const { data: locations, isFetched: isFetchedLocations } = useQuery('get-location', () =>
    getLocationList()
  )
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const onChangeRole = (item: Role | null) => {
    setSelectedRole(item)
    values.role = item ? item.name : ''
  }
  const [selectLocation, setSelectLocation] = useState<{ value: string; label: string }[]>([])
  const [locationData, setLocationData] = useState<LocationResponse | null>()
  const [disableLocation, setDisableLocation] = useState<boolean>(true)
  const { values, setFieldValue, errors, touched, handleSubmit, handleChange, isSubmitting } =
    useFormik({
      initialValues: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        resellerServiceAreaIds: [],
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
            /(?=.{8,})(?=.*?[^\w\s])(?=.*?\d)(?=.*?[A-Z]).*?[a-z].*/,
            t('authentication.error.passwordCondition')
          ),
        firstName: Yup.string().max(255).required(t('validation.firstNameRequired')),
        lastName: Yup.string().max(255).required(t('validation.lastNameRequired')),
        role: Yup.string().max(255).required(t('validation.roleRequired')),
        resellerServiceAreaIds: Yup.array()
          .min(1, t('validation.locationRequired'))
          .required(t('validation.locationRequired')),
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
              role: values.role,
              resellerServiceAreaIds: values.resellerServiceAreaIds,
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
  useEffect(() => {
    if (isFetchedLocations && locations) {
      setLocationData(locations)
    }
  }, [isFetchedLocations, locations])

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = (
    <CheckBoxIcon className="MuiCheckbox-icon MuiCheckbox-iconChecked" fontSize="small" />
  )

  const setLocationSelect = (locationDataResponse: LocationResponse) => {
    const resultDataSelect = []
    const defultLocation = {
      value: '00000000-0000-0000-0000-000000000000',
      label: 'All Location',
    }
    resultDataSelect.push(defultLocation)

    locationDataResponse.locations.forEach((locationR) => {
      const locationSet = {
        value: locationR.id,
        label: locationR.areaNameEn,
      }
      resultDataSelect.push(locationSet)
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
    const defultLocationFormik = ['00000000-0000-0000-0000-000000000000']
    setSelectLocation(defultLocation)
    setFieldValue('resellerServiceAreaIds', defultLocationFormik)
  }
  const setFieldInFormik = (valuesSelect: SelectOption[]) => {
    const dataFormikLocation = valuesSelect.map((item) => {
      return item.value
    })
    setFieldValue('resellerServiceAreaIds', dataFormikLocation)
  }
  const handleAutocompleteChange = (valuesSelect: SelectOption[]) => {
    const checkSelectAllLocation = valuesSelect.find((data) => {
      return data.label === 'All Location'
    })
    if (valuesSelect.length > 1 && checkSelectAllLocation) {
      setSelectLocation([])
      setAllLocationSelected()
    } else {
      setSelectLocation(valuesSelect)
      setFieldInFormik(valuesSelect)
    }
  }
  const handleChangeRole = (roleSelect: string) => {
    if (
      roleSelect.toLowerCase() === ROLES.BRANCH_MANAGER ||
      roleSelect.toLowerCase() === ROLES.BRANCH_OFFICER
    ) {
      setSelectLocation([])
      setFieldValue('resellerServiceAreaIds', null)
      setDisableLocation(false)
    } else {
      setDisableLocation(true)
      setSelectLocation([])
      setAllLocationSelected()
    }
  }
  const checkSelectReturnColor = (optionValue: SelectOption, checkSelect: boolean) => {
    let classColor = classes.checkBoxLightGrey
    if (selectLocation.length > 0) {
      if (selectLocation[0].label === 'All Location') {
        if (checkSelect && optionValue.label === 'All Location') {
          classColor = ''
        }
      } else {
        classColor = ''
      }
    }

    return classColor
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
              <Autocomplete
                autoHighlight
                id="staff-profile-add__role_select"
                options={rolesList || []}
                getOptionLabel={(option) =>
                  i18n.language === 'en' ? option.displayNameEn : option.displayNameTh
                }
                isOptionEqualToValue={(option, value) =>
                  option.name === value.name || value.name === ''
                }
                renderInput={(params) => {
                  return (
                    <EnabledTextField
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...params}
                      label={t('user.role')}
                      variant="outlined"
                      error={Boolean(touched.role && errors.role)}
                      helperText={touched.role && errors.role}
                    />
                  )
                }}
                value={selectedRole}
                onChange={(_event, item) => {
                  onChangeRole(item)
                  handleChangeRole(item ? item.name : '')
                }}
              />
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
                disabled={disableLocation}
                fullWidth
                multiple
                limitTags={3}
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
                      className={checkSelectReturnColor(option, selected)}
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
                  <TextField
                    {...params}
                    label={t('staffProfile.location')}
                    error={Boolean(touched.resellerServiceAreaIds && errors.resellerServiceAreaIds)}
                    helperText={touched.resellerServiceAreaIds && errors.resellerServiceAreaIds}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      size="small"
                      label={option.label}
                      {...getTagProps({ index })}
                      key={index}
                      className={disableLocation ? classes.chipLightGrey : classes.chipBgPrimary}
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
