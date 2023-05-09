import { useEffect, useState } from 'react'
import { Card, Grid, Typography, Button, Autocomplete } from '@mui/material'
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
import { DisabledField, EnabledTextField } from './styles'
import { StaffProfileDetailEditParam } from './constant'

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
    },
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      role: Yup.string().max(255).required(t('validation.roleRequired')),
    }),
    onSubmit: async (values) => {
      if (oldRole?.name === values.role) {
        toast.error(t('adminUser.updateDialog.cannotUpdate'))
      } else {
        await toast
          .promise(
            updateAdminUser({
              id: staffResponse?.data.adminUsers[0].id || '',
              firstname: null,
              lastname: null,
              email: null,
              role: values.role,
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
  }
  useEffect(() => {
    const defaultValue = {
      name: staffData?.role ? staffData.role.toString() : '-',
      displayNameTh: staffData?.role ? getAdminUserRoleLabel(staffData.role.toLowerCase(), t) : '-',
      displayNameEn: staffData?.role ? getAdminUserRoleLabel(staffData.role.toLowerCase(), t) : '-',
    }
    setOldRole(defaultValue)
    setSelectedRole(defaultValue)
  }, [t, staffData])

  function isAllowEdit() {
    return hasAllowedPrivilege(getPrivileges(), [PRIVILEGES.PERM_ADMIN_USER_EDIT])
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
                value={staffData?.id || ''}
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
                value={staffData?.firebaseId || ''}
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
                value={staffData?.firstName || '-'}
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
                value={staffData?.lastName || '-'}
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
                value={staffData?.email || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {isAllowEdit() ? (
                <Autocomplete
                  autoHighlight
                  id="status-select-list"
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
                  onChange={(_event, item) => onChangeRole(item)}
                />
              ) : (
                <DisabledField
                  type="text"
                  id="staff_profile__role"
                  label={t('user.role')}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={getAdminUserRoleLabel(staffData?.role.toLowerCase(), t) || '-'}
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
            <Grid item xs={12} sm={6} />
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
