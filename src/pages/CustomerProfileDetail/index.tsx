import { Typography, Breadcrumbs, Card, Link, Button, Grid, TextField } from '@mui/material'
import { makeStyles } from '@mui/styles'
// import { formatDate } from 'utils'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import {
  convertPhoneNumber,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
} from 'utils'
import { Page } from 'layout/LayoutRoute'
import PageTitle from 'components/PageTitle'
import { CustomerMeProps } from 'services/web-bff/customer.type'
import { searchCustomer } from 'services/web-bff/customer'

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

interface CustomerProfileDetailEditParam {
  id: string
}

export default function CustomerProfileDetail(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const classes = useStyles()
  const params = useParams<CustomerProfileDetailEditParam>()
  const { data: userResponse } = useQuery('customer-list', () =>
    searchCustomer({ data: params, page: 1, size: 1 } as CustomerMeProps)
  )

  const customerData =
    userResponse?.data.customers.length === 1 ? userResponse?.data.customers[0] : null
  const acctStatus = customerData?.isActive ? 'Active' : 'Deleted'
  let kycStatusValue: string
  if (customerData?.kycStatus === null) {
    kycStatusValue = ''
  } else if (customerData?.kycStatus.toLowerCase() === 'rejected') {
    kycStatusValue = t('user.kyc.rejected')
  } else if (customerData?.kycStatus.toLowerCase() === 'verified') {
    kycStatusValue = t('user.kyc.verified')
  } else {
    kycStatusValue = t('user.kyc.pending')
  }
  const handleOnCancel = () => {
    return history.goBack()
  }

  return (
    <Page>
      <PageTitle title={t('sidebar.userManagement.customerProfile')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Link underline="hover" color="inherit" href="/customer-profile">
          {t('sidebar.userManagement.customerProfile')}
        </Link>
        <Typography color="primary">{t('sidebar.customerDetails')}</Typography>
      </Breadcrumbs>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography>{t('sidebar.customerDetails')}</Typography>
        </div>
        <Grid container spacing={2} className={classes.detailContainer}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-customerid"
              name={t('user.customerId')}
              label={t('user.customerId')}
              variant="outlined"
              value={customerData?.id}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-accountstatus"
              name={t('user.status')}
              label={t('user.status')}
              variant="outlined"
              value={acctStatus}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-fistname"
              name={t('user.firstName')}
              label={t('user.firstName')}
              variant="outlined"
              value={customerData?.firstName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-lastname"
              name={t('user.lastName')}
              label={t('user.lastName')}
              variant="outlined"
              value={customerData?.lastName}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-email"
              name={t('user.email')}
              label={t('user.email')}
              variant="outlined"
              value={customerData?.email}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-phonenumber"
              name={t('user.phone')}
              label={t('user.phone')}
              variant="outlined"
              value={convertPhoneNumber(customerData?.phoneNumber)}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-createddate"
              name={t('user.createdDate')}
              label={t('user.createdDate')}
              variant="outlined"
              value={formaDateStringWithPattern(
                customerData?.createdDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-updateddate"
              name={t('user.updatedDate')}
              label={t('user.updatedDate')}
              variant="outlined"
              value={formaDateStringWithPattern(
                customerData?.updatedDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Card>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography>{t('user.verificationDetail')}</Typography>
        </div>
        <Grid container spacing={2} className={classes.detailContainer}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-kycstatus"
              name={t('user.kyc.status')}
              label={t('user.kyc.status')}
              variant="outlined"
              value={kycStatusValue}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-rejectreason"
              name={t('user.rejectedReason')}
              label={t('user.rejectedReason')}
              variant="outlined"
              value={customerData?.kycReason}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Card>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography>{t('user.userGroups')}</Typography>
        </div>
        <Grid container spacing={2} className={classes.detailContainer}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              id="input-userGroup-id"
              name={t('user.userGroups')}
              label={t('user.userGroups')}
              variant="outlined"
              value={customerData?.customerGroups}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </Card>
      <Card>
        <div className={classes.bottomContrainer}>
          <Button variant="outlined" onClick={handleOnCancel}>
            {t('button.cancel')}
          </Button>
        </div>
      </Card>
    </Page>
  )
}
