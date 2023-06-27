import { Fragment, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, useLocation } from 'react-router-dom'
import {
  Typography,
  Grid,
  Button,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Chip,
  TextField,
  CircularProgress,
  InputAdornment,
} from '@mui/material'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import {
  DEFAULT_DATETIME_FORMAT_ISO,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  validateKeywordTextWithSpecialChar,
  convertPhoneNumber,
  validateKeywordText,
  validateKeywordUUID,
  validatePhoneNumberSearch,
} from 'utils'
import config from 'config'
import { useFormik } from 'formik'
import { CSVLink } from 'react-csv'
import { CloseOutlined } from '@mui/icons-material'
import { Page } from 'layout/LayoutRoute'
import DatePicker from 'components/DatePicker'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { searchCustomer } from 'services/web-bff/customer'
import { UserInputRequest } from 'services/web-bff/user.type'
import {
  CustomerFilterRequest,
  CustomerInputRequest,
  CustomerMeProps,
} from 'services/web-bff/customer.type'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import {
  ContentSection,
  DataWrapper,
  GridSearchSection,
  TextLineClamp,
  TextSmallLineClamp,
  Wrapper,
} from 'components/Styled'
import Paginate from 'components/Paginate'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)
const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()

export default function CustomerProfile(): JSX.Element {
  const useStyles = makeStyles({
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
    chipGreen: {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '64px',
    },
    chipRed: {
      backgroundColor: '#F44336',
      color: 'white',
      borderRadius: '64px',
    },
    chipGrey: {
      backgroundColor: '#424E63',
      color: 'white',
      borderRadius: '64px',
    },
    chipLightGrey: {
      backgroundColor: '#E0E0E0',
      color: 'black',
      borderRadius: '64px',
    },
    buttonWithoutShadow: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      width: '107px',
    },
    gridExport: {
      textAlign: 'right',
    },
    exportButton: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      color: '#fff',
      backgroundColor: '#424E63',
      width: '107px',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    paddingRightBtnClear: {
      marginLeft: '-40px',
      cursor: 'pointer',
      padding: '4px 4px',
    },
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16.5px 14px',
      },
    },
  })
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const searchParams = useLocation().search
  const queryString = new URLSearchParams(searchParams)
  const kycStatus = queryString.get('kycStatus')
  const defaultFilter: CustomerInputRequest = {
    kycStatus: kycStatus?.toUpperCase() || null,
  } as UserInputRequest
  const [customerFilter, setCustomerFilter] = useState<CustomerInputRequest>({ ...defaultFilter })
  const [filterSearchField, setFilterSearchField] = useState<string>('')
  const [filterSearchFieldError, setFilterSearchFieldError] = useState<string>('')
  const [showTextField, setShowTextField] = useState<boolean>(true)
  const [TextFieldPlaceholder, setTextFieldPlaceholder] = useState<string>(
    t('carAvailability.searchField.label')
  )
  const [showStatusDropdown, setShowStatusDropdown] = useState<boolean>(false)
  const [showKycStatusDropdown, setShowKycStatusDropdown] = useState<boolean>(false)
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showSearchButton, setShowSearchButton] = useState<boolean>(true)
  const [isEnableFilterButton, setIsEnableFilterButton] = useState<boolean>(false)
  const onCriteriaChange = (params: string) => {
    if (params === ' ') {
      setShowTextField(false)
      setShowStatusDropdown(false)
      setShowKycStatusDropdown(false)
      setShowDatePicker(false)
      setShowSearchButton(false)
    } else if (params === 'isActive') {
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
      setIsEnableFilterButton(true)
    } else {
      if (params === 'phoneNumber') {
        setTextFieldPlaceholder(t('user.searchField.phoneNumber'))
      } else {
        setTextFieldPlaceholder(t('carAvailability.searchField.label'))
      }
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
      searchType: customerFilter.kycStatus ? 'kycStatus' : '',
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
      } else if (value.searchType === 'accountStatus') {
        const isActive: boolean = filterSearchField === 'true'
        updateObj = {
          [value.searchType]: isActive,
        } as CustomerFilterRequest
      } else if (value.searchType === 'phoneNumber') {
        updateObj = {
          mobileNumberContain: filterSearchField,
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

  const handleClear = () => {
    setFilterSearchField('')
    setFilterSearchFieldError('')
    setIsEnableFilterButton(false)
    setShowTextField(true)
    setShowStatusDropdown(false)
    setShowKycStatusDropdown(false)
    setShowDatePicker(false)
    setShowSearchButton(true)
    removeQueryParams()
    formik.setFieldValue('searchType', '')
    formik.handleSubmit()
  }
  const {
    data: userResponse,
    refetch,
    isFetching: isFetchingActivities,
  } = useQuery(
    'customer-list',
    () => searchCustomer({ data: customerFilter, page, size: pageSize } as CustomerMeProps),
    { cacheTime: 10 * (60 * 1000), staleTime: 5 * (60 * 1000) }
  )

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.userManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.userManagement.customerProfile'),
      link: '/customer-profiles',
    },
  ]

  const csvHeaders = [
    { label: 'ID', key: 'id' },
    { label: 'First name', key: 'firstName' },
    { label: 'Last name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone number', key: 'phone' },
    { label: 'Account Status', key: 'status' },
    { label: 'KYC Status', key: 'kycStatus' },
    { label: 'Reason of rejection', key: 'kycReason' },
    { label: 'User group', key: 'userGroup' },
    { label: 'Created Date', key: 'createdDate' },
    { label: 'Updated Date', key: 'updatedDate' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  const userData =
    (userResponse &&
      userResponse.data?.customers.length > 0 &&
      userResponse.data.customers.map((user) => {
        // Build CSV Data
        const acctStatus = user.isActive ? 'Active' : 'Inactive'
        let kycStatusValue: string
        if (user.kycStatus === null) {
          kycStatusValue = ''
        } else if (user.kycStatus.toLowerCase() === 'rejected') {
          kycStatusValue = t('user.kyc.rejected')
        } else if (user.kycStatus.toLowerCase() === 'verified') {
          kycStatusValue = t('user.kyc.verified')
        } else {
          kycStatusValue = t('user.kyc.pending')
        }
        const makeCsvData = () => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: convertPhoneNumber(user.phoneNumber),
          status: acctStatus,
          kycStatus: kycStatusValue,
          //   verifyDate: formatDate(), // TO DO check api response
          kycReason: user.kycReason,
          userGroup: user.customerGroups,
          createdDate: formaDateStringWithPattern(
            user.createdDate,
            DEFAULT_DATETIME_FORMAT_MONTH_TEXT
          ),
          updatedDate: formaDateStringWithPattern(
            user.updatedDate,
            DEFAULT_DATETIME_FORMAT_MONTH_TEXT
          ),
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
              <DataWrapper>
                <TextLineClamp>{user.firstName}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{user.lastName}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{user.email}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextSmallLineClamp>{convertPhoneNumber(user.phoneNumber)}</TextSmallLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell width={50}>
              <DataWrapper>
                <TextSmallLineClamp>
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
                </TextSmallLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextSmallLineClamp>
                  {user.kycStatus === null ? (
                    user.kycStatus
                  ) : user.kycStatus.toLowerCase() === 'rejected' ? (
                    <Chip size="small" label={t('user.kyc.rejected')} className={classes.chipRed} />
                  ) : user.kycStatus.toLowerCase() === 'verified' ? (
                    <Chip
                      size="small"
                      label={t('user.kyc.verified')}
                      className={classes.chipGreen}
                    />
                  ) : (
                    <Chip size="small" label={t('user.kyc.pending')} className={classes.chipGrey} />
                  )}
                </TextSmallLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>
                  {formaDateStringWithPattern(user.createdDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
                </TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>
                  {formaDateStringWithPattern(user.updatedDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
                </TextLineClamp>
              </DataWrapper>
            </TableCell>
          </TableRow>
        )
      })) ||
    []
  const isNoData = userData.length > 0
  const generateTableBody = () => {
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
  }, [userResponse, refetch, isEnableFilterButton])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
    // Handle events get url parameters
    if (kycStatus !== null) {
      setShowKycStatusDropdown(true)
      setShowTextField(false)
      setIsEnableFilterButton(true)
      setFilterSearchField(customerFilter.kycStatus ? customerFilter.kycStatus.toUpperCase() : '')
    }
  }, [customerFilter, pages, page, pageSize, refetch, kycStatus])
  const removeQueryParams = () => {
    if (queryString.has('kycStatus')) {
      queryString.delete('kycStatus')
      history.replace({
        search: queryString.toString(),
      })
    }
  }
  const handleOnSearchFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isValidEmailSearchField = validateKeywordTextWithSpecialChar(value)
    const isValidKeywordText = validateKeywordText(value)
    const isValidUUIDSearchField = validateKeywordUUID(value)
    const isValidPhoneSearchField = validatePhoneNumberSearch(value)
    setFilterSearchField(value)
    setFilterSearchFieldError('')
    if (formik.values.searchType === 'id' && !isValidUUIDSearchField) {
      setFilterSearchFieldError(t('user.searchField.invalidUUIDFormat'))
      setIsEnableFilterButton(false)
    } else if (
      formik.values.searchType === 'email' &&
      (!isValidEmailSearchField || value.length < 2)
    ) {
      setFilterSearchFieldError(t('user.searchField.invalidSearchEmailFormat'))
      setIsEnableFilterButton(false)
    } else if (
      formik.values.searchType === 'phoneNumber' &&
      (!isValidPhoneSearchField || value.length < 4)
    ) {
      setFilterSearchFieldError(t('user.searchField.invalidPhoneNumberFormat'))
      setIsEnableFilterButton(false)
    } else if (
      formik.values.searchType !== 'id' &&
      formik.values.searchType !== 'email' &&
      (!isValidKeywordText || value.length < 2)
    ) {
      setFilterSearchFieldError(t('user.searchField.invalidFormat'))
      setIsEnableFilterButton(false)
    } else {
      setFilterSearchField(value)
      setIsEnableFilterButton(true)
    }
  }
  const headerText: TableHeaderProps[] = [
    {
      text: t('user.firstName'),
    },
    {
      text: t('user.lastName'),
    },
    {
      text: t('user.email'),
    },
    {
      text: t('user.phone'),
    },
    {
      text: t('user.status'),
    },
    {
      text: t('user.kyc.status'),
    },
    {
      text: t('staffProfile.createdDate'),
    },
    {
      text: t('user.updatedDate'),
    },
  ]
  return (
    <Page>
      <PageTitle title={t('sidebar.userManagement.customerProfile')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('user.customerList')}
          </Typography>
          <Fragment>
            <GridSearchSection container spacing={1}>
              <Grid item xs={9} sm={3}>
                <TextField
                  disabled={isFetchingActivities}
                  fullWidth
                  select
                  label={t('carAvailability.search')}
                  id="customer_profile__criteria_select"
                  name="searchCriteria"
                  value={formik.values.searchType}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.searchType && (
                          <CloseOutlined
                            className={classes.paddingRightBtnClear}
                            onClick={handleClear}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  onChange={(event) => {
                    formik.setFieldValue('searchType', event.target.value)
                    setIsEnableFilterButton(false)
                    setFilterSearchField('')
                    setFilterSearchFieldError('')
                    onCriteriaChange(event.target.value as string)
                  }}
                >
                  <MenuItem value="id">{t('user.id')}</MenuItem>
                  <MenuItem value="firstName">{t('user.firstName')}</MenuItem>
                  <MenuItem value="lastName">{t('user.lastName')}</MenuItem>
                  <MenuItem value="email">{t('user.email')}</MenuItem>
                  <MenuItem value="phoneNumber">{t('user.phone')}</MenuItem>
                  <MenuItem value="isActive">{t('user.status')}</MenuItem>
                  <MenuItem value="kycStatus">{t('user.kyc.status')}</MenuItem>
                  <MenuItem value="customerGroupName">{t('user.userGroupUp')}</MenuItem>
                  <MenuItem value="createdDate">{t('staffProfile.createdDate')}</MenuItem>
                  <MenuItem value="updatedDate">{t('user.updatedDate')}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={9} sm={3}>
                <TextField
                  className={showTextField ? '' : classes.hideObject}
                  id="customer-profile__search_input"
                  name="searchVal"
                  value={filterSearchField}
                  placeholder={TextFieldPlaceholder}
                  onChange={handleOnSearchFieldChange}
                  error={!!filterSearchFieldError}
                  helperText={filterSearchFieldError}
                  variant="outlined"
                  disabled={formik.values.searchType === ''}
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
                  <MenuItem value="true">{t('user.statuses.active')}</MenuItem>
                  <MenuItem value="false">{t('user.statuses.inactive')}</MenuItem>
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
                  fullWidth
                  className={showDatePicker ? classes.datePickerFromTo : classes.hideObject}
                  label={t('staffProfile.searchDate')}
                  KeyboardButtonProps={{
                    id: 'customer-profile__searchdate_icon',
                  }}
                  id="customer-profile__searchdate_input"
                  name="selectedFromDate"
                  value={selectedFromDate}
                  format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
                  inputVariant="outlined"
                  onChange={(date) => {
                    date && setSelectedFromDate(date.toDate())
                    setIsEnableFilterButton(true)
                  }}
                />
              </Grid>
              <Grid item xs={9} sm={2}>
                <Button
                  id="staff_profile__search_btn"
                  className={showSearchButton ? classes.buttonWithoutShadow : classes.hideObject}
                  variant="contained"
                  onClick={() => formik.handleSubmit()}
                  disabled={!isEnableFilterButton}
                >
                  {t('carAvailability.searchBtn').toUpperCase()}
                </Button>
              </Grid>
              <Grid item xs={9} sm={2} />
              <Grid item xs={9} sm={2} className={classes.gridExport}>
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
                    {t('button.export').toUpperCase()}
                  </CSVLink>
                </Button>
              </Grid>
            </GridSearchSection>
            <GridSearchSection container>
              <Grid item xs={12}>
                <TableContainer component={Paper} className={classes.table}>
                  <Table>
                    <DataTableHeader headers={headerText} />
                    {isFetchingActivities ? (
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={9} align="center">
                            <CircularProgress />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (
                      generateTableBody()
                    )}
                  </Table>
                </TableContainer>
              </Grid>
            </GridSearchSection>
            <GridSearchSection container>
              <Grid item xs={12}>
                <Paginate
                  pagination={userResponse?.data.pagination}
                  page={page}
                  pageSize={pageSize}
                  setPage={setPage}
                  setPageSize={setPageSize}
                  refetch={refetch}
                />
              </Grid>
            </GridSearchSection>
          </Fragment>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
