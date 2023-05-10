import React, { Fragment, useState, useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import {
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  TableCell,
  TableRow,
  Card,
  FormControl,
  Button,
  Grid,
  MenuItem,
  Select,
  TableBody,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import config from 'config'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  formatStringForInputText,
  validateKeywordText,
  validateKeywordUUID,
} from 'utils'
import { CloseOutlined, Search as SearchIcon } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/ControlPoint'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { useFormik } from 'formik'
import styled from 'styled-components'
import Pagination from '@material-ui/lab/Pagination'
import { getAdminUserRoleLabel, getRoleList } from 'auth/roles'
import { searchAdminUser } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import './pagination.css'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { AdminUserByCriteria, AdminUsersProps } from 'services/web-bff/admin-user.type'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const GridSearchSection = styled(Grid)`
  padding-top: 20px !important;
  align-items: left !important;
  min-height: 100px !important;
`
export default function StaffProfiles(): JSX.Element {
  const useStyles = makeStyles({
    textBoldBorder: {
      borderLeft: '2px solid #E0E0E0',
      fontWeight: 'bold',
    },
    inlineElement: {
      display: 'inline-flex',
    },
    searchTextField: {
      width: '200px',
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
    buttonExport: {
      color: 'white',
      textDecoration: 'none',
    },
    hideObject: {
      display: 'none',
    },
    headerTopic: {
      padding: '8px 16px',
    },
    table: {
      width: '100%',
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
    addButton: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      color: '#fff',
      backgroundColor: '#424E63',
      width: '107px',
    },
    pl17: {
      paddingLeft: '17px',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    width120: {
      paddingLeft: '16px',
      width: '120px',
    },
    width145: {
      paddingLeft: '16px',
      width: '145px',
    },
    gridExport: {
      textAlign: 'right',
    },
    paddingRigthBtnClear: {
      marginLeft: '-40px',
      cursor: 'pointer',
      padding: '4px 4px',
    },
  })
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [filterSearchField, setFilterSearchField] = useState<string>('')
  const [filterSearchFieldError, setFilterSearchFieldError] = useState<string>('')
  const [userFilter, setUserFilter] = useState<AdminUserByCriteria>()
  const roleList = getRoleList(t)
  const timeoutIdRef = useRef<number | null>(null)
  const {
    data: adminUsersData,
    refetch,
    isFetching: isFetchingActivities,
  } = useQuery(
    'admin-users',
    () => searchAdminUser({ data: userFilter, page, size: pageSize } as AdminUsersProps),
    {
      cacheTime: 10 * (60 * 1000),
      staleTime: 5 * (60 * 1000),
    }
  )
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.userManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.staffProfile'),
      link: '/staff-profiles',
    },
  ]
  const formik = useFormik({
    initialValues: {
      input: '',
      searchType: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      let updateObj
      if (value.searchType === 'accountStatus') {
        const isActive: boolean = filterSearchField === 'true'
        updateObj = {
          [value.searchType]: isActive,
        } as AdminUserByCriteria
      } else {
        updateObj = {
          [value.searchType]: filterSearchField,
        } as AdminUserByCriteria
      }
      setUserFilter(updateObj)
      setPage(1)
    },
  })
  const csvHeaders = [
    { label: 'First name', key: 'firstName' },
    { label: 'Last name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Account Status', key: 'status' },
    { label: 'Created Date', key: 'createdDate' },
    { label: 'Updated Date', key: 'updatedDate' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  const usersData =
    (adminUsersData &&
      adminUsersData.data?.adminUsers.length > 0 &&
      adminUsersData.data.adminUsers.map((adminUserData) => {
        // Build CSV Data
        const acctStatus = adminUserData.isActive ? 'Enable' : 'Disable'
        const makeCsvData = () => ({
          firstName: adminUserData.firstName,
          lastName: adminUserData.lastName,
          email: adminUserData.email,
          role: adminUserData.role,
          status: acctStatus,
          createdDate: formaDateStringWithPattern(
            adminUserData.createdDate,
            DEFAULT_DATETIME_FORMAT_MONTH_TEXT
          ),
          updatedDate: formaDateStringWithPattern(
            adminUserData.updatedDate,
            DEFAULT_DATETIME_FORMAT_MONTH_TEXT
          ),
        })
        csvData.push(makeCsvData())
        // Build Table Body
        return (
          <TableRow
            hover
            onClick={() => history.push(`/staff-profile/${adminUserData.id}/edit`)}
            key={`admin-user-${adminUserData.id}`}
          >
            <TableCell>
              <div className={classes.pl17}>
                {formatStringForInputText(adminUserData.firstName)}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>{formatStringForInputText(adminUserData.lastName)}</div>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>{formatStringForInputText(adminUserData.email)}</div>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>
                {getAdminUserRoleLabel(adminUserData.role.toLowerCase(), t)}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>
                {!adminUserData.isActive ? (
                  <Chip size="small" label={t('user.disabled')} className={classes.chipRed} />
                ) : (
                  <Chip size="small" label={t('user.enabled')} className={classes.chipGreen} />
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>
                {formaDateStringWithPattern(
                  adminUserData.createdDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>
                {formaDateStringWithPattern(
                  adminUserData.updatedDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              </div>
            </TableCell>
          </TableRow>
        )
      })) ||
    []
  const isNoData = usersData.length > 0
  const generateDataToTable = () => {
    if (isNoData) {
      return <TableBody>{usersData}</TableBody>
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
    if (adminUsersData?.data.pagination) {
      setPage(adminUsersData.data.pagination.page)
      setPageSize(adminUsersData.data.pagination.size)
      setPages(adminUsersData.data.pagination.totalPage)
    }
  }, [adminUsersData, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [userFilter, pages, page, pageSize, refetch])
  const handleOnSearchFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isKeywordAccepted = validateKeywordText(value)
    const isKeywordUUIDAccepted = validateKeywordUUID(value)
    setFilterSearchField(value)
    setFilterSearchFieldError('')
    if (
      formik.values.searchType !== 'id' &&
      formik.values.searchType !== 'role' &&
      isKeywordAccepted &&
      value.length >= conditionConfigs.minimumToFilterPlateNumber
    ) {
      setFilterSearchField(value)
      timeOutSearch()
    } else if (
      value !== '' &&
      formik.values.searchType !== 'id' &&
      formik.values.searchType !== 'role'
    ) {
      setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidFormat'))
    } else if (formik.values.searchType === 'id') {
      if (isKeywordUUIDAccepted) {
        timeOutSearch()
      } else {
        setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidUUIDFormat'))
      }
    } else {
      timeOutSearch()
    }
  }
  const handleClear = () => {
    setFilterSearchField('')
    setFilterSearchFieldError('')
    formik.setFieldValue('searchType', '')
    formik.handleSubmit()
  }
  const conditionConfigs = {
    minimumToFilterPlateNumber: 2,
  }
  function timeOutSearch() {
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current)
    }
    timeoutIdRef.current = window.setTimeout(() => {
      formik.handleSubmit()
    }, 800)
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.staffProfile')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('staffProfile.staffList')}
          </Typography>
        </ContentSection>
        <Fragment>
          <GridSearchSection container spacing={1}>
            <Grid item xs={9} sm={3}>
              <TextField
                disabled={isFetchingActivities}
                className={classes.hideObject}
                fullWidth
                select
                label={t('carAvailability.search')}
                id="staff_profile__criteria_select"
                value={formik.values.searchType}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {formik.values.searchType && (
                        <CloseOutlined
                          className={classes.paddingRigthBtnClear}
                          onClick={handleClear}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
                onChange={(event) => {
                  formik.setFieldValue('searchType', event.target.value)
                }}
              >
                <MenuItem value="id">{t('user.id')}</MenuItem>
                <MenuItem value="firstName">{t('user.firstName')}</MenuItem>
                <MenuItem value="lastName">{t('user.lastName')}</MenuItem>
                <MenuItem value="email">{t('user.email')}</MenuItem>
                <MenuItem value="role">{t('user.role')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={9} sm={3}>
              <TextField
                // className={formik.values.searchType === 'role' ? classes.hideObject : ' '}
                className={classes.hideObject}
                id="staff_profile__search_input"
                name="searchVal"
                value={filterSearchField}
                placeholder={t('carAvailability.searchField.label')}
                onChange={handleOnSearchFieldChange}
                error={!!filterSearchFieldError}
                helperText={filterSearchFieldError}
                variant="outlined"
                disabled={formik.values.searchType === ''}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color={formik.values.searchType === '' ? 'disabled' : 'action'} />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                className={formik.values.searchType === 'role' ? '' : classes.hideObject}
                id="staff_profile__search_role_select"
                select
                value={filterSearchField}
                label={t('user.role')}
                placeholder={t('carAvailability.searchField.label')}
                onChange={handleOnSearchFieldChange}
                error={!!filterSearchFieldError}
                helperText={filterSearchFieldError}
                variant="outlined"
                fullWidth
              >
                {roleList?.map((option) => (
                  <MenuItem key={option.key} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={9} sm={3} />
            <Grid item xs={9} sm={3} className={classes.gridExport}>
              <Button
                id="staff_profile__export_btn"
                className={classes.addButton}
                color="primary"
                variant="contained"
              >
                <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename="EVme Admin Dashboard.csv"
                  className={classes.buttonExport}
                >
                  {t('button.export').toUpperCase()}
                </CSVLink>
              </Button>
              &nbsp;&nbsp;
              <Button
                id="staff_profile__add_btn"
                endIcon={<AddIcon />}
                className={classes.addButton}
                variant="contained"
                onClick={() => history.push(`/staff-profile/create`)}
              >
                {t('button.create').toUpperCase()}
              </Button>
            </Grid>
          </GridSearchSection>
          <GridSearchSection container>
            <Grid item xs={12}>
              <TableContainer component={Paper} className={classes.table}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                          {t('staffProfile.firstName')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                          {t('staffProfile.lastName')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                          {t('user.email')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className={[classes.textBoldBorder, classes.width145].join(' ')}>
                          {t('user.role')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                          {t('user.status')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                          {t('staffProfile.createdDate')}
                        </div>
                      </TableCell>
                      <TableCell align="left">
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
            </Grid>
          </GridSearchSection>
          <GridSearchSection container>
            <Grid item xs={12}>
              <div className={classes.paginationContrainer}>
                {t('table.rowPerPage')}:&nbsp;
                <FormControl className={classes.inlineElement}>
                  <Select
                    value={adminUsersData?.data.pagination?.size || pageSize}
                    defaultValue={adminUsersData?.data.pagination?.size || pageSize}
                    onChange={(event) => {
                      setPage(1)
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
                &nbsp;&nbsp;{adminUsersData?.data.pagination?.page || pages} {t('staffProfile.of')}
                &nbsp;
                {adminUsersData?.data.pagination?.totalPage || pages}
                <Pagination
                  count={adminUsersData?.data.pagination?.totalPage || pages}
                  page={adminUsersData?.data.pagination?.page || page}
                  defaultPage={adminUsersData?.data.pagination?.page || page}
                  variant="text"
                  shape="rounded"
                  onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value)
                  }}
                />
              </div>
            </Grid>
          </GridSearchSection>
        </Fragment>
      </Wrapper>
    </Page>
  )
}
