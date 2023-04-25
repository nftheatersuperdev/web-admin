import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import {
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_BFF,
  validateKeywordText,
  validateKeywordUUID,
} from 'utils'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import './pagination.css'
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
} from '@mui/material'
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
import { CarOwnerResponse } from 'services/web-bff/car-owner.type'
import { ReSellerResponse } from 'services/web-bff/re-seller-area.type'
import { LocationResponse } from 'services/web-bff/location.type'
import { getCarOwnerList } from 'services/web-bff/car-owner'
import { getReSellerList } from 'services/web-bff/re-seller-area'
import { getLocationList } from 'services/web-bff/location'
import { useStyles } from './styles'
import { getSearchTypeList } from './utils'

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
  padding-top: 20px !important;
  align-items: left !important;
  min-height: 100px !important;
`
const ButtonExport = styled(Button)`
  background-color: #424e63 !important;
  padding: 14px 12px !important;
  color: white;
`
const CsvButton = styled(CSVLink)`
  color: white !important;
  font-weight: bold !important;
  text-decoration: none !important;
`

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
  const [filterSearchField, setFilterSearchField] = useState<string>('')
  const [filterSearchFieldError, setFilterSearchFieldError] = useState<string>('')
  const timeoutIdRef = useRef<number | null>(null)
  const [ownerData, setOwnerData] = useState<CarOwnerResponse | null>()
  const [reSellerData, setReSellerData] = useState<ReSellerResponse | null>()
  const [locationData, setLocationData] = useState<LocationResponse | null>()

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
  const {
    data: carOwners,
    isFetched: isFetchedOwners,
    isFetching: isFetchingOwners,
  } = useQuery('get-car-owner', () => getCarOwnerList())

  const {
    data: carResellers,
    isFetched: isFetchedResellers,
    isFetching: isFetchingResellers,
  } = useQuery('get-car-reseller', () => getReSellerList())

  const {
    data: loactions,
    isFetched: isFetchedLoactions,
    isFetching: isFetchingLoactions,
  } = useQuery('get-location', () => getLocationList())

  useEffect(() => {
    refetch()
    setShowPage(false)
  }, [filter, page, pageSize, refetch])

  useEffect(() => {
    if (selectedFromDate > selectedToDate) {
      setSelectedToDate(selectedFromDate)
    }
    if (isFetchedOwners && carOwners) {
      setOwnerData(carOwners)
    }
    if (isFetchedResellers && carResellers) {
      setReSellerData(carResellers)
    }
    if (isFetchedLoactions && loactions) {
      setLocationData(loactions)
    }
  }, [
    selectedFromDate,
    selectedToDate,
    carOwners,
    isFetchedOwners,
    carResellers,
    isFetchedResellers,
    isFetchedLoactions,
    loactions,
  ])

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
      selectLocation: 'all',
      selectOwner: 'all',
      selectReSeller: 'all',
    },
    enableReinitialize: true,

    onSubmit: (value) => {
      let updateObj
      const searchField = filterSearchField

      if (value.searchType === '' && value.selectLocation === 'all') {
        filter.carId = undefined
        filter.plateNumberContain = undefined
        filter.plateNumberEqual = undefined
        filter.ownerProfileId = undefined
        filter.resellerServiceAreaId = undefined
        updateObj = {
          ...filter,
          ...generateFilterDates(),
        } as CarAvailableListFilterRequest
      } else {
        if (value.searchType === 'plateNumber') {
          filter.plateNumberContain = searchField
          localStorage.setItem(filter.plateNumberContain, searchField)
        }
        if (value.searchType === 'id') {
          filter.carId = searchField
          localStorage.setItem(filter.carId, searchField)
        }

        if (value.searchType === 'ownerProfileId' && value.selectOwner !== 'all') {
          filter.ownerProfileId = value.selectOwner
          localStorage.setItem(filter.ownerProfileId, value.selectOwner)
        }
        if (value.searchType === 'resellerServiceAreaId' && value.selectReSeller !== 'all') {
          filter.resellerServiceAreaId = value.selectReSeller
          localStorage.setItem(filter.resellerServiceAreaId, value.selectReSeller)
        }
        if (value.selectLocation !== 'all') {
          filter.resellerServiceAreaId = value.selectLocation
          localStorage.setItem('location', value.selectReSeller)
        }
        updateObj = {
          ...filter,
          ...generateFilterDates(),
        } as CarAvailableListFilterRequest
      }

      setFilter(updateObj)
      setPage(0)
    },
  })

  const handleClear = () => {
    setFilterSearchField('')
    setFilterSearchFieldError('')
    formik.setFieldValue('searchType', '')
    formik.setFieldValue('selectLocation', 'all')
    formik.setFieldValue('selectOwner', 'all')
    formik.setFieldValue('selectReSeller', 'all')
    formik.handleSubmit()
  }

  const handleOnSearchFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isKeywordAccepted = validateKeywordText(value)
    const isKeywordUUIDAccepted = validateKeywordUUID(value)
    setFilterSearchField(value)
    setFilterSearchFieldError('')
    if (
      formik.values.searchType === 'plateNumber' &&
      isKeywordAccepted &&
      value.length >= conditionConfigs.minimumToFilterPlateNumber
    ) {
      setFilterSearchField(value)
      timeOutSearch()
    } else if (value !== '' && formik.values.searchType === 'plateNumber') {
      setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidFormat'))
    } else {
      if (isKeywordUUIDAccepted) {
        timeOutSearch()
      } else {
        if (formik.values.searchType === 'carId') {
          setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidUUIDFormat'))
        }
      }
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
            <TableCell sx={{ width: '150px' }}>
              <div className={classes.rowOverflow}>{row.location}</div>
            </TableCell>
            <TableCell sx={{ width: '120px' }}>
              <div className={classes.rowOverflow}>{row.brand}</div>
            </TableCell>
            <TableCell sx={{ width: '120px' }}>
              <div className={classes.rowOverflow}>{row.model}</div>
            </TableCell>
            <TableCell sx={{ width: '100px' }}>
              <div className={classes.rowOverflow}>{row.color}</div>
            </TableCell>
            <TableCell sx={{ width: '130px' }}>
              <div className={classes.rowOverflow}>{row.plateNumber}</div>
            </TableCell>
            <TableCell sx={{ width: '120px' }} align="center">
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
            <TableCell sx={{ width: '170px' }}>
              <div className={classes.rowOverflow}>{row.subscriptionId}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflow}>{row.owner}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflow}>{row.reSeller}</div>
            </TableCell>
          </TableRow>
        )
      })) ||
    []

  const isNoData = carAvailabilityRowData.length > 0
  const generateDataToTable = () => {
    if (isNoData) {
      return carAvailabilityRowData
    }
    return (
      <TableRow>
        <TableCell colSpan={9}>
          <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
        </TableCell>
      </TableRow>
    )
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.carAvailability')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          {showPage ? (
            <Typography variant="h6" component="h2">
              {t('sidebar.carAvailabilityList')}
            </Typography>
          ) : (
            <div>
              <Typography variant="h6" component="h2">
                {t('sidebar.carAvailabilityList')}
              </Typography>
              <GridSearchSection direction="row" justifyContent="flex-start" container spacing={1}>
                <Grid item xs={1.8}>
                  <TextField
                    disabled={isFetching}
                    fullWidth
                    select
                    label={t('carAvailability.search')}
                    variant="outlined"
                    id="car_availability__searchtype_input"
                    value={formik.values.searchType}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {formik.values.searchType && !isFetching && (
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
                </Grid>
                <Grid item xs={2.2}>
                  <TextField
                    className={
                      formik.values.searchType === 'ownerProfileId' ||
                      formik.values.searchType === 'resellerServiceAreaId'
                        ? classes.hidenField
                        : ''
                    }
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
                      if (
                        !filterSearchFieldError &&
                        filterSearchField !== '' &&
                        event.key === 'Enter'
                      ) {
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
                  <TextField
                    className={
                      formik.values.searchType === 'ownerProfileId' ? '' : classes.hidenField
                    }
                    disabled={isFetchingOwners}
                    fullWidth
                    select
                    variant="outlined"
                    id="car_availability__searchOwner_input"
                    value={formik.values.selectOwner}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {formik.values.selectOwner !== 'all' && !isFetching && (
                            <CloseOutlined
                              className={classes.paddingRigthBtnClear}
                              onClick={handleClear}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      formik.setFieldValue('selectOwner', event.target.value)
                      formik.handleSubmit()
                    }}
                  >
                    <MenuItem className={classes.hidenField} key="all" value="all">
                      {t('carAvailability.defultSelect.allOwner')}
                    </MenuItem>
                    {ownerData?.owners.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    className={
                      formik.values.searchType === 'resellerServiceAreaId' ? '' : classes.hidenField
                    }
                    disabled={isFetchingResellers}
                    fullWidth
                    select
                    variant="outlined"
                    id="car_availability__searchReSeller_input"
                    value={formik.values.selectReSeller}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {formik.values.selectReSeller !== 'all' && !isFetching && (
                            <CloseOutlined
                              className={classes.paddingRigthBtnClear}
                              onClick={handleClear}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      formik.setFieldValue('selectReSeller', event.target.value)
                      formik.handleSubmit()
                    }}
                  >
                    <MenuItem className={classes.hidenField} key="all" value="all">
                      {t('carAvailability.defultSelect.allReSeller')}
                    </MenuItem>
                    {reSellerData?.resellers.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid className={classes.searchBar} item xs={2.5}>
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
                      formik.handleSubmit()
                    }}
                    inputVariant="outlined"
                  />
                </Grid>
                <Grid className={classes.searchBar} item xs={2.5}>
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
                      formik.handleSubmit()
                    }}
                    inputVariant="outlined"
                  />
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    disabled={isFetchingLoactions}
                    fullWidth
                    select
                    label={t('carAvailability.searchLocation')}
                    variant="outlined"
                    id="car_availability__searchlocation_input"
                    value={formik.values.selectLocation}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {formik.values.selectLocation !== 'all' && !isFetching && (
                            <CloseOutlined
                              className={classes.paddingRigthBtnClear}
                              onClick={handleClear}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                    onChange={(event) => {
                      formik.setFieldValue('selectLocation', event.target.value)
                      formik.handleSubmit()
                    }}
                  >
                    <MenuItem className={classes.hidenField} key="all" value="all">
                      {t('carAvailability.defultSelect.allLocation')}
                    </MenuItem>
                    {locationData?.locations.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.areaNameEn}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={1}>
                  <ButtonExport
                    fullWidth
                    variant="contained"
                    disabled={isFetching}
                    id="car_availability__export_btn"
                  >
                    <CsvButton
                      data={csvData}
                      headers={csvHeaders}
                      filename={t('sidebar.carAvailability') + '.csv'}
                    >
                      {t('carAvailability.export')}
                    </CsvButton>
                  </ButtonExport>
                </Grid>
              </GridSearchSection>

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
                    <TableBody>{generateDataToTable()}</TableBody>
                  )}
                </Table>
              </TableContainer>
              <Grid container>
                <Grid item xs={12}>
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
                </Grid>
              </Grid>
            </div>
          )}
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
