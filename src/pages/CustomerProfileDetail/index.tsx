import { useState } from 'react'
import {
  Typography,
  Card,
  Grid,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  MenuItem,
  TextField,
  Button,
} from '@mui/material'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  convertPhoneNumber,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
} from 'utils'
import { useAuth } from 'auth/AuthContext'
import { useParams, useHistory } from 'react-router-dom'
import { hasAllowedPrivilege, PRIVILEGES } from 'auth/privileges'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { CustomerMeProps } from 'services/web-bff/customer.type'
import { searchCustomer } from 'services/web-bff/customer'
import { reActivateCustomer } from 'services/web-bff/user'
import { DisabledField } from './styles'

interface CustomerProfileDetailEditParam {
  id: string
}

export default function CustomerProfileDetail(): JSX.Element {
  const useStyles = makeStyles({
    hide: {
      display: 'none',
    },
    container: {
      marginTop: '5px!important',
      marginBottom: '5px',
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
    w83: {
      width: '83px',
    },
  })
  const { t } = useTranslation()
  const classes = useStyles()
  const history = useHistory()
  const { getPrivileges } = useAuth()
  const [updateAccountStatus, setUpdateAccountStatus] = useState<boolean>(false)
  const [isEnableSaveButton, setIsEnableSaveButton] = useState<boolean>(false)
  const params = useParams<CustomerProfileDetailEditParam>()
  const { data: userResponse, refetch } = useQuery('customer-list', () =>
    searchCustomer({ data: params, page: 1, size: 1 } as CustomerMeProps)
  )
  const onChangeStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    let isActived
    if (event.target.value === 'true') {
      isActived = true
    } else {
      isActived = false
    }
    if (isActived) {
      setUpdateAccountStatus(true)
      setIsEnableSaveButton(true)
    } else {
      setUpdateAccountStatus(false)
      setIsEnableSaveButton(false)
    }
  }
  const customerData =
    userResponse?.data.customers.length === 1 ? userResponse?.data.customers[0] : null
  const acctStatus = customerData?.isActive ? 'Active' : 'Inactive'
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
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.userManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.userManagement.customerProfile'),
      link: '/customer-profiles',
    },
    {
      text: t('sidebar.customerDetails'),
      link: `/edit`,
    },
  ]
  const isDeletedUser = customerData?.isActive !== true
  function isAllowEdit() {
    return (
      hasAllowedPrivilege(getPrivileges(), [PRIVILEGES.PERM_ACCOUNT_ACTIVATION_EDIT]) &&
      isDeletedUser
    )
  }
  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      if (updateAccountStatus && customerData) {
        toast
          .promise(reActivateCustomer(customerData.id), {
            loading: t('toast.loading'),
            success: () => {
              return t('user.updateDialog.success')
            },
            error: (error) => error.message,
          })
          .finally(() => {
            refetch()
            setIsEnableSaveButton(false)
          })
      }
    },
  })
  return (
    <Page>
      <PageTitle title={t('user.customerDetail')} breadcrumbs={breadcrumbs} />
      <form onSubmit={formik.handleSubmit}>
        <Card className={classes.card}>
          <Grid className={classes.gridTitle}>
            <Typography variant="h6">{t('user.customerDetail')}</Typography>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
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
            <Grid item xs={12} sm={6}>
              {isAllowEdit() ? (
                <TextField
                  fullWidth
                  select
                  value={updateAccountStatus}
                  label={t('user.status')}
                  id="customer_profile__accountStatus"
                  variant="outlined"
                  onChange={onChangeStatus}
                >
                  <MenuItem value="true">{t('user.statuses.active')}</MenuItem>
                  <MenuItem value="false">{t('user.statuses.inactive')}</MenuItem>
                </TextField>
              ) : (
                <DisabledField
                  type="text"
                  id="customer_profile__accountStatus"
                  className={classes.textField}
                  label={t('user.status')}
                  fullWidth
                  disabled
                  variant="outlined"
                  value={acctStatus || '-'}
                />
              )}
            </Grid>
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
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
            <Grid item xs={12} sm={6}>
              <DisabledField
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
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
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
            <Grid item xs={12} sm={6}>
              <DisabledField
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
          </Grid>
          <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
              <DisabledField
                className={classes.textField}
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
        </Card>
      </form>
      <br />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">{t('user.verificationDetail')}</Typography>
        </Grid>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
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
          <Grid item xs={12} sm={6}>
            <DisabledField
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
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">{t('user.userGroup')}</Typography>
        </Grid>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={12}>
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
    </Page>
  )
}
