import {
  Breadcrumbs,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { CSVLink } from 'react-csv'
import { useEffect, useState } from 'react'
import config from 'config'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  formatDate,
} from 'utils'
import dayjs, { Dayjs } from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Search } from '@material-ui/icons'
import { useFormik } from 'formik'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { ROLES } from 'auth/roles'
import { Page } from 'layout/LayoutRoute'
import PageTitleWithoutLine from 'components/PageTitleWithoutLine'
import { getLeadFormSubmittion } from 'services/web-bff/lead-management-detail'

interface ColumnTable {
  label: string
  key: string
}

interface Row {
  [key: string]: any
}

export interface LeadManagementDetailStateParams {
  leadFormId: string
  leadName: string
  createdDate: string
}

export interface LeadFormSubmittionCSV {
  no: string
  leadName: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  leadSource: string
  interesting: string
  timeline: string
  registeredDate: string
  customerStatus: string
}

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)
// const initSelectedFromDate = dayjs().tz(config.timezone).toDate()

const DividerCustom = styled(Divider)`
  margin: 10px 0;
`
const useStyles = makeStyles({
  breadcrumText: {
    color: '#000000DE',
  },
  cardCanvas: {
    marginBottom: '20px',
  },
  headerTopic: {
    padding: '8px 16px',
  },
  headerTopicText: {
    fontSize: '20px',
  },
  fixedSearchBar: {
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 25px',
  },
  filter: {
    height: '90px',
  },
  paddingLeft: {
    paddingLeft: '16px',
  },
  searchTextField: {
    width: '100%',
  },
  searchBar: {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'left',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  exportButton: {
    fontWeight: 'bold',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
    color: '#fff',
    backgroundColor: '#424E63',
  },
  noUnderLine: {
    color: 'white',
    textDecoration: 'none',
  },
  rightPanel: {
    textAlign: 'right',
  },
  table: {
    width: '100%',
  },
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
  },
  width50: {
    paddingLeft: '5px',
    width: '50px',
  },
  width120: {
    paddingLeft: '5px',
    width: '120px',
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
  inlineElement: {
    display: 'inline-flex',
  },
  buttonWithoutShadow: {
    fontWeight: 'bold',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
  },
  hideObject: {
    display: 'none',
  },
  chipBlue: {
    backgroundColor: '#4584FF',
    color: 'white',
    borderRadius: '64px',
  },
  dialogExport: {
    '& .MuiDialog-container': {
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  dialogExportContainer: {
    padding: '10px 0px',
  },
  dialogExportDatePicker: {
    width: '100%',
    margin: '10px 0px 5px 0px',
  },
  dialogExportBtn: {
    margin: '10px 0px 0px 0px',
  },
  boxNoData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '100px',
    marginBottom: '100px',
  },
  iconNoData: {
    fontSize: 50,
    color: '#BDBDBD',
  },
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function LeadManagementDetail() {
  const { t } = useTranslation()
  const classes = useStyles()
  const location = useLocation()
  const { id } = useParams<{ id: string }>()
  const { getRole } = useAuth()
  const currentUserRole = getRole()

  const [filterCreateDate, setFilterCreateDate] = useState<Dayjs | null>(null)
  const [filterEndDate, setFilterEndDate] = useState<Dayjs | null>(null)
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  const [openDialogExport, setOpenDialogExport] = useState<boolean>(false)
  const [orderBy, setOrderBy] = useState<string>('createdDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const myParam: LeadManagementDetailStateParams = location.state as LeadManagementDetailStateParams

  const isColumnChip: string[] = ['interesting', 'timeline']
  const isRoleCanExport: boolean =
    currentUserRole === ROLES.SUPER_ADMIN || currentUserRole === ROLES.OPERATION

  const fileName = `Lead Form ${myParam.leadName}.csv`

  const csvData: LeadFormSubmittionCSV[] = []

  const headerTableLeadFormSubmittion: ColumnTable[] = [
    { label: 'No', key: 'no' },
    { label: 'First name', key: 'firstName' },
    { label: 'Last name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone number', key: 'phoneNumber' },
    { label: 'Lead Source', key: 'leadSource' },
    { label: 'Interesting', key: 'interesting' },
    { label: 'Timeline', key: 'timeline' },
    { label: 'Registered Date', key: 'createdDate' },
  ]

  const headerTableCSV: ColumnTable[] = [
    { label: 'No', key: 'no' },
    { label: 'Lead Name', key: 'leadName' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Email', key: 'email' },
    { label: 'Lead Source', key: 'leadSource' },
    { label: 'Interesting', key: 'interesting' },
    { label: 'Timeline', key: 'timeline' },
    { label: 'Registered Date', key: 'registeredDate' },
    { label: 'Customer Status', key: 'customerStatus' },
  ]

  const formik = useFormik({
    initialValues: {
      searchType: '',
      searchValue: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      setPage(1)
      console.log(value)
    },
  })

  const handleSort = (key: string) => {
    const newOrderBy = key
    let newSortOrder: 'asc' | 'desc' = 'asc'

    if (orderBy === newOrderBy && sortOrder === 'asc') {
      newSortOrder = 'desc'
    } else {
      newSortOrder = 'asc'
    }
    setOrderBy(newOrderBy)
    setSortOrder(newSortOrder)
  }

  const {
    data: leadData,
    refetch,
    isFetching,
  } = useQuery('leadFormSubmittion', () =>
    getLeadFormSubmittion({
      sortBy: 'createdDate',
      sortDirection: sortOrder.toLocaleUpperCase(),
      leadFormId: id,
      page,
      size: pageSize,
    })
  )

  //   const sortedRows = [...leadData!.data.leadFormSubmissions].sort((a: Row, b: Row) => {
  //     const sortOrderMultiplier = sortOrder === 'desc' ? -1 : 1
  //     const compareResult = a[orderBy] > b[orderBy] ? -1 : 1
  //     return compareResult * sortOrderMultiplier
  //   })

  useEffect(() => {
    console.log('sortOrder : ' + sortOrder)
    console.log('orderBy : ' + orderBy)
    refetch()
  }, [refetch, pageSize, sortOrder, orderBy, currentUserRole])

  return (
    <Page>
      <PageTitleWithoutLine title={t('sidebar.leadManagementDetail')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.leadManagement')}</Typography>
        <Typography className={classes.breadcrumText}>{t('leadManagementDetail.title')}</Typography>
      </Breadcrumbs>
      <br />
      <DividerCustom />
      <br />
      <Card className={classes.cardCanvas}>
        <div className={classes.headerTopic}>
          <Typography className={classes.headerTopicText}>
            {t('leadManagementDetail.title')}
          </Typography>
        </div>
        <Grid className={classes.fixedSearchBar} container spacing={6}>
          <Grid item xs={6}>
            <TextField
              className={classes.searchTextField}
              fullWidth
              disabled={true}
              label={t('leadManagementDetail.description.leadName')}
              id="lead_management__select_search"
              name="fixedSelectSearch"
              value={myParam.leadName}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              className={classes.searchTextField}
              disabled={true}
              label={t('leadManagementDetail.description.createDate')}
              id="customer-profile__search_input"
              name="searchVal"
              value={formaDateStringWithPattern(
                myParam.createdDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
          </Grid>
        </Grid>
      </Card>
      <Card className={classes.cardCanvas}>
        <div className={classes.headerTopic}>
          <Typography className={classes.headerTopicText}>
            {t('leadManagementDetail.userRegisterList')}
          </Typography>
        </div>
        <Grid className={classes.searchBar} container spacing={1}>
          <Grid item className={[classes.filter, classes.paddingLeft].join(' ')} xs={4}>
            <TextField
              className={classes.searchTextField}
              fullWidth
              select
              label={t('leadManagement.searchBar.selectSearch.title')}
              id="lead_management__select_search"
              name="selectSearch"
              value={formik.values.searchType}
              variant="outlined"
              onChange={(event) => {
                formik.setFieldValue('searchType', event.target.value)
              }}
            >
              <MenuItem value=" ">
                <em />
              </MenuItem>
              <MenuItem value="firstName">{t('leadManagementDetail.filter.firstName')}</MenuItem>
              <MenuItem value="lastName">{t('leadManagementDetail.filter.lastName')}</MenuItem>
              <MenuItem value="phoneNumber">
                {t('leadManagementDetail.filter.phoneNumber')}
              </MenuItem>
              <MenuItem value="email">{t('leadManagementDetail.filter.email')}</MenuItem>
              <MenuItem value="leadSource">{t('leadManagementDetail.filter.leadSource')}</MenuItem>
              <MenuItem value="createdDate">
                {t('leadManagementDetail.filter.registeredDate')}
              </MenuItem>
              <MenuItem value="answer">{t('leadManagementDetail.filter.answer')}</MenuItem>
              <MenuItem value="period">{t('leadManagementDetail.filter.period')}</MenuItem>
            </TextField>
          </Grid>
          <Grid item className={[classes.filter, classes.paddingLeft].join(' ')} xs={4}>
            <TextField
              id="customer-profile__search_input"
              name="searchVal"
              className={classes.searchTextField}
              fullWidth
              value={formik.values.searchValue}
              placeholder={t('carAvailability.searchField.label')}
              // error={!!filterSearchFieldError}
              // helperText={filterSearchFieldError}
              disabled={formik.values.searchType === '' ? true : false}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              onChange={(event) => {
                formik.setFieldValue('searchValue', event.target.value)
              }}
            />
          </Grid>
          {/* <Grid item xs /> */}
          <Grid item className={[classes.filter, classes.rightPanel].join(' ')} xs={3}>
            <Button
              id="customer_profile__export_btn"
              className={classes.exportButton}
              color="primary"
              variant="contained"
              disabled={!isRoleCanExport}
              onClick={() => setOpenDialogExport(true)}
            >
              {t('button.export').toUpperCase()}
            </Button>
          </Grid>
        </Grid>
        {leadData?.data.leadFormSubmissions === undefined ? (
          <div className={classes.boxNoData}>
            <InboxIcon className={classes.iconNoData} />
            <p>{t('leadManagementDetail.noData')}</p>
          </div>
        ) : (
          <div>
            <TableContainer component={Paper} className={classes.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    {headerTableLeadFormSubmittion.map((column: ColumnTable) => (
                      <TableCell key={column.key} align="left">
                        {column.key === 'createdDate' ? (
                          <TableSortLabel
                            active={true}
                            direction={orderBy === column.key ? sortOrder : 'asc'}
                            onClick={() => handleSort(column.key)}
                          >
                            <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                              {column.label}
                            </div>
                          </TableSortLabel>
                        ) : (
                          <div
                            className={[
                              classes.textBoldBorder,
                              column.key === 'no' ? classes.width50 : classes.width120,
                            ].join(' ')}
                          >
                            {column.label}
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {isFetching ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {leadData?.data.leadFormSubmissions.map((row: Row) => (
                      <TableRow key={row.id}>
                        {headerTableLeadFormSubmittion.map((column: ColumnTable) =>
                          isColumnChip.includes(column.key) ? (
                            <TableCell key={column.key}>
                              <Chip
                                size="small"
                                label={row[column.key]}
                                className={classes.chipBlue}
                              />
                            </TableCell>
                          ) : column.key === 'createdDate' ? (
                            <TableCell key={column.key}>
                              {formatDate(row[column.key], DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
                            </TableCell>
                          ) : (
                            <TableCell key={column.key}>{row[column.key]}</TableCell>
                          )
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
            <Card>
              <div className={classes.paginationContrainer}>
                {t('table.rowPerPage')}:&nbsp;
                <FormControl className={classes.inlineElement}>
                  <Select
                    value={leadData?.data.pagination.size || pageSize}
                    defaultValue={leadData?.data.pagination.size || pageSize}
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
                &nbsp;&nbsp;{leadData?.data.pagination.page || pageSize} {t('staffProfile.of')}
                &nbsp;
                {leadData?.data.pagination.totalPage}
                <Pagination
                  count={leadData?.data.pagination.totalPage}
                  page={leadData?.data.pagination.page || page}
                  defaultPage={leadData?.data.pagination.page || page}
                  variant="text"
                  color="primary"
                  onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value)
                  }}
                />
              </div>
            </Card>
          </div>
        )}
      </Card>
      <Dialog
        className={classes.dialogExport}
        PaperProps={{ sx: { width: '400px' } }}
        open={openDialogExport}
        onClose={() => setOpenDialogExport(false)}
      >
        <DialogTitle>{t('leadManagementDetail.dialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('leadManagementDetail.dialog.description')}</DialogContentText>
          <Grid container className={classes.dialogExportContainer}>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className={classes.dialogExportDatePicker}
                  label={t('leadManagementDetail.dialog.selectStartDate')}
                  format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
                  value={filterCreateDate}
                  minDate={dayjs().subtract(6, 'month')}
                  maxDate={dayjs()}
                  onChange={(newValue) => setFilterCreateDate(newValue)}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className={classes.dialogExportDatePicker}
                  label={t('leadManagementDetail.dialog.selectEndDate')}
                  format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
                  value={filterEndDate}
                  minDate={dayjs().subtract(6, 'month')}
                  maxDate={dayjs()}
                  onChange={(newValue) => setFilterEndDate(newValue)}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container sx={{ marginBottom: '10px' }}>
            <Grid item xs={12} sx={{ paddingLeft: '15px', paddingRight: '15px' }}>
              <Button className={classes.dialogExportBtn} fullWidth variant="contained">
                <CSVLink
                  data={csvData}
                  headers={headerTableCSV}
                  filename={fileName}
                  className={classes.noUnderLine}
                >
                  {t('button.export').toUpperCase()}
                </CSVLink>
              </Button>
            </Grid>
            <Grid item xs={12} sx={{ paddingLeft: '15px', paddingRight: '15px' }}>
              <Button
                className={classes.dialogExportBtn}
                fullWidth
                variant="outlined"
                onClick={() => setOpenDialogExport(false)}
              >
                {t('leadManagementDetail.dialog.cancel')}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
