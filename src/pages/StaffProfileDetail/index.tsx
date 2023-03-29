// import { useState } from 'react'
// import { useEffect } from 'react'
import {
  Typography,
  Breadcrumbs,
  makeStyles,
  Card,
  Link,
  Button,
  TextField,
  Grid,
} from '@material-ui/core'
import { formatDate } from 'utils'
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
                id="input-userId"
                name={t('user.id')}
                label={t('user.id')}
                variant="outlined"
                value={staffData?.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('staffProfile.firebaseId')}
                id="input-firebaseUid"
                name={t('staffProfile.firebaseId')}
                variant="outlined"
                value={staffData?.firebaseId}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                id="input-firstName"
                name={t('user.firstName')}
                label={t('user.firstName')}
                variant="outlined"
                value={staffData?.firstName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('user.lastName')}
                id="input-lastName"
                name={t('user.lastName')}
                variant="outlined"
                value={staffData?.lastName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('user.email')}
                id="input-email"
                name={t('user.email')}
                variant="outlined"
                value={staffData?.email}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('user.role')}
                id="input-role"
                name={t('user.role')}
                variant="outlined"
                value={staffData?.role}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('user.status')}
                id="input-status"
                name={t('user.status')}
                variant="outlined"
                value={staffData?.isActive ? t('user.statuses.enable') : t('user.statuses.disable')}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                className={classes.hide}
                fullWidth
                label={t('user.lastName')}
                id="input-lastName"
                name={t('user.lastName')}
                variant="outlined"
                value={staffData?.lastName}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('staffProfile.createdDate')}
                id="input-createdDate"
                name={t('staffProfile.createdDate')}
                variant="outlined"
                value={formatDate(staffData?.createdDate)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('user.updatedDate')}
                id="input-updatedDate"
                name={t('user.updatedDate')}
                variant="outlined"
                value={formatDate(staffData?.updatedDate)}
                InputProps={{
                  readOnly: true,
                }}
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
