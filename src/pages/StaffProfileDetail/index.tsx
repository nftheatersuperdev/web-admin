import { Card, Grid, TextField, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { searchAdminUser } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { AdminUsersProps } from 'services/web-bff/admin-user.type'

interface StaffProfileDetailEditParam {
  id: string
}

export default function StaffProfileDetail(): JSX.Element {
  const useStyles = makeStyles({
    deleteProfileButton: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
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
  })
  const { t } = useTranslation()
  const classes = useStyles()
  const params = useParams<StaffProfileDetailEditParam>()
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
            <TextField
              type="text"
              fullWidth
              disabled
              className={classes.textField}
              id="staff_profile__userId"
              label={t('user.id')}
              variant="outlined"
              value={staffData?.id || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="staff_profile__firebaseUid"
              className={classes.textField}
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
            <TextField
              type="text"
              id="staff_profile__firstName"
              className={classes.textField}
              label={t('user.firstName')}
              fullWidth
              disabled
              variant="outlined"
              value={staffData?.firstName || '-'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="staff_profile__lastName"
              className={classes.textField}
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
            <TextField
              type="text"
              id="staff_profile__email"
              className={classes.textField}
              label={t('user.email')}
              fullWidth
              disabled
              variant="outlined"
              value={staffData?.email || '-'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="staff_profile__role"
              className={classes.textField}
              label={t('user.role')}
              fullWidth
              disabled
              variant="outlined"
              value={staffData?.role || '-'}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="staff_profile__status"
              className={classes.textField}
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
            <TextField
              fullWidth
              disabled
              className={classes.textField}
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
            <TextField
              fullWidth
              disabled
              className={classes.textField}
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
      </Card>
    </Page>
  )
}
