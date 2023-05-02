// import { useState } from 'react'
import { Card, Grid, Typography, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { useTranslation } from 'react-i18next'
import { useParams, useHistory } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAdminUserRoleLabel } from 'auth/roles'
import { searchAdminUser } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { AdminUsersProps } from 'services/web-bff/admin-user.type'
import { DisabledField } from './styles'

interface StaffProfileDetailEditParam {
  id: string
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
  })
  const { t } = useTranslation()
  const classes = useStyles()
  const history = useHistory()
  const params = useParams<StaffProfileDetailEditParam>()
  // const roleList = getRoleList(t)
  // const [isEnableSaveButton, setIsEnableSaveButton] = useState<boolean>(false)
  const { data: staffResponse } = useQuery('admin-users', () =>
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
  return (
    <Page>
      <PageTitle title={pageTitle} breadcrumbs={breadcrumbs} />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">{t('sidebar.staffProfileDetail')}</Typography>
        </Grid>
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
            <DisabledField
              type="text"
              id="staff_profile__role"
              label={t('user.role')}
              fullWidth
              disabled
              variant="outlined"
              value={getAdminUserRoleLabel(staffData?.role.toLowerCase(), t) || '-'}
            />
            {/* <TextField
              id="staff_profile__update_role_select"
              select
              value={staffData?.role}
              label={t('user.role')}
              placeholder={t('carAvailability.searchField.label')}
              variant="outlined"
              fullWidth
            >
              {roleList?.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField> */}
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
                staffData?.createdDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <Button
              id="staff_profile__update_btn"
              className={classes.w83}
              color="primary"
              disabled={true}
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
      </Card>
      <div className={classes.bottomContrainer}>
        <Button className={classes.deleteButton} variant="outlined">
          {t('button.deleteProfile').toUpperCase()}
        </Button>
      </div>
    </Page>
  )
}
