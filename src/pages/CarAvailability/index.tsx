import { useState, useEffect, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import {
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_BFF,
  FieldKeyOparators,
  validateKeywordText,
} from 'utils'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { CloseOutlined, Search as SearchIcon } from '@mui/icons-material'
import { useFormik } from 'formik'
import Pagination from '@mui/lab/Pagination'
import { useHistory } from 'react-router-dom'
import { getAvailableListBFF } from 'services/web-bff/car'
import { CarAvailableListFilterRequest } from 'services/web-bff/car.type'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getSearchTypeList, getSearcLocationList } from './utils'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()
const initSelectedToDate = dayjs().tz(config.timezone).endOf('day').toDate()

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const GridSearchSection = styled(Grid)`
  padding-top: 20px;
  display: flex;
  align-items: left;
`
const GridSearchSectionItem = styled(Grid)`
  height: 90px;
`

const useStyles = makeStyles(() => ({
  searchBar: {
    '& .MuiOutlinedInput-input': { padding: '16px 12px' },
    '& .MuiIconButton-root': { padding: '2px 2px' },
  },
  buttonWithoutShadow: {
    fontWeight: 'bold',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
  },
  buttonWithoutExport: {
    backgroundColor: '#424E63',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
  },
  buttonExport: {
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  exportContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  paginationContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  paddindElement: {
    marginLeft: '8px',
  },
  chipBgGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '16px',
  },
  chipBgPrimary: {
    backgroundColor: '#4584FF',
    color: 'white',
    borderRadius: '16px',
  },
  table: {
    width: '100%',
  },
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
    paddingLeft: '4px',
  },
  rowOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  setWidth: {
    width: '80px',
  },
  setWidthBookingId: {
    width: '130px',
  },
  hideObject: {
    display: 'none',
  },
  paddingRigthBtnClear: {
    marginLeft: '-40px',
    cursor: 'pointer',
    padding: '4px 4px',
  },
}))

