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
  TextField,
  CircularProgress,
} from '@mui/material'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATETIME_FORMAT_ISO,
  formatDate,
  validateKeywordText,
} from 'utils'
import config from 'config'
import Pagination from '@material-ui/lab/Pagination'
import { useFormik } from 'formik'
import { CSVLink } from 'react-csv'
import { Page } from 'layout/LayoutRoute'
import DatePicker from 'components/DatePicker'
import PageTitle from 'components/PageTitle'
import { searchCustomer } from 'services/web-bff/customer'
import { UserInputRequest } from 'services/web-bff/user.type'
import { CustomerFilterRequest, CustomerMeProps } from 'services/web-bff/customer.type'
import './pagination.css'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)
const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()
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
  searchTextField: {
    width: '200px',
  },
  buttonWithoutShadow: {
    fontWeight: 'bold',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
  },
  exportButton: {
    fontWeight: 'bold',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
    color: '#fff',
    backgroundColor: '#424E63',
  },
  noResultMessage: {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '48px 0',
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
  const defaultFilter: CustomerFilterRequest = {
    kycStatusEqual: kycStatus || null,
  } as UserInputRequest
  const [customerFilter, setCustomerFilter] = useState<CustomerFilterRequest>({ ...defaultFilter })
  const [filterSearchField, setFilterSearchField] = useState<string>('')
  const [filterSearchFieldError, setFilterSearchFieldError] = useState<string>('')
  const [showTextField, setShowTextField] = useState<boolean>(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false)
  const [showKycStatusDropdown, setShowKycStatusDropdown] = useState<boolean>(false)
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showSearchButton, setShowSearchButton] = useState<boolean>(false)
  const [isEnableFilterButton, setIsEnableFilterButton] = useState<boolean>(false)
  const onCriteriaChange = (params: string) => {
    if (params === ' ') {
      setShowTextField(false)
      setShowStatusDropdown(false)
      setShowKycStatusDropdown(false)
      setShowDatePicker(false)
      setShowSearchButton(false)
    } else if (params === 'accountStatus') {
      setShowTextField(false)
      setShowStatusDropdown(true)
      setShowKycStatusDropdown(false)
      setShowDatePicker(false)
      setShowSearchButton(true)
    } else if (params === 'kycStatus') {
      setShowTextField(false)
      setShowStatusDropdown(false)
      setShowKycStatusDropdown(true)
      setShowDatePicker(false)
      setShowSearchButton(true)
    } else if (params === 'createdDate' || params === 'updatedDate') {
      setShowTextField(false)
      setShowStatusDropdown(false)
      setShowKycStatusDropdown(false)
      setShowDatePicker(true)
      setShowSearchButton(true)
    } else {
      setShowTextField(true)
      setShowStatusDropdown(false)
      setShowKycStatusDropdown(false)
      setShowDatePicker(false)
      setShowSearchButton(true)
    }
  }
  const formik = useFormik({
    initialValues: {
      input: '',
      searchType: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      let updateObj
      if (value.searchType === 'createdDate' || value.searchType === 'updatedDate') {
        updateObj = {
          [value.searchType]: dayjs(selectedFromDate)
            .startOf('day')
            .format(DEFAULT_DATETIME_FORMAT_ISO),
        } as CustomerFilterRequest
      } else {
        updateObj = {
          [value.searchType]: filterSearchField,
        } as CustomerFilterRequest
      }
      setCustomerFilter(updateObj)
      setPage(1)
    },
  })
  const {
    data: userResponse,
    refetch,
    isFetching: isFetchingActivities,
  } = useQuery('customer-list', () =>
    searchCustomer({ data: customerFilter, page, size: pageSize } as CustomerMeProps)
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
            key={`admin-user-${user.id}`}
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
  const isNoData = userData.length > 0
  const generateDataToTable = () => {
    if (isNoData) {
      return <TableBody>{userData}</TableBody>
    }
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9}>
            <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
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
  }, [customerFilter, pages, page, pageSize, refetch])
  const handleOnSearchFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isKeywordAccepted = validateKeywordText(value)
    setFilterSearchField(value)
    setFilterSearchFieldError('')
    if (isKeywordAccepted && value.length >= 2) {
      setFilterSearchField(value)
      setIsEnableFilterButton(true)
    } else if (value !== '') {
      setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidFormat'))
      setIsEnableFilterButton(false)
    } else {
      setFilterSearchField('')
      setIsEnableFilterButton(false)
    }
  }
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
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={3}>
            <TextField
              className={classes.searchTextField}
              fullWidth
              select
              label={t('staffProfile.searchCriteria')}
              id="staff-profile__criteria_select"
              name="searchCriteria"
              value={formik.values.searchType}
              variant="outlined"
              onChange={(event) => {
                formik.setFieldValue('searchType', event.target.value)
                setIsEnableFilterButton(false)
                setFilterSearchField('')
                setFilterSearchFieldError('')
                onCriteriaChange(event.target.value as string)
              }}
            >
              <MenuItem value=" ">
                <em />
              </MenuItem>
              <MenuItem value="userId">{t('user.id')}</MenuItem>
              <MenuItem value="firstName">{t('user.firstName')}</MenuItem>
              <MenuItem value="lastName">{t('user.lastName')}</MenuItem>
              <MenuItem value="email">{t('user.email')}</MenuItem>
              <MenuItem value="phoneNumber">{t('user.phone')}</MenuItem>
              <MenuItem value="accountStatus">{t('user.status')}</MenuItem>
              <MenuItem value="kycStatus">{t('user.kyc.status')}</MenuItem>
              <MenuItem value="customerGroupName">{t('user.userGroups')}</MenuItem>
              <MenuItem value="createdDate">{t('staffProfile.createdDate')}</MenuItem>
              <MenuItem value="updatedDate">{t('user.updatedDate')}</MenuItem>
            </TextField>
          </Grid>
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={3}>
            <TextField
              className={showTextField ? '' : classes.hideObject}
              label={t('carAvailability.searchField.label')}
              id="customer-profile__search_input"
              name="searchVal"
              value={filterSearchField}
              onChange={handleOnSearchFieldChange}
              error={!!filterSearchFieldError}
              helperText={filterSearchFieldError}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              className={showStatusDropdown ? '' : classes.hideObject}
              fullWidth
              select
              value={filterSearchField}
              onChange={handleOnSearchFieldChange}
              label={t('user.status')}
              id="customer-profile__status_select"
              name="status"
              variant="outlined"
            >
              <MenuItem value="active">{t('user.statuses.active')}</MenuItem>
              <MenuItem value="inactive">{t('user.statuses.inactive')}</MenuItem>
              <MenuItem value="deleted">{t('user.statuses.deleted')}</MenuItem>
            </TextField>
            <TextField
              className={showKycStatusDropdown ? '' : classes.hideObject}
              fullWidth
              select
              value={filterSearchField}
              onChange={handleOnSearchFieldChange}
              label={t('user.kyc.status')}
              id="customer-profile__status_select"
              name="kyCstatus"
              variant="outlined"
            >
              <MenuItem value="PENDING">{t('user.kyc.pending')}</MenuItem>
              <MenuItem value="VERIFIED">{t('user.kyc.verified')}</MenuItem>
              <MenuItem value="REJECTED">{t('user.kyc.rejected')}</MenuItem>
            </TextField>
            <DatePicker
              className={showDatePicker ? '' : classes.hideObject}
              label={t('staffProfile.searchDate')}
              id="customer-profile__searchdate_input"
              name="selectedFromDate"
              value={selectedFromDate}
              format={DEFAULT_DATE_FORMAT}
              inputVariant="outlined"
              onChange={(date) => {
                date && setSelectedFromDate(date.toDate())
                setIsEnableFilterButton(true)
              }}
            />
          </Grid>
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={3}>
            <Button
              id="staff_profile__search_btn"
              className={showSearchButton ? classes.buttonWithoutShadow : classes.hideObject}
              variant="contained"
              onClick={() => formik.handleSubmit()}
              disabled={!isEnableFilterButton}
            >
              {t('carAvailability.searchBtn')}
            </Button>
          </Grid>
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} xs={3}>
            <Button
              id="customer_profile__export_btn"
              className={classes.exportButton}
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

              {isFetchingActivities ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                generateDataToTable()
              )}
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
      </Card>
    </Page>
  )
}
