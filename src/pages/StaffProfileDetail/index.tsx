import { Typography, Breadcrumbs, Card, Link, Button, TextField, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getAdminUserByCriteria } from 'services/web-bff/admin-user'
// import { AdminUsers } from 'services/web-bff/admin-user.type'
import { Page } from 'layout/LayoutRoute'
import PageTitle from 'components/PageTitle'
import NoResultCard from 'components/NoResultCard'

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

interface StaffProfileDetailEditParam {
  id: string
}

export default function StaffProfileDetail(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const classes = useStyles()
  const params = useParams<StaffProfileDetailEditParam>()
  const { data: staffResponse } = useQuery(
    'admin-user-by-criteria',
    () =>
      getAdminUserByCriteria({
        data: params,
        page: 1,
        size: 1,
      }),
    {
      cacheTime: 0,
    }
  )
  const staffData =
    staffResponse?.data.adminUsers.length === 1 ? staffResponse?.data.adminUsers[0] : null
  const isNoData = staffData === undefined || staffData === null
  const handleOnCancel = () => {
    return history.goBack()
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.staffProfileDetail')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Link underline="hover" color="inherit" href="/staff-profiles">
          {t('sidebar.staffProfile')}
        </Link>
        <Typography color="primary">{t('sidebar.staffProfileDetail')}</Typography>
      </Breadcrumbs>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography> {t('sidebar.staffProfileDetail')}</Typography>
        </div>
        {isNoData ? (
          <NoResultCard />
        ) : (
          <Grid container spacing={2} className={classes.detailContainer}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                id="input-userId"
                name={t('user.id')}
                label={t('user.id')}
                variant="outlined"
                value={staffData?.id}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('staffProfile.firebaseId')}
                id="input-firebaseUid"
                name={t('staffProfile.firebaseId')}
                variant="outlined"
                value={staffData?.firebaseId}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                id="input-firstName"
                name={t('user.firstName')}
                label={t('user.firstName')}
                variant="outlined"
                value={staffData?.firstName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('user.lastName')}
                id="input-lastName"
                name={t('user.lastName')}
                variant="outlined"
                value={staffData?.lastName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('user.email')}
                id="input-email"
                name={t('user.email')}
                variant="outlined"
                value={staffData?.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('user.role')}
                id="input-role"
                name={t('user.role')}
                variant="outlined"
                value={staffData?.role}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('user.status')}
                id="input-status"
                name={t('user.status')}
                variant="outlined"
                value={staffData?.isActive ? t('user.statuses.enable') : t('user.statuses.disable')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className={classes.hide}
                fullWidth
                disabled
                label={t('user.lastName')}
                id="input-lastName"
                name={t('user.lastName')}
                variant="outlined"
                value={staffData?.lastName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('staffProfile.createdDate')}
                id="input-createdDate"
                name={t('staffProfile.createdDate')}
                variant="outlined"
                value={formaDateStringWithPattern(
                  staffData?.createdDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                disabled
                label={t('user.updatedDate')}
                id="input-updatedDate"
                name={t('user.updatedDate')}
                variant="outlined"
                value={formaDateStringWithPattern(
                  staffData?.updatedDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
          </Grid>
        )}
        <Card>
          <div className={classes.bottomContrainer}>
            <Button variant="contained" disabled>
              {t('button.save')}
            </Button>
            &nbsp;&nbsp;
            <Button variant="outlined" onClick={handleOnCancel}>
              {t('button.cancel')}
            </Button>
          </div>
        </Card>
      </Card>
      <br />
      <div className={classes.deleteProfileButton}>
        <Button variant="contained" disabled>
          {t('button.deleteProfile')}
        </Button>
      </div>
    </Page>
  )
}