export default function CarAvailability(): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()
  const classes = useStyles()
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [selectedToDate, setSelectedToDate] = useState(initSelectedToDate)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)
  const [showPage, setShowPage] = useState(true)
  const searchTypeList = getSearchTypeList(t)
  const searchLocationList = getSearcLocationList(t)
  const [filterSearchField, setFilterSearchField] = useState<string>('')
  const [filterSearchFieldError, setFilterSearchFieldError] = useState<string>('')

  const generateFilterDates = () => {
    return {
      startDate: dayjs(selectedFromDate).startOf('day').format(DEFAULT_DATE_FORMAT_BFF),
      endDate: dayjs(selectedToDate).endOf('day').format(DEFAULT_DATE_FORMAT_BFF),
    }
  }

  const [filter, setFilter] = useState<CarAvailableListFilterRequest>(generateFilterDates())
  const {
    data: carData,
    refetch,
    isFetching,
  } = useQuery('availability-cars', () =>
    getAvailableListBFF({
      filter,
      page,
      size: pageSize,
    })
  )

  useEffect(() => {
    refetch()
    setShowPage(false)
  }, [filter, page, pageSize, refetch])
  useEffect(() => {
    if (selectedFromDate > selectedToDate) {
      setSelectedToDate(selectedFromDate)
    }
  }, [selectedFromDate, selectedToDate])
  const rows =
    carData?.data.records.map(({ car, availabilityStatus: status, booking }) => {
      return {
        id: car.id,
        vin: car.vin,
        carTrackId: car.carTrackId || '-',
        createdDate: car.createdDate,
        updatedDate: car.updatedDate || '-',
        plateNumber: car.plateNumber,
        model: car.carSku?.carModel.name || '-',
        brand: car.carSku?.carModel.brand.name || '-',
        color: car.carSku?.color || '-',
        status,
        subscriptionId: booking?.length > 0 ? booking.map((row) => row.id) : '-',
        location: car.location || '-',
        owner: car.owner || '-',
        reSeller: car.reSeller || '-',
      }
    }) || []

  const formik = useFormik({
    initialValues: {
      input: '',
      searchType: '',
      searchLocation: 'all location',
    },
    enableReinitialize: true,

    onSubmit: (value) => {
      const isId = value.searchType === 'id'
      let keyOfValue = ''
      let updateObj

      if (value.searchType === '') {
        filter.carId = undefined
        filter.plateNumberContain = undefined
        filter.plateNumberEqual = undefined
        updateObj = {
          ...filter,
          ...generateFilterDates(),
        } as CarAvailableListFilterRequest
      } else {
        if (isId) {
          keyOfValue = 'carId'
        } else {
          keyOfValue = `${value.searchType}${FieldKeyOparators.contains}`
        }
        updateObj = {
          [keyOfValue]: filterSearchField,
          ...generateFilterDates(),
        } as CarAvailableListFilterRequest
      }
      setFilter(updateObj)
      setPage(0)
    },
  })
  const conditionConfigs = {
    minimumToFilterPlateNumber: 2,
  }
  const handleOnSearchFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isKeywordAccepted = validateKeywordText(value)
    setFilterSearchField(value)
    setFilterSearchFieldError('')
    if (isKeywordAccepted && value.length >= conditionConfigs.minimumToFilterPlateNumber) {
      setFilterSearchField(value)
    } else if (value !== '') {
      setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidFormat'))
    } else {
      setFilterSearchField('')
    }
    if (formik.values.searchType === 'id') {
      setFilterSearchFieldError('')
    }
  }

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.carManagement.carAvailability'),
      link: '/car-availability',
    },
  ]

  const csvHeaders = [
    { label: t('carAvailabilityDetail.location'), key: 'location' },
    { label: t('carAvailabilityDetail.carId'), key: 'id' },
    { label: t('carAvailabilityDetail.carStatus'), key: 'status' },
    { label: t('carAvailabilityDetail.carTrackId'), key: 'carTrackId' },
    { label: t('carAvailabilityDetail.plateNumber'), key: 'plateNumber' },
    { label: t('carAvailabilityDetail.carBrand'), key: 'brand' },
    { label: t('carAvailabilityDetail.carModel'), key: 'model' },
    { label: t('carAvailabilityDetail.color'), key: 'color' },
    { label: t('carAvailabilityDetail.vin'), key: 'vin' },
    { label: t('carAvailabilityDetail.bookingId'), key: 'subscriptionId' },
    { label: t('carAvailabilityDetail.owner'), key: 'owner' },
    { label: t('carAvailabilityDetail.reSeller'), key: 'reSeller' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  rows.forEach((data) => {
    const makeData = () => ({
      id: data.id,
      vin: data.vin,
      carTrackId: data.carTrackId,
      createdDate: data.createdDate,
      updatedDate: data.updatedDate,
      plateNumber: data.plateNumber,
      model: data.model,
      brand: data.brand,
      color: data.color,
      status: data.status,
      subscriptionId: data.subscriptionId,
      location: data.location,
      owner: data.owner,
      reSeller: data.reSeller,
    })
    csvData.push(makeData())
  })
  const carAvailabilityRowData =
    (rows &&
      rows.length > 0 &&
      rows.map((row) => {
        return (
          <TableRow
            hover
            onClick={() =>
              history.push({
                pathname: `/car-availability/${row.id}`,
                state: row,
              })
            }
            key={`car-availability-${row.id}`}
          >
            <TableCell>
              <div className={[classes.rowOverflow, classes.paddindElement].join(' ')}>
                {row.location}
              </div>
            </TableCell>
            <TableCell>
              <div
                className={[classes.rowOverflow, classes.setWidth, classes.paddindElement].join(
                  ' '
                )}
              >
                {row.brand}
              </div>
            </TableCell>
            <TableCell>
              <div
                className={[classes.rowOverflow, classes.setWidth, classes.paddindElement].join(
                  ' '
                )}
              >
                {row.model}
              </div>
            </TableCell>
            <TableCell>
              <div
                className={[classes.rowOverflow, classes.setWidth, classes.paddindElement].join(
                  ' '
                )}
              >
                {row.color}
              </div>
            </TableCell>
            <TableCell>
              <div
                className={[classes.rowOverflow, classes.setWidth, classes.paddindElement].join(
                  ' '
                )}
              >
                {row.plateNumber}
              </div>
            </TableCell>
            <TableCell className={classes.setWidth} align="center">
              <div>
                <Chip
                  label={row.status}
                  className={
                    String(row.status).toLowerCase() === 'available'
                      ? classes.chipBgGreen
                      : classes.chipBgPrimary
                  }
                />
              </div>
            </TableCell>
            <TableCell>
              <div className={[classes.rowOverflow, classes.setWidthBookingId].join(' ')}>
                {row.subscriptionId}
              </div>
            </TableCell>
            <TableCell>
              <div className={[classes.rowOverflow, classes.paddindElement].join(' ')}>
                {row.owner}
              </div>
            </TableCell>
            <TableCell>
              <div className={[classes.rowOverflow, classes.paddindElement].join(' ')}>
                {row.reSeller}
              </div>
            </TableCell>
          </TableRow>
        )
      })) ||
    []
  const handleClear = () => {
    formik.setFieldValue('searchType', '')
    setFilterSearchField('')
    setFilterSearchFieldError('')
    formik.handleSubmit()
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.carAvailability')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          {showPage ? (
            <Box>
              <Typography variant="h6" component="h2">
                {t('sidebar.carAvailabilityList')}
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" component="h2">
                {t('sidebar.carAvailabilityList')}
              </Typography>
              <GridSearchSection className={classes.searchBar} container spacing={1}>
                <GridSearchSectionItem item xs={1.8}>
                  <TextField
                    fullWidth
                    select
                    label={t('carAvailability.search')}
                    variant="outlined"
                    id="car_availability__searchtype_input"
                    value={formik.values.searchType}
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
                      setFilterSearchField('')
                      setFilterSearchFieldError('')
                    }}
                  >
                    {searchTypeList?.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridSearchSectionItem>
                <GridSearchSectionItem item xs={2.2}>
                  <TextField
                    disabled={formik.values.searchType === ''}
                    fullWidth
                    error={!!filterSearchFieldError}
                    helperText={filterSearchFieldError}
                    variant="outlined"
                    id="car_availability__searchField_input"
                    placeholder={t('carAvailability.searchField.label')}
                    value={filterSearchField}
                    onChange={handleOnSearchFieldChange}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        formik.handleSubmit()
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            color={formik.values.searchType === '' ? 'disabled' : 'action'}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </GridSearchSectionItem>
                <GridSearchSectionItem item xs={2.5}>
                  <DatePicker
                    fullWidth
                    label={t('carAvailability.selectedFromDate')}
                    id="car_availability__startdate_input"
                    KeyboardButtonProps={{
                      id: 'car_availability__startdate_icon',
                    }}
                    name="selectedFromDate"
                    format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
                    value={selectedFromDate}
                    onChange={(date) => {
                      date && setSelectedFromDate(date.toDate())
                    }}
                    inputVariant="outlined"
                  />
                </GridSearchSectionItem>
                <GridSearchSectionItem item xs={2.5}>
                  <DatePicker
                    fullWidth
                    label={t('carAvailability.selectedToDate')}
                    id="car_availability__enddate_input"
                    minDate={selectedFromDate}
                    KeyboardButtonProps={{
                      id: 'car_availability__enddate_icon',
                    }}
                    name="selectedToDate"
                    format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
                    value={selectedToDate}
                    onChange={(date) => {
                      date && setSelectedToDate(date.toDate())
                    }}
                    inputVariant="outlined"
                  />
                </GridSearchSectionItem>
                {/* <GridSearchSectionItem item xs={1}>
                  <Button
                    fullWidth
                    id="car_availability__search_btn"
                    className={classes.buttonWithoutShadow}
                    color="primary"
                    variant="contained"
                    onClick={() => formik.handleSubmit()}
                    disabled={isFetching}
                  >
                    {t('carAvailability.searchBtn')}
                  </Button>
                </GridSearchSectionItem> */}
                <GridSearchSectionItem item xs={2}>
                  <TextField
                    fullWidth
                    select
                    label={t('carAvailability.searchLocation')}
                    variant="outlined"
                    id="car_availability__searchlocatio_input"
                    value={formik.values.searchLocation}
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
                      formik.setFieldValue('searchLocation', event.target.value)
                    }}
                  >
                    {searchLocationList?.map((option) => (
                      <MenuItem key={option.key} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </GridSearchSectionItem>
                <GridSearchSectionItem item xs={1}>
                  <Button
                    fullWidth
                    id="car_availability__export_btn"
                    className={classes.buttonWithoutExport}
                    variant="contained"
                    disabled={isFetching}
                  >
                    <CSVLink
                      data={csvData}
                      headers={csvHeaders}
                      filename={t('sidebar.carAvailability') + '.csv'}
                      className={classes.buttonExport}
                    >
                      {t('carAvailability.export')}
                    </CSVLink>
                  </Button>
                </GridSearchSectionItem>
              </GridSearchSection>

              <Fragment>
                <TableContainer component={Paper} className={classes.table}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.location')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.carBrand')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.carModel')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={[classes.textBoldBorder, classes.setWidth].join(' ')}>
                            {t('carAvailabilityDetail.color')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.plateNumber')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={[classes.textBoldBorder, classes.setWidth].join(' ')}>
                            {t('carAvailabilityDetail.carStatus')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.bookingId')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.owner')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={classes.textBoldBorder}>
                            {t('carAvailabilityDetail.reSeller')}
                          </div>
                        </TableCell>
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
                      <TableBody>{carAvailabilityRowData}</TableBody>
                    )}
                  </Table>
                </TableContainer>
                <Card>
                  <div className={classes.paginationContrainer}>
                    Rows per page:&nbsp;
                    <FormControl variant="standard" className={classes.inlineElement}>
                      <Select
                        value={carData?.data?.pagination?.size || pageSize}
                        defaultValue={carData?.data?.pagination?.size || pageSize}
                        onChange={(event) => {
                          setPage(0)
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
                    &nbsp;&nbsp;{carData?.data.pagination?.page} {t('staffProfile.of')}
                    &nbsp;
                    {carData?.data.pagination?.totalPage}
                    <Pagination
                      count={carData?.data?.pagination?.totalPage}
                      page={carData?.data?.pagination?.page || page}
                      defaultPage={carData?.data?.pagination?.page || page}
                      variant="text"
                      color="primary"
                      onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                        setPage(value - 1)
                      }}
                    />
                  </div>
                </Card>
              </Fragment>
            </Box>
          )}
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
