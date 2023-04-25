import {
  Typography,
  Breadcrumbs,
  Card,
  Link,
  Button,
  Grid,
  TextField,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@mui/material'
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

interface CustomerProfileDetailEditParam {
  id: string
}

export default function CustomerProfileDetail(): JSX.Element {
  const useStyles = makeStyles({
    hide: {
      display: 'none',
    },
    headerTopic: {
      padding: '8px 16px',
    },
    headerTopicText: {
      fontSize: '18px',
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
    textField: {
      '& .MuiInputBase-input': {
        height: '1.4rem',
      },
    },
    breadcrumText: {
      color: '#000000DE',
    },
  })
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
  const userGroup =
    userResponse?.data.customers[0].customerGroups.map((group, i) => {
      return (
        <TableRow key={i}>
          <TableCell>{group}</TableCell>
        </TableRow>
      )
    }) || []
  const isNoUserGroup = userGroup.length > 0
  const generateUserGroupTable = () => {
    if (!isNoUserGroup) {
      return <TableRow />
    }
    return <TableBody>{userGroup}</TableBody>
  }
  const handleOnCancel = () => {
    return history.goBack()
  }

  return (
    <Page>
      <PageTitle title={t('sidebar.userManagement.customerProfile')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Link underline="hover" color="inherit" href="/customer-profiles">
          {t('sidebar.userManagement.customerProfile')}
        </Link>
        <Typography className={classes.breadcrumText}>{t('sidebar.customerDetails')}</Typography>
      </Breadcrumbs>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography className={classes.headerTopicText}>
            {t('sidebar.customerDetails')}
          </Typography>
        </div>
        <Grid container spacing={2} className={classes.detailContainer}>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__customerId"
              className={classes.textField}
              label={t('user.customerId')}
              fullWidth
              disabled
              variant="outlined"
              value={customerData?.id || ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__accountStatus"
              className={classes.textField}
              label={t('user.status')}
              fullWidth
              disabled
              variant="outlined"
              value={acctStatus || '-'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__firstName"
              className={classes.textField}
              label={t('user.firstName')}
              fullWidth
              disabled
              variant="outlined"
              value={customerData?.firstName || '-'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__lastName"
              className={classes.textField}
              label={t('user.lastName')}
              fullWidth
              disabled
              variant="outlined"
              value={customerData?.lastName || '-'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__email"
              className={classes.textField}
              label={t('user.email')}
              fullWidth
              disabled
              variant="outlined"
              value={customerData?.email || '-'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__phoneNumber"
              className={classes.textField}
              label={t('user.phone')}
              fullWidth
              disabled
              variant="outlined"
              value={convertPhoneNumber(customerData?.phoneNumber) || '-'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="customer_profile__createdDate"
              label={t('user.createdDate')}
              fullWidth
              disabled
              variant="outlined"
              value={formaDateStringWithPattern(
                customerData?.createdDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
            />
          </Grid>
        </Grid>
      </Card>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography className={classes.headerTopicText}>
            {t('user.verificationDetail')}
          </Typography>
        </div>
        <Grid container spacing={2} className={classes.detailContainer}>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__kycStatus"
              className={classes.textField}
              label={t('user.kyc.status')}
              fullWidth
              disabled
              variant="outlined"
              value={kycStatusValue || '-'}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="text"
              id="customer_profile__rejectReason"
              className={classes.textField}
              label={t('user.rejectedReason')}
              fullWidth
              disabled
              variant="outlined"
              value={customerData?.kycReason || '-'}
            />
          </Grid>
        </Grid>
      </Card>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography className={classes.headerTopicText}>{t('user.userGroup')}</Typography>
        </div>
        <Grid container spacing={2} className={classes.detailContainer}>
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">{t('user.name')}</TableCell>
                </TableRow>
              </TableHead>
              {generateUserGroupTable()}
            </Table>
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
