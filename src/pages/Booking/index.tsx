import { useEffect, useState, KeyboardEvent, ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { useLocation, useHistory } from 'react-router-dom'
import {
  Card,
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Pagination,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import {
  formatDate,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_BFF,
} from 'utils'
import config from 'config'
import { useAuth } from 'auth/AuthContext'
import { Page } from 'layout/LayoutRoute'
import { getList } from 'services/web-bff/booking'
import {
  SubscriptionBookingListQuery,
  SubscriptionBookingListFilters,
} from 'services/web-bff/booking.type'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import LocationSwitcher, { allLocationId } from 'components/LocationSwitcher'
import { ResellerServiceArea } from 'services/web-bff/car.type'
import { useStyles, SearchDatePicker } from './styles'
import {
  getBookingStatusOnlyUsedInBackendOptions,
  getIsExtendOptions,
  convertToDuration,
  BookingCsv,
  BookingList,
  columnFormatBookingStatus,
  SelectOption,
  Keypress,
  FilterSearch,
} from './utils'

export default function Booking(): JSX.Element {
  const { t } = useTranslation()
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.bookingManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.bookingManagement.booking'),
      link: '/booking',
    },
  ]
  const classes = useStyles()
  const history = useHistory()
  const locationParam = useLocation().search
  const { getResellerServiceAreaWithSort } = useAuth()
  const userServiceAreas = getResellerServiceAreaWithSort()
  const userServiceAreaId =
    userServiceAreas && userServiceAreas.length >= 1
      ? (userServiceAreas[0] as ResellerServiceArea).id
      : ''

  const queryString = new URLSearchParams(locationParam)
  const getDefaultReseller = () => {
    const defaultId = queryString.get('resellerServiceAreaId') || userServiceAreaId
    if (defaultId === allLocationId) {
      return null
    }
    return defaultId
  }

  const resellerId = getDefaultReseller()
  const deliveryDate = queryString.get('deliveryDate')
  const returnDate = queryString.get('returnDate')
  const status = queryString.get('status')?.split(',')

  const removeQueryParams = (keepLocation?: boolean) => {
    if (queryString.has('resellerServiceAreaId') && !keepLocation) {
      queryString.delete('resellerServiceAreaId')
    }
    if (queryString.has('deliveryDate')) {
      queryString.delete('deliveryDate')
    }
    if (queryString.has('returnDate')) {
      queryString.delete('returnDate')
    }
    if (queryString.has('status')) {
      queryString.delete('status')
    }
    history.replace({
      search: queryString.toString(),
    })
  }

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)
  const currentPage = page + 1

  const defaultQuery: SubscriptionBookingListQuery = {
    page: currentPage,
    size: pageSize,
  }

  const [query, setQuery] = useState<SubscriptionBookingListQuery>(defaultQuery)

  let defaultFilter: SubscriptionBookingListFilters = {}
  defaultFilter = resellerId
    ? { ...defaultFilter, resellerServiceAreaId: resellerId }
    : defaultFilter
  defaultFilter = deliveryDate ? { ...defaultFilter, deliveryDate } : defaultFilter
  defaultFilter = returnDate ? { ...defaultFilter, returnDate } : defaultFilter
  defaultFilter = status ? { ...defaultFilter, statusList: status } : defaultFilter
  const [filter, setFilter] = useState<SubscriptionBookingListFilters>({ ...defaultFilter })

  const {
    data: bookingData,
    refetch,
    isFetching,
  } = useQuery('booking', () => getList({ query, filters: filter }), {
    refetchOnWindowFocus: false,
  })

  const bookings =
    bookingData?.data?.bookingDetails?.map((booking) => {
      return {
        id: booking.bookingId,
        detailId: booking.id,
        customerId: booking.customer.id,
        firstName: booking.customer?.firstName || '-',
        lastName: booking.customer?.lastName || '-',
        email: booking.customer?.email || '-',
        phone: booking.customer?.phoneNumber || '-',
        location: booking.car?.resellerServiceArea?.areaNameEn || '-',
        brand: booking.car?.carSku?.carModel?.brand.name || '-',
        model: booking.car?.carSku?.carModel?.name || '-',
        plateNumber: booking.car?.plateNumber || '-',
        duration: convertToDuration(booking.rentDetail?.durationDay, t) || '-',
        status: booking.displayStatus || '-',
        startDate: booking.startDate || '-',
        endDate: booking.endDate || '-',
        price: booking.rentDetail?.chargePrice || 0,
        voucherId: booking.rentDetail?.voucherId || '-',
        voucherCode: booking.rentDetail?.voucherCode || '-',
        createdDate: booking.rentDetail?.createdDate || '-',
        updatedDate: booking.rentDetail?.updatedDate || '-',
        isExtend: booking.isExtend || false,
      }
    }) || []

  // == search ==
  const searchOptions: SelectOption[] = [
    {
      label: t('booking.search.detailId'),
      value: 'bookingDetailId',
    },
    {
      label: t('booking.search.customer'),
      value: 'customerId',
    },
    {
      label: t('booking.search.email'),
      value: 'email',
    },
    {
      label: t('booking.search.carId'),
      value: 'carId',
    },
    {
      label: t('booking.search.plateNumber'),
      value: 'plateNumber',
    },
    {
      label: t('booking.search.startDate'),
      value: 'startDate',
    },
    {
      label: t('booking.search.endDate'),
      value: 'endDate',
    },
    {
      label: t('booking.search.status'),
      value: 'statusList',
    },
    {
      label: t('booking.search.isExtend'),
      value: 'isExtend',
    },
    {
      label: t('booking.search.voucherId'),
      value: 'voucherId',
    },
    {
      label: t('booking.search.deliveryDate'),
      value: 'deliveryDate',
    },
    {
      label: t('booking.search.returnDate'),
      value: 'returnDate',
    },
  ]
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedSearch, setSelectedSearch] = useState<SelectOption | null>()
  const [selectedOptionValue, setSelectedOptionValue] = useState<SelectOption | null>()

  dayjs.extend(dayjsUtc)
  dayjs.extend(dayjsTimezone)
  const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()
  const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(initSelectedFromDate)

  const [resellerServiceAreaId, setResellerServiceAreaId] = useState<string | null>(resellerId)

  const onSetSelectedSearch = (value: SelectOption | null) => {
    if (value) {
      setSelectedSearch(value)
      setSelectedOptionValue(null)
      setSelectedFromDate(null)
      if (
        queryString.has('deliveryDate') ||
        queryString.has('returnDate') ||
        queryString.has('status')
      ) {
        removeQueryParams(true)
      }
    } else {
      if (
        queryString.has('resellerServiceAreaId') ||
        queryString.has('deliveryDate') ||
        queryString.has('returnDate') ||
        queryString.has('status')
      ) {
        removeQueryParams()
      }

      setSelectedSearch(null)
      setSelectedOptionValue(null)
      setSelectedFromDate(null)
      formik.setFieldValue('searchType', '')
      formik.setFieldValue('searchInput', '')

      if (userServiceAreas?.find((area) => area.id === allLocationId)) {
        setResellerServiceAreaId(null)
        formik.setFieldValue('searchLocation', null)
        formik.handleSubmit()
      } else {
        setResellerServiceAreaId(userServiceAreaId)
        formik.setFieldValue('searchLocation', userServiceAreaId)
        formik.handleSubmit()
      }
    }
    setSearchValue('')
  }

  const setLocationChange = (optionId: string | null) => {
    removeQueryParams()
    if (optionId === allLocationId || !optionId) {
      const seeAllLocations = userServiceAreas?.find((area) => area.id === allLocationId)
      optionId = seeAllLocations ? null : resellerId
    }
    setResellerServiceAreaId(optionId)
    formik.setFieldValue('searchLocation', optionId)
    formik.handleSubmit()
  }

  const onSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
    value?: string,
    isDropdown?: boolean
  ) => {
    const { value: eventVal } = event.target
    const searchText = value ? value : eventVal
    setSearchValue(searchText)

    if (isDropdown) {
      onEnterSearch(null, isDropdown, searchText)
    } else {
      formik.setFieldValue('searchLocation', resellerServiceAreaId)
      formik.setFieldValue('searchType', selectedSearch?.value)
      formik.setFieldValue('searchInput', searchText)
      window.setTimeout(() => {
        if (searchText.length >= 2) {
          formik.handleSubmit()
        }
      }, 1000)
    }
  }
  const onEnterSearch = (
    event: KeyboardEvent<HTMLInputElement> | null,
    isDropdown?: boolean,
    searchText?: string
  ) => {
    const shouldSubmit = isDropdown || (event?.key === Keypress.ENTER && searchValue?.length >= 2)

    if (!shouldSubmit) {
      return
    }

    formik.setFieldValue('searchLocation', resellerServiceAreaId)

    const newValue = []
    formik.setFieldValue('searchType', selectedSearch?.value)
    const value = isDropdown && searchText ? searchText : searchValue

    if (selectedSearch?.value === 'statusList') {
      newValue.push(value)
      formik.setFieldValue('searchInput', newValue)
    } else {
      formik.setFieldValue('searchInput', value)
    }
    formik.handleSubmit()
  }

  const statusOptions = getBookingStatusOnlyUsedInBackendOptions(t)
  const isExtendOptions = getIsExtendOptions()

  const formik = useFormik({
    initialValues: {
      searchType: '',
      searchInput: '',
      searchLocation: userServiceAreaId,
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      setPage(0)
      const { searchType, searchInput, searchLocation } = value
      let filterSearch: FilterSearch = {}

      if (searchType) {
        filterSearch = { [searchType]: searchInput }
      }

      if (searchLocation) {
        filterSearch.resellerServiceAreaId = searchLocation
      }
      setFilter(filterSearch)
    },
  })

  // == export ==
  const csvHeaders = [
    { label: t('booking.tableHeader.detailId'), key: 'detailId' },
    { label: t('booking.tableHeader.customerId'), key: 'customerId' },
    { label: t('booking.tableHeader.firstName'), key: 'firstName' },
    { label: t('booking.tableHeader.lastName'), key: 'lastName' },
    { label: t('booking.tableHeader.email'), key: 'email' },
    { label: t('booking.tableHeader.phone'), key: 'phone' },
    { label: t('booking.tableHeader.carId'), key: 'carId' },
    { label: t('booking.tableHeader.model'), key: 'model' },
    { label: t('booking.tableHeader.brand'), key: 'brand' },
    { label: t('booking.tableHeader.seats'), key: 'seats' },
    { label: t('booking.tableHeader.topSpeed'), key: 'topSpeed' },
    { label: t('booking.tableHeader.plateNumber'), key: 'plateNumber' },
    { label: t('booking.tableHeader.vin'), key: 'vin' },
    { label: t('booking.tableHeader.fastChargeTime'), key: 'fastChargeTime' },
    { label: t('booking.tableHeader.price'), key: 'price' },
    { label: t('booking.tableHeader.duration'), key: 'duration' },
    { label: t('booking.tableHeader.startDate'), key: 'startDate' },
    { label: t('booking.tableHeader.endDate'), key: 'endDate' },
    { label: t('booking.tableHeader.deliveryAddress'), key: 'deliveryAddress' },
    { label: t('booking.tableHeader.returnAddress'), key: 'returnAddress' },
    { label: t('booking.tableHeader.status'), key: 'status' },
    { label: t('booking.tableHeader.parentId'), key: 'parentId' },
    { label: t('booking.tableHeader.isExtend'), key: 'isExtend' },
    { label: t('booking.tableHeader.location'), key: 'location' },
    { label: t('booking.tableHeader.owner'), key: 'owner' },
    { label: t('booking.tableHeader.reseller'), key: 'reseller' },
    { label: t('booking.tableHeader.voucherId'), key: 'voucherId' },
    { label: t('booking.tableHeader.voucherCode'), key: 'voucherCode' },
    { label: t('booking.tableHeader.createdDate'), key: 'createdDate' },
    { label: t('booking.tableHeader.updatedDate'), key: 'updatedDate' },
    { label: t('booking.tableHeader.paymentStatus'), key: 'paymentStatus' },
    { label: t('booking.tableHeader.paymentFailureMessage'), key: 'paymentFailureMessage' },
    { label: t('booking.tableHeader.paymentUpdatedDate'), key: 'paymentUpdatedDate' },
    { label: t('booking.tableHeader.deliveryDate'), key: 'deliveryDate' },
    { label: t('booking.tableHeader.returnDate'), key: 'returnDate' },
    { label: t('booking.tableHeader.isReplacement'), key: 'isReplacement' },
  ]
  const csvData: BookingCsv[] = []
  bookings.forEach((booking) => {
    const data = {
      detailId: booking.detailId,
      customerId: booking.customerId,
      firstName: booking.firstName,
      lastName: booking.lastName,
      email: booking.email,
      phone: booking.phone,
      location: booking.location,
      brand: booking.brand,
      model: booking.model,
      plateNumber: booking.plateNumber,
      duration: booking.duration,
      status: booking.status,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }
    csvData.push(data)
  })

  // == table ==
  const columnHead = [
    {
      colName: t('booking.tableHeader.firstName'),
    },
    {
      colName: t('booking.tableHeader.lastName'),
    },
    {
      colName: t('booking.tableHeader.email'),
    },
    {
      colName: t('booking.tableHeader.phone'),
    },
    {
      colName: t('booking.tableHeader.location'),
    },
    {
      colName: t('booking.tableHeader.brand'),
    },
    {
      colName: t('booking.tableHeader.model'),
    },
    {
      colName: t('booking.tableHeader.plateNumber'),
    },
    {
      colName: t('booking.tableHeader.duration'),
    },
    {
      colName: t('booking.tableHeader.status'),
    },
    {
      colName: t('booking.tableHeader.startDate'),
    },
    {
      colName: t('booking.tableHeader.endDate'),
    },
  ]
  const columnRow = [
    {
      field: 'firstName',
      render: (value: string) => {
        return <div className={classes.rowOverflowSmall}>{value}</div>
      },
    },
    {
      field: 'lastName',
      render: (value: string) => {
        return <div className={classes.rowOverflowSmall}>{value}</div>
      },
    },
    {
      field: 'email',
      render: (value: string) => {
        return <div className={classes.rowOverflowSmall}>{value}</div>
      },
    },
    {
      field: 'phone',
      render: (value: string) => {
        return <div className={classes.rowOverflow}>{value}</div>
      },
    },
    {
      field: 'location',
      render: (value: string) => {
        return <div className={classes.rowOverflow}>{value}</div>
      },
    },
    {
      field: 'brand',
      render: (value: string) => {
        return <div className={classes.rowOverflow}>{value}</div>
      },
    },
    {
      field: 'model',
      render: (value: string) => {
        return <div className={classes.rowOverflow}>{value}</div>
      },
    },
    {
      field: 'plateNumber',
      render: (value: string) => {
        return <div className={classes.rowOverflow}>{value}</div>
      },
    },
    {
      field: 'duration',
    },
    {
      field: 'status',
      render: (status: string) => {
        return <Chip label={columnFormatBookingStatus(status, t)} className={classes.chipBgGray} />
      },
    },
    {
      field: 'startDate',
      render: (date: string) => {
        return (
          <div className={classes.rowOverflow}>
            {formatDate(date, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
          </div>
        )
      },
    },
    {
      field: 'endDate',
      render: (date: string) => {
        return (
          <div className={classes.rowOverflow}>
            {formatDate(date, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
          </div>
        )
      },
    },
  ]
  const rowData = (bookings &&
    bookings.length > 0 &&
    bookings.map((booking: BookingList) => {
      return (
        <TableRow
          hover
          key={`booking-${booking.id}-${booking.detailId}`}
          onClick={() =>
            history.push({
              pathname: `/booking/${booking.id}/${booking.detailId}`,
              state: resellerServiceAreaId,
            })
          }
          style={{ textDecoration: 'none' }}
        >
          {columnRow.map((col) => (
            <TableCell key={col.field}>
              <div className={classes.paddingLeftCell}>
                {col.render ? col.render(booking[col.field]) : <div>{booking[col.field]}</div>}
              </div>
            </TableCell>
          ))}
        </TableRow>
      )
    })) || (
    <TableRow>
      <TableCell colSpan={columnHead.length} align="center">
        {t('booking.noData')}
      </TableCell>
    </TableRow>
  )

  useEffect(() => {
    refetch()
  }, [page, pageSize, filter, refetch])

  const renderSearchStatus = () => (
    <Autocomplete
      autoHighlight
      id="status_select_list"
      options={statusOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => {
        return <TextField {...params} label={t('booking.selectStatus')} variant="outlined" />
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value || value.value === ''}
      value={selectedOptionValue || null}
      onChange={(event, item) => {
        setSelectedOptionValue(item)
        onSearchChange(event as ChangeEvent<HTMLInputElement>, item?.value, true)
      }}
    />
  )

  const renderSearchInputField = () => (
    <TextField
      id="booking_search_input"
      type="text"
      variant="outlined"
      fullWidth
      value={searchValue || ''}
      onChange={onSearchChange}
      onKeyDown={(event) => onEnterSearch(event as KeyboardEvent<HTMLInputElement>)}
      disabled={!selectedSearch || selectedSearch?.value === 'all' || selectedSearch?.value === ''}
      placeholder={t('booking.enterSearch')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton>
              <SearchIcon
                color={
                  !selectedSearch || selectedSearch?.value === 'all' || selectedSearch?.value === ''
                    ? 'disabled'
                    : 'action'
                }
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )

  const renderSearchIsExtend = () => (
    <Autocomplete
      autoHighlight
      id="isextend_select_list"
      options={isExtendOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => {
        return <TextField {...params} label={t('booking.selectIsExtend')} variant="outlined" />
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value || value.value === ''}
      value={selectedOptionValue || null}
      onChange={(event, item) => {
        setSelectedOptionValue(item)
        onSearchChange(event as ChangeEvent<HTMLInputElement>, item?.value, true)
      }}
    />
  )

  const renderSearchDate = (label: string) => (
    <SearchDatePicker
      label={t(('booking.search.' + label) as unknown as TemplateStringsArray)}
      KeyboardButtonProps={{
        id: 'booking__searchdate_icon',
      }}
      id="booking_searchdate_input"
      name="selectedFromDate"
      value={selectedFromDate}
      format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
      inputVariant="outlined"
      onChange={(date) => {
        if (date) {
          const newDate = date.toDate()
          setSelectedFromDate(newDate)
          const fmtDate = dayjs(newDate).tz(config.timezone).format(DEFAULT_DATE_FORMAT_BFF)
          formik.setFieldValue('searchType', label)
          formik.setFieldValue('searchInput', fmtDate)
          formik.setFieldValue('searchLocation', resellerServiceAreaId)
          formik.handleSubmit()
        }
      }}
    />
  )

  const renderComponentBasedOnSelectedSearch = () => {
    if (selectedSearch?.value === 'statusList') {
      return renderSearchStatus()
    }
    if (selectedSearch?.value === 'isExtend') {
      return renderSearchIsExtend()
    }
    if (
      selectedSearch?.value === 'startDate' ||
      selectedSearch?.value === 'endDate' ||
      selectedSearch?.value === 'deliveryDate' ||
      selectedSearch?.value === 'returnDate'
    ) {
      return renderSearchDate(selectedSearch?.value)
    }

    return renderSearchInputField()
  }

  const setCurrentLocation = () => {
    if (!resellerServiceAreaId) {
      return allLocationId
    }
    return resellerServiceAreaId
  }

  return (
    <Page>
      <PageTitle title={t('sidebar.bookingManagement.booking')} breadcrumbs={breadcrumbs} />
      <Card>
        <Grid className={classes.gridTitle}>
          <Typography id="booking_title_table" variant="h6" className={classes.typo}>
            <strong>{t('booking.list')}</strong>
          </Typography>
        </Grid>
        <Grid className={classes.gridSearch} container spacing={1}>
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
            <Autocomplete
              autoHighlight
              id="search_select_list"
              options={searchOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => {
                return (
                  <TextField {...params} label={t('booking.selectSearch')} variant="outlined" />
                )
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === ''
              }
              value={selectedSearch || null}
              onChange={(_e, value) => {
                onSetSelectedSearch(value)
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
            {renderComponentBasedOnSelectedSearch()}
          </Grid>
          <Grid item xs />
          <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
            <LocationSwitcher
              userServiceAreas={userServiceAreas}
              currentLocationId={setCurrentLocation()}
              onLocationChanged={(option) => {
                if (option) {
                  setLocationChange(option.id)
                } else {
                  setLocationChange(null)
                }
              }}
            />
          </Grid>
          <Grid item className={classes.gridExport}>
            <Button
              id="booking_csv_button"
              variant="contained"
              className={classes.exportButton}
              size="large"
            >
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="booking.csv"
                className={classes.csvlink}
              >
                {t('button.export').toLocaleUpperCase()}
              </CSVLink>
            </Button>
          </Grid>
        </Grid>

        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                {columnHead.map((col) => (
                  <TableCell key={col.colName}>
                    <div className={classes.columnHeader}>{col.colName}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columnHead.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{rowData}</TableBody>
            )}
          </Table>
        </TableContainer>
        <Card>
          {bookingData?.data ? (
            <div className={classes.paginationContainer}>
              Rows per page:&nbsp;
              <FormControl variant="standard" className={classes.inlineElement}>
                <Select
                  value={bookingData?.data?.pagination?.size || pageSize}
                  defaultValue={bookingData?.data?.pagination?.size || pageSize}
                  onChange={(event) => {
                    setPage(0)
                    setPageSize(event.target.value as number)
                    setQuery({ size: event.target.value as number, page: 1 })
                  }}
                >
                  {config.tableRowsPerPageOptions?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              &nbsp;&nbsp;{bookingData?.data.pagination?.page} {t('booking.of')}
              &nbsp;
              {bookingData?.data.pagination?.totalPage}
              <Pagination
                count={bookingData?.data?.pagination?.totalPage}
                page={bookingData?.data?.pagination?.page || currentPage}
                defaultPage={bookingData?.data?.pagination?.page || currentPage}
                variant="text"
                color="primary"
                onChange={(_event: React.ChangeEvent<unknown>, selectedPage: number) => {
                  if (page !== selectedPage) {
                    setPage(selectedPage)
                    setQuery({ size: pageSize, page: selectedPage })
                  } else {
                    refetch()
                  }
                }}
              />
            </div>
          ) : (
            ''
          )}
        </Card>
      </Card>
    </Page>
  )
}
