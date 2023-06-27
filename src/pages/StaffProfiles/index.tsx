import React, { Fragment, useState, useRef, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import {
  TableContainer,
  Typography,
  Paper,
  Table,
  TableCell,
  TableRow,
  Button,
  Grid,
  MenuItem,
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
  validateKeywordText,
  validateKeywordUUID,
} from 'utils'
import { CloseOutlined, Search as SearchIcon } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/ControlPoint'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { useFormik } from 'formik'
import { getAdminUserRoleLabel, getRoleList } from 'auth/roles'
import { searchAdminUser } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import './pagination.css'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import {
  Wrapper,
  ContentSection,
  GridSearchSection,
  DataWrapper,
  TextLineClamp,
  TextSmallLineClamp,
} from 'components/Styled'
import { AdminUserByCriteria, AdminUsersProps } from 'services/web-bff/admin-user.type'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import Paginate from 'components/Paginate'

export default function StaffProfiles(): JSX.Element {
  const useStyles = makeStyles({
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
    chipPrimary: {
      backgroundColor: '#3793FF',
      color: 'white',
      borderRadius: '64px',
      margin: '2px',
    },
    buttonExport: {
      color: 'white',
      textDecoration: 'none',
    },
    hideObject: {
      display: 'none',
    },
    table: {
      width: '100%',
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
  const headerText: TableHeaderProps[] = [
    {
      text: t('staffProfile.firstName'),
    },
    {
      text: t('staffProfile.lastName'),
    },
    {
      text: t('user.email'),
    },
    {
      text: t('user.role'),
    },
    {
      text: t('staffProfile.location'),
    },
    {
      text: t('user.status'),
    },
    {
      text: t('staffProfile.createdDate'),
    },
    {
      text: t('user.updatedDate'),
    },
  ]
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
    { label: 'Location Service', key: 'location' },
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
          location: adminUserData.resellerServiceAreas.map((item) => {
            return item.areaNameEn
          }),
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
              <DataWrapper>
                <TextLineClamp>{adminUserData.firstName}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{adminUserData.lastName}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{adminUserData.email}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextSmallLineClamp>
                  {getAdminUserRoleLabel(adminUserData.role.toLowerCase(), t)}
                </TextSmallLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <div className={classes.pl17}>
                {adminUserData?.resellerServiceAreas?.map((item) => (
                  <Chip
                    size="small"
                    key={item.id}
                    label={item.areaNameEn}
                    className={classes.chipPrimary}
                  />
                ))}
              </div>
            </TableCell>
            <TableCell width={50}>
              {!adminUserData.isActive ? (
                <Chip size="small" label={t('user.disabled')} className={classes.chipRed} />
              ) : (
                <Chip size="small" label={t('user.enabled')} className={classes.chipGreen} />
              )}
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>
                  {formaDateStringWithPattern(
                    adminUserData.createdDate,
                    DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                  )}
                </TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>
                  {formaDateStringWithPattern(
                    adminUserData.updatedDate,
                    DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                  )}
                </TextLineClamp>
              </DataWrapper>
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
                    generateDataToTable()
                  )}
                </Table>
              </TableContainer>
            </Grid>
          </GridSearchSection>
          <GridSearchSection container>
            <Grid item xs={12}>
              <Paginate
                pagination={adminUsersData?.data.pagination}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                refetch={refetch}
              />
            </Grid>
          </GridSearchSection>
        </Fragment>
      </Wrapper>
    </Page>
  )
}
