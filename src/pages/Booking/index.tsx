/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState, KeyboardEvent, ChangeEvent, SyntheticEvent } from 'react'
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
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import {
  SelectOption,
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
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import SearchAutocomplete from 'components/SearchAutocomplete'
import SearchInputField from 'components/SearchInputField'
import { ResellerServiceArea } from 'services/web-bff/car.type'
import { useStyles, SearchDatePicker } from './styles'
import {
  getBookingList,
  getBookingStatusOnlyUsedInBackendOptions,
  getIsExtendOptions,
  BookingObject,
  BookingList,
  columnFormatBookingStatus,
  columnFormatBookingPaymentStatus,
  Keypress,
  FilterSearch,
  getCsvData,
  getHeaderCsvFile,
  getSearchOptions,
  getHeaderTable,
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

  const bookings = getBookingList(bookingData?.data?.bookingDetails, t)

  // == search ==
  const searchOptions: SelectOption[] = getSearchOptions(t)
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
  const csvHeaders = getHeaderCsvFile(t)
  const csvData: BookingObject[] = getCsvData(bookings, t)

  // == table ==
  const headerText: TableHeaderProps[] = getHeaderTable(classes.columnHeader, t)

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
          className={classes.textDecoration}
        >
          <TableCell key="firstName">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.firstName}</div>
            </div>
          </TableCell>
          <TableCell key="lastName">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.lastName}</div>
            </div>
          </TableCell>
          <TableCell key="email">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.email}</div>
            </div>
          </TableCell>
          <TableCell key="phone">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.phone}</div>
            </div>
          </TableCell>
          <TableCell key="location">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.location}</div>
            </div>
          </TableCell>
          <TableCell key="brand">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.brand}</div>
            </div>
          </TableCell>
          <TableCell key="model">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.model}</div>
            </div>
          </TableCell>
          <TableCell key="plateNumber">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>{booking.plateNumber}</div>
            </div>
          </TableCell>
          <TableCell key="duration">
            <div className={classes.paddingLeftCell}>{booking.duration}</div>
          </TableCell>
          <TableCell key="status">
            <div className={classes.paddingLeftCell}>
              <Chip
                label={columnFormatBookingStatus(booking.status, t)}
                className={classes.chipBgGray}
              />
            </div>
          </TableCell>
          <TableCell key="startDate">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>
                {formatDate(booking.startDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </div>
            </div>
          </TableCell>
          <TableCell key="endDate">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>
                {formatDate(booking.endDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </div>
            </div>
          </TableCell>
          <TableCell key="paymentStatus">
            <div className={classes.paddingLeftCell}>
              <Chip
                label={columnFormatBookingPaymentStatus(booking.paymentStatus, classes, t).label}
                className={
                  columnFormatBookingPaymentStatus(booking.paymentStatus, classes, t).color
                }
              />
            </div>
          </TableCell>
          <TableCell key="paymentUpdated">
            <div className={classes.paddingLeftCell}>
              <div className={classes.rowOverflow}>
                {formatDate(booking.paymentUpdated, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )
    })) || (
    <TableRow>
      <TableCell colSpan={headerText.length} align="center">
        {t('booking.noData')}
      </TableCell>
    </TableRow>
  )

  useEffect(() => {
    refetch()
  }, [page, pageSize, filter, refetch])

  const renderSearchStatus = () => (
    <SearchAutocomplete
      id="status_select_list"
      statusOptions={statusOptions}
      textLabel={t('booking.selectStatus')}
      value={selectedOptionValue}
      handleChange={(event: SyntheticEvent<Element, Event>, item: SelectOption | null) => {
        setSelectedOptionValue(item)
        onSearchChange(event as ChangeEvent<HTMLInputElement>, item?.value, true)
      }}
    />
  )

  const renderSearchInputField = () => (
    <SearchInputField
      id="booking_search_input"
      value={searchValue}
      handleChange={onSearchChange}
      handleKeyDown={(event: KeyboardEvent<HTMLInputElement>) => onEnterSearch(event)}
      selectedSearch={selectedSearch}
      textLabel={t('booking.enterSearch')}
    />
  )

  const renderSearchIsExtend = () => (
    <SearchAutocomplete
      id="isextend_select_list"
      statusOptions={isExtendOptions}
      textLabel={t('booking.selectIsExtend')}
      value={selectedOptionValue}
      handleChange={(event: SyntheticEvent<Element, Event>, item: SelectOption | null) => {
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
            <DataTableHeader headers={headerText} />
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={headerText.length} align="center">
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
