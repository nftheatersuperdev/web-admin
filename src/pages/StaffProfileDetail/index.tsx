import { useEffect, useState } from 'react'
import { Card, Grid, Typography, Button, Autocomplete, Chip, Checkbox } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { useFormik } from 'formik'
import { makeStyles } from '@mui/styles'
import toast from 'react-hot-toast'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { useAuth } from 'auth/AuthContext'
import { useQuery } from 'react-query'
import { getAdminUserRoleLabel } from 'auth/roles'
import { hasAllowedPrivilege, PRIVILEGES } from 'auth/privileges'
import { getRoles } from 'services/web-bff/admin-user-role'
import { searchAdminUser, updateAdminUser } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { AdminUsersProps } from 'services/web-bff/admin-user.type'
import { Role } from 'services/web-bff/admin-user-role.type'
import { getLocationList } from 'services/web-bff/location'
import { LocationResponse } from 'services/web-bff/location.type'
import { DisabledField, EnabledTextField } from './styles'
import { StaffProfileDetailEditParam } from './constant'

interface SelectOption {
  label: string
  value: string
}

export default function StaffProfileDetail(): JSX.Element {
  const useStyles = makeStyles({
    textField: {
      '& .MuiInputBase-input': {
        height: '1.4rem',
      },
      '& input.Mui-disabled': {
        WebkitTextFillColor: '#000000',
        color: '#000000',
        background: '#F5F5F5',
      },
      '& div.Mui-disabled': {
        background: '#F5F5F5 !important',
      },
      '& .MuiInputLabel-root': {
        color: '#e936a7',
      },
    },
    card: {
      padding: '20px',
    },
    gridTitle: {
      marginBottom: '30px',
    },
    container: {
      marginTop: '5px!important',
      marginBottom: '5px',
    },
    alignRight: {
      textAlign: 'right',
    },
    bottomContrainer: {
      textAlign: 'right',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '10px',
    },
    deleteButton: {
      color: 'red',
      borderColor: 'red',
    },
    w83: {
      width: '83px',
    },
    hideObject: {
      display: 'none',
    },
    chipLightGrey: {
      backgroundColor: '#E0E0E0',
      color: 'black !important',
      borderRadius: '64px',
      padding: '4px',
      margin: '2px',
    },
    chipBgPrimary: {
      backgroundColor: '#4584FF',
      color: 'white',
      borderRadius: '64px',
      padding: '4px',
      margin: '2px',
    },
    checkBoxLightGrey: {
      '&.Mui-checked': {
        color: '#999',
      },
    },
    locationSelect: {
      '& fieldSet': {
        borderColor: '#424E63',
      },
    },
  })
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const history = useHistory()
  const params = useParams<StaffProfileDetailEditParam>()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const { getPrivileges } = useAuth()
  const [oldRole, setOldRole] = useState<Role | null>(null)
  const [isEnableSaveButton, setIsEnableSaveButton] = useState<boolean>(false)
  const { data: rolesList } = useQuery('get-roles', () => getRoles())
  const { data: staffResponse, refetch } = useQuery('admin-users', () =>
    searchAdminUser({ data: params, page: 1, size: 1 } as AdminUsersProps)
  )

  const [selectLocation, setSelectLocation] = useState<{ value: string; label: string }[]>([])
  const [oldSelectLocation, setOldSelectLocation] = useState<{ value: string; label: string }[]>([])
  const [locationData, setLocationData] = useState<LocationResponse | null>()
  const [disableLocation, setDisableLocation] = useState<boolean>(true)

  const staffData =
    staffResponse?.data.adminUsers.length === 1 ? staffResponse?.data.adminUsers[0] : null
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.userManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.staffProfile'),
      link: '/staff-profiles',
    },
    {
      text: t('sidebar.staffProfileDetail'),
      link: `/edit`,
    },
  ]
  const pageTitle: string = t('sidebar.staffProfileDetail')

  const { setFieldValue, errors, touched, handleSubmit } = useFormik({
    initialValues: {
      role: '',
      resellerServiceAreaIds: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      role: Yup.string().max(255).required(t('validation.roleRequired')),
      resellerServiceAreaIds: Yup.array()
        .min(1, t('validation.locationRequired'))
        .required(t('validation.locationRequired')),
    }),
    onSubmit: async (values) => {
      if (oldRole?.name === values.role && oldSelectLocation === values.resellerServiceAreaIds) {
        toast.error(t('adminUser.updateDialog.cannotUpdate'))
      } else {
        await toast
          .promise(
            updateAdminUser({
              id: staffResponse?.data.adminUsers[0].id ?? '',
              firstname: null,
              lastname: null,
              email: null,
              role: values.role,
              resellerServiceAreaIds: values.resellerServiceAreaIds,
            }),
            {
              loading: t('toast.loading'),
              success: t('adminUser.updateDialog.success'),
              error: t('adminUser.updateDialog.error'),
            }
          )
          .finally(() => {
            refetch()
            setIsEnableSaveButton(false)
          })
      }
    },
  })

  const onChangeRole = (item: Role | null) => {
    setSelectedRole(item)
    setIsEnableSaveButton(true)
    setFieldValue('role', item ? item.name : '')
    setFieldInFormik(selectLocation)
  }
  useEffect(() => {
    const defaultValue = {
      name: staffData?.role ? staffData.role.toString() : '-',
      displayNameTh: staffData?.role ? getAdminUserRoleLabel(staffData.role.toLowerCase(), t) : '-',
      displayNameEn: staffData?.role ? getAdminUserRoleLabel(staffData.role.toLowerCase(), t) : '-',
    }
    setOldRole(defaultValue)
    setSelectedRole(defaultValue)
    if (staffData?.role === 'BRANCH_MANAGER' ?? staffData?.role === 'BRANCH_OFFICER') {
      setDisableLocation(false)
    }
  }, [t, staffData])

  function isAllowEdit() {
    return hasAllowedPrivilege(getPrivileges(), [PRIVILEGES.PERM_ADMIN_USER_EDIT])
  }

  const { data: loactions, isFetched: isFetchedLoactions } = useQuery('get-location', () =>
    getLocationList()
  )

  useEffect(() => {
    if (isFetchedLoactions && loactions) {
      setLocationData(loactions)
      const locationSelectIsLoad =
        staffData?.resellerServiceAreas.map((item) => {
          return { value: item.id, label: item.areaNameEn }
        }) ?? []
      setSelectLocation(locationSelectIsLoad)
      setOldSelectLocation(locationSelectIsLoad)
    }
  }, [isFetchedLoactions, loactions, staffData])

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
  const checkedIcon = <CheckBoxIcon fontSize="small" />

  const setLocationSelect = (locationDataResponse: LocationResponse) => {
    const resultDataSelect = []
    const defultLocation = {
      value: '00000000-0000-0000-0000-000000000000',
      label: 'All Location',
    }
    resultDataSelect.push(defultLocation)

    locationDataResponse.locations.forEach((location) => {
      const locationSet = {
        value: location.id,
        label: location.areaNameEn,
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
      setFieldInFormik(valuesSelect)
      setSelectLocation(valuesSelect)
    }
    setIsEnableSaveButton(true)
    setFieldValue('role', selectedRole?.name)
  }

  const handleChangeRole = (roleSelect: string) => {
    if (roleSelect === 'BRANCH_MANAGER' ?? roleSelect === 'BRANCH_OFFICER') {
      setSelectLocation([])
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
      <PageTitle title={pageTitle} breadcrumbs={breadcrumbs} />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">{t('sidebar.staffProfileDetail')}</Typography>
        </Grid>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
                type="text"
                fullWidth
                disabled
                id="staff_profile__userId"
                label={t('user.id')}
                variant="outlined"
                value={staffData?.id ?? ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="staff_profile__firebaseUid"
                label={t('staffProfile.firebaseId')}
                fullWidth
                disabled
                variant="outlined"
                value={staffData?.firebaseId ?? ''}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="staff_profile__firstName"
                label={t('user.firstName')}
                fullWidth
                disabled
                variant="outlined"
                value={staffData?.firstName ?? '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="staff_profile__lastName"
                label={t('user.lastName')}
                fullWidth
                disabled
                variant="outlined"
                value={staffData?.lastName ?? '-'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="staff_profile__email"
                label={t('user.email')}
                fullWidth
                disabled
                variant="outlined"
                value={staffData?.email ?? '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {isAllowEdit() ? (
                <Autocomplete
                  autoHighlight
                  id="status-select-list"
                  options={rolesList ?? []}
                  getOptionLabel={(option) =>
                    i18n.language === 'en' ? option.displayNameEn : option.displayNameTh
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.name === value.name ?? value.name === ''
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
                    handleChangeRole(item?.name ?? '')
                  }}
                />
              ) : (
                <DisabledField
                  type="text"
                  id="staff_profile__role"
                  label={t('user.role')}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={getAdminUserRoleLabel(staffData?.role.toLowerCase(), t) ?? '-'}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="staff_profile__status"
                label={t('user.status')}
                fullWidth
                disabled
                variant="outlined"
                value={staffData?.isActive ? t('user.statuses.enable') : t('user.statuses.disable')}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disabled={disableLocation}
                fullWidth
                multiple
                limitTags={3}
                id="staff-profile__location"
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
                renderInput={(params) =>
                  disableLocation ? (
                    <DisabledField {...params} label={t('staffProfile.location')} />
                  ) : (
                    <EnabledTextField
                      {...params}
                      className={classes.locationSelect}
                      label={t('staffProfile.location')}
                      error={Boolean(
                        touched.resellerServiceAreaIds && errors.resellerServiceAreaIds
                      )}
                      helperText={touched.resellerServiceAreaIds && errors.resellerServiceAreaIds}
                    />
                  )
                }
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
                value={selectLocation ?? []}
                onChange={(_event, value) => {
                  handleAutocompleteChange(value)
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
                fullWidth
                disabled
                label={t('staffProfile.createdDate')}
                id="staff_profile__createdDate"
                name={t('staffProfile.createdDate')}
                variant="outlined"
                value={formaDateStringWithPattern(
                  staffData?.createdDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DisabledField
                fullWidth
                disabled
                label={t('user.updatedDate')}
                id="staff_profile__updateddDate"
                variant="outlined"
                value={formaDateStringWithPattern(
                  staffData?.updatedDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <Button
                id="staff_profile__update_btn"
                type="submit"
                className={classes.w83}
                color="primary"
                disabled={!isEnableSaveButton}
                variant="contained"
              >
                {t('button.save').toUpperCase()}
              </Button>
              &nbsp;&nbsp;
              <Button
                variant="outlined"
                color="primary"
                onClick={() => history.goBack()}
                className={classes.w83}
              >
                {t('button.cancel').toUpperCase()}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
      <div className={classes.bottomContrainer}>
        <Button className={classes.hideObject} variant="outlined">
          {t('button.deleteProfile').toUpperCase()}
        </Button>
      </div>
    </Page>
  )
}
