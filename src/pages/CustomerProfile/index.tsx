import { Fragment, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'
import {
  Breadcrumbs,
  Typography,
  Card,
  Grid,
  Button,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Paper,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  Chip,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { formatDate } from 'utils'
import config from 'config'
import Pagination from '@material-ui/lab/Pagination'
import { CSVLink } from 'react-csv'
import { Page } from 'layout/LayoutRoute'
import PageTitle from 'components/PageTitle'
import NoResultCard from 'components/NoResultCard'
import { searchCustomer } from 'services/web-bff/customer'
import { UserInputRequest } from 'services/web-bff/user.type'
import { CustomerMeProps } from 'services/web-bff/customer.type'
import './pagination.css'

const useStyles = makeStyles({
  headerTopic: {
    padding: '8px 16px',
  },
  searchBar: {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'left',
  },
  filter: {
    height: '90px',
  },
  paddingLeft: {
    paddingLeft: '16px',
  },
  addButton: {
    color: '#fff',
    backgroundColor: '#424E63',
  },
  noUnderLine: {
    color: 'white',
    textDecoration: 'none',
  },
  table: {
    width: '100%',
  },
  hideObject: {
    display: 'none',
  },
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
  },
  paginationContrainer: {
    display: 'flex',
    listStyleType: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
    round: 'true',
  },
  width120: {
    width: '120px',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  chipGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  chipRed: {
    backgroundColor: '#F44336',
    color: 'white',
  },
  chipGrey: {
    backgroundColor: '#424E63',
    color: 'white',
  },
  chipLightGrey: {
    backgroundColor: '#E0E0E0',
    color: 'black',
  },
})

export default function CustomerProfile(): JSX.Element {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const searchParams = useLocation().search
  const queryString = new URLSearchParams(searchParams)
  const kycStatus = queryString.get('kycStatus')
  const defaultFilter: UserInputRequest = {
    kycStatusEqual: kycStatus || null,
  } as UserInputRequest
  const [userFilter] = useState<UserInputRequest>({ ...defaultFilter })

  const { data: userResponse, refetch } = useQuery('customer-list', () =>
    searchCustomer({ data: userFilter, page, size: pageSize } as CustomerMeProps)
  )
  const csvHeaders = [
    { label: t('user.id'), key: 'id' },
    { label: t('user.firstName'), key: 'firstName' },
    { label: t('user.lastName'), key: 'lastName' },
    { label: t('user.email'), key: 'email' },
    { label: t('user.phone'), key: 'phone' },
    { label: t('user.status'), key: 'status' },
    { label: t('user.kyc.status'), key: 'kycStatus' },
    { label: t('user.kyc.rejectReason'), key: 'kycReason' },
    { label: t('user.userGroups'), key: 'userGroup' },
    { label: t('user.createdDate'), key: 'createdDate' },
    { label: t('user.updatedDate'), key: 'updatedDate' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  const userData =
    (userResponse &&
      userResponse.data?.customers.length > 0 &&
      userResponse.data.customers.map((user) => {
        // Build CSV Data
        const acctStatus = user.isActive ? 'Enable' : 'Disable'
        const makeCsvData = () => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phoneNumber,
          status: acctStatus,
          kycStatus: user.kycStatus,
          //   verifyDate: formatDate(), // TO DO check api response
          kycReason: user.kycReason,
          userGroup: user.customerGroups,
          createdDate: formatDate(user.createdDate),
          updatedDate: formatDate(user.updatedDate),
        })
        csvData.push(makeCsvData())
        // Build Table Body
        return (
          <TableRow
            hover
            onClick={() => history.push(`/customer-profile/${user.id}/edit`)}
            key={`customer-${user.id}`}
          >
            <TableCell>
              <Checkbox className={classes.hideObject} size="small" />
            </TableCell>
            <TableCell>{user.firstName}</TableCell>
            <TableCell>{user.lastName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phoneNumber}</TableCell>
            <TableCell align="center">
              {!user.isActive ? (
                <Chip
                  size="small"
                  label={t('user.statuses.inactive')}
                  className={classes.chipLightGrey}
                />
              ) : (
                <Chip
                  size="small"
                  label={t('user.statuses.active')}
                  className={classes.chipGreen}
                />
              )}
            </TableCell>
            <TableCell align="center">
              {user.kycStatus === null ? (
                user.kycStatus
              ) : user.kycStatus.toLowerCase() === 'rejected' ? (
                <Chip size="small" label={t('user.kyc.rejected')} className={classes.chipRed} />
              ) : user.kycStatus.toLowerCase() === 'verified' ? (
                <Chip size="small" label={t('user.kyc.verified')} className={classes.chipGreen} />
              ) : (
                <Chip size="small" label={t('user.kyc.pending')} className={classes.chipGrey} />
              )}
            </TableCell>
            <TableCell>{formatDate(user.createdDate)}</TableCell>
            <TableCell>{formatDate(user.updatedDate)}</TableCell>
          </TableRow>
        )
      })) ||
    []
  const isNoData = userData.length < 1
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (userResponse?.data.pagination) {
      setPage(userResponse.data.pagination.page)
      setPageSize(userResponse.data.pagination.size)
      setPages(userResponse.data.pagination.totalPage)
    }
  }, [userResponse, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [pages, page, pageSize, refetch])

  return (
    <Page>
      <PageTitle title={t('sidebar.userManagement.customerProfile')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Typography color="primary">{t('sidebar.userManagement.customerProfile')}</Typography>
      </Breadcrumbs>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography>{t('user.custometList')}</Typography>
        </div>
        <Grid className={classes.searchBar} container spacing={1}>
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={3} />
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={3} />
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={4} />
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={2}>
            <Button
              id="customer_profile__export_btn"
              className={classes.addButton}
              color="primary"
              variant="contained"
            >
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="EVme Admin Dashboard.csv"
                className={classes.noUnderLine}
              >
                {t('button.export')}
              </CSVLink>
            </Button>
          </Grid>
        </Grid>
        {isNoData ? (
          <NoResultCard />
        ) : (
          <Fragment>
            <TableContainer component={Paper} className={classes.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Checkbox className={classes.hideObject} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.firstName')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.lastName')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.email')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.phone')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.status')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.kyc.status')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('staffProfile.createdDate')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                        {t('user.updatedDate')}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{userData}</TableBody>
              </Table>
            </TableContainer>
            <Card>
              <div className={classes.paginationContrainer}>
                {t('table.rowPerPage')}:&nbsp;
                <FormControl className={classes.inlineElement}>
                  <Select
                    value={userResponse?.data.pagination?.size || pageSize}
                    defaultValue={userResponse?.data.pagination?.size || pageSize}
                    onChange={(event) => {
                      setPage(1)
                      setPages(event.target.value as number)
                      setPageSize(event.target.value as number)
                    }}
                  >
                    {config.tableRowsPerPageOptions?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                &nbsp;&nbsp;{userResponse?.data.pagination?.page || pages} {t('staffProfile.of')}
                &nbsp;
                {userResponse?.data.pagination?.totalPage || pages}
                <Pagination
                  count={userResponse?.data.pagination?.totalPage || pages}
                  page={userResponse?.data.pagination?.page || page}
                  defaultPage={userResponse?.data.pagination?.page || page}
                  variant="text"
                  shape="rounded"
                  onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value)
                  }}
                />
              </div>
            </Card>
          </Fragment>
        )}
      </Card>
    </Page>
  )
}
