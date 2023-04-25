/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState, KeyboardEvent, ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
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
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { formatDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT } from 'utils'
import config from 'config'
import { Page } from 'layout/LayoutRoute'
import { getList } from 'services/web-bff/car'
import { CarListFilterRequest } from 'services/web-bff/car.type'
import { CarOwnerResponse } from 'services/web-bff/car-owner.type'
import { ReSellerResponse } from 'services/web-bff/re-seller-area.type'
import { LocationResponse } from 'services/web-bff/location.type'
import { getCarOwnerList } from 'services/web-bff/car-owner'
import { getReSellerList } from 'services/web-bff/re-seller-area'
import { getLocationList } from 'services/web-bff/location'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import {
  getCarStatusOnlyUsedInBackendOptions,
  getOwnerOptions,
  columnFormatCarStatus,
  CarStatus,
  SelectOption,
  CarList,
  Keypress,
  CarCsv,
  FilterSearch,
  getResellerOptions,
  getLocationOptions,
} from './utils'
import { useStyles } from './styles'

export default function Car(): JSX.Element {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.carManagement.car'),
      link: '/car',
    },
  ]

  const {
    data: carData,
    refetch,
    isFetching,
  } = useQuery('cars', () =>
    getList({
      filter,
      page,
      size: pageSize,
    })
  )

  const { data: owners, isFetched: isFetchedOwner } = useQuery('get-car-owner', () =>
    getCarOwnerList()
  )

  const { data: resellers, isFetched: isFetchedReseller } = useQuery('get-car-reseller', () =>
    getReSellerList()
  )

  const { data: locations, isFetched: isFetchedLocation } = useQuery('get-location', () =>
    getLocationList()
  )

  const cars =
    carData?.data.cars.map((car) => {
      return {
        id: car.id,
        carTrackId: car.carTrackId || '-',
        location: car.location || '-',
        brand: car.carSku?.carModel.brand.name || '-',
        model: car.carSku?.carModel.name || '-',
        color: car.carSku?.color || '-',
        plateNumber: car.plateNumber || '-',
        vin: car.vin || '-',
        status: car.isActive ? CarStatus.PUBLISHED : CarStatus.OUT_OF_SERVICE,
        owner: car.owner || '-',
        reseller: car.reSeller || '-',
        createdDate: car.createdDate || '-',
      }
    }) || []

  // == search ==
  const searchOptions: SelectOption[] = [
    {
      label: t('car.color'),
      value: 'colorContain',
    },
    {
      label: t('car.vin'),
      value: 'vinContain',
    },
    {
      label: t('car.plateNumber'),
      value: 'plateNumberContain',
    },
    {
      label: t('car.status'),
      value: 'statusEqual',
    },
    {
      label: t('car.owner'),
      value: 'ownerProfileId',
    },
    {
      label: t('car.reseller'),
      value: 'resellerServiceAreaId',
    },
  ]
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedSearch, setSelectedSearch] = useState<SelectOption | null>()
  const [selectedOptionValue, setSelectedOptionValue] = useState<SelectOption | null>()
  const [ownerData, setOwnerData] = useState<CarOwnerResponse | null>()
  const [resellerData, setResellerData] = useState<ReSellerResponse | null>()

  const onSetSelectedSearch = (value: SelectOption | null) => {
    if (value) {
      setSelectedSearch(value)
      setSelectedOptionValue(null)
    } else {
      setFilter({})
      setSelectedSearch(null)
      setSelectedOptionValue(null)
      setSelectedLocation(null)
    }
    setSearchValue('')
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

    formik.setFieldValue('searchType', selectedSearch?.value)
    const value = isDropdown && searchText ? searchText : searchValue
    formik.setFieldValue('searchInput', value)
    formik.handleSubmit()
  }

  const statusOptions = getCarStatusOnlyUsedInBackendOptions(t)
  const ownerOptions = getOwnerOptions(ownerData)
  const resellerOptions = getResellerOptions(resellerData)

  // == location ==
  const [locationData, setLocationData] = useState<LocationResponse | null>()
  const locationOptions = getLocationOptions(locationData)
  const defaultLocation = {
    label: t('car.allLocation'),
    value: 'all',
  }
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>()
  const onSetSelectedLocation = (option: SelectOption | null) => {
    if (option) {
      setSelectedLocation(option)
      formik.setFieldValue('searchLocation', option.value)
      formik.handleSubmit()
    } else {
      setSelectedLocation(defaultLocation)
      formik.setFieldValue('searchLocation', '')
      formik.handleSubmit()
    }
  }

  const formik = useFormik({
    initialValues: {
      searchType: '',
      searchInput: '',
      searchLocation: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      setPage(0)
      const { searchType, searchInput, searchLocation } = value
      let filterSearch: FilterSearch = {}

      if (searchType) {
        let keySearch = searchType
        let valueSearch = searchInput

        if (searchType === 'statusEqual') {
          keySearch = 'isActive'
          valueSearch = (searchInput === CarStatus.PUBLISHED).toString()
        }

        filterSearch = { [keySearch]: valueSearch }

        if (searchType === 'ownerProfileId') {
          filterSearch.ownerProfileType = 'BUSINESS'
        }
      }

      if (searchLocation) {
        filterSearch.resellerServiceAreaId = searchLocation
      }

      setFilter(filterSearch)
    },
  })

  // == export ==
  const csvHeaders = [
    { label: t('car.carTrackId'), key: 'carTrackId' },
    { label: t('car.brand'), key: 'brand' },
    { label: t('car.model'), key: 'model' },
    { label: t('car.color'), key: 'color' },
    { label: t('car.plateNumber'), key: 'plateNumber' },
    { label: t('car.vin'), key: 'vin' },
    { label: t('car.status'), key: 'status' },
    { label: t('car.createdDate'), key: 'createdDate' },
  ]
  const csvData: CarCsv[] = []
  cars.forEach((car) => {
    const data = {
      carTrackId: car.carTrackId,
      location: car.location,
      brand: car.brand,
      model: car.model,
      color: car.color,
      plateNumber: car.plateNumber,
      vin: car.vin,
      status: car.status,
      owner: car.owner || '-',
      reseller: car.reseller,
      createdDate: car.createdDate,
    }
    csvData.push(data)
  })

  // == table ==
  const columnHead = [
    {
      colName: t('car.carTrackId'),
      hidden: false,
    },
    {
      colName: t('car.location'),
      hidden: false,
    },
    {
      colName: t('car.brand'),
      hidden: false,
    },
    {
      colName: t('car.model'),
      hidden: false,
    },
    {
      colName: t('car.color'),
      hidden: false,
    },
    {
      colName: t('car.plateNumber'),
      hidden: false,
    },
    {
      colName: t('car.status'),
      hidden: false,
    },
    {
      colName: t('car.owner'),
      hidden: false,
    },
    {
      colName: t('car.reseller'),
      hidden: false,
    },
    {
      colName: t('car.createdDate'),
      hidden: false,
    },
  ]
  const columnRow = [
    {
      field: 'carTrackId',
      hidden: false,
    },
    {
      field: 'location',
      hidden: false,
    },
    {
      field: 'brand',
      hidden: false,
    },
    {
      field: 'model',
      hidden: false,
      render: (model: string) => {
        return (
          <div className={classes.wrapWidth}>
            <div className={classes.rowOverflow}>{model}</div>
          </div>
        )
      },
    },
    {
      field: 'color',
      hidden: false,
    },
    {
      field: 'plateNumber',
      hidden: false,
    },
    {
      field: 'status',
      hidden: false,
      render: (status: string) => {
        return (
          <Chip
            label={columnFormatCarStatus(status, t)}
            className={status === 'published' ? classes.chipBgGreen : classes.chipBgGray}
          />
        )
      },
    },
    {
      field: 'owner',
      hidden: false,
    },
    {
      field: 'reseller',
      hidden: false,
    },
    {
      field: 'createdDate',
      hidden: false,
      render: (date: string) => {
        return (
          <div className={classes.wrapWidth}>
            <div className={classes.rowOverflow}>
              {formatDate(date, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
            </div>
          </div>
        )
      },
    },
  ]
  const rowData = (cars &&
    cars.length > 0 &&
    cars.map((car: CarList) => {
      return (
        <TableRow
          hover
          onClick={() => history.push({ pathname: `/car/${car.id}` })}
          key={`car-${car.id}`}
        >
          {columnRow.map((col) => (
            <TableCell key={col.field} hidden={col.hidden}>
              <div className={classes.paddingLeftCell}>
                {col.render ? col.render(car[col.field]) : <div>{car[col.field]}</div>}
              </div>
            </TableCell>
          ))}
        </TableRow>
      )
    })) || (
    <TableRow>
      <TableCell colSpan={columnHead.length} align="center">
        {t('car.noData')}
      </TableCell>
    </TableRow>
  )

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<CarListFilterRequest>()

  useEffect(() => {
    refetch()
    setPage(1)
  }, [page, pageSize, filter, refetch])

  useEffect(() => {
    if (carData?.data?.cars) {
      const totalPages = Math.ceil(carData.data.cars.length / pageSize)
      const total = totalPages === 0 ? 0 : totalPages - 1
      setPage(Math.min(page, total))
    }
  }, [carData, pageSize, page])

  useEffect(() => {
    if (isFetchedOwner && owners) {
      setOwnerData(owners)
    }
  }, [owners, isFetchedOwner])

  useEffect(() => {
    if (isFetchedReseller && resellers) {
      setResellerData(resellers)
    }
  }, [resellers, isFetchedReseller])

  useEffect(() => {
    if (isFetchedLocation && locations) {
      setLocationData(locations)
    }
  }, [locations, isFetchedLocation])

  const renderSearchStatus = () => (
    <Autocomplete
      autoHighlight
      id="status_select_list"
      options={statusOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => {
        return <TextField {...params} label={t('car.selectStatus')} variant="outlined" />
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
      id="car_search_input"
      type="text"
      variant="outlined"
      fullWidth
      value={searchValue || ''}
      onChange={onSearchChange}
      onKeyDown={(event) => onEnterSearch(event as KeyboardEvent<HTMLInputElement>)}
      disabled={!selectedSearch || selectedSearch?.value === 'all' || selectedSearch?.value === ''}
      placeholder={t('car.search')}
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

  const renderSearchOwner = () => (
    <Autocomplete
      autoHighlight
      id="owner_select_list"
      options={ownerOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => {
        return <TextField {...params} label={t('car.selectOwner')} variant="outlined" />
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value || value.value === ''}
      value={selectedOptionValue || null}
      onChange={(event, item) => {
        setSelectedOptionValue(item)
        onSearchChange(event as ChangeEvent<HTMLInputElement>, item?.value, true)
      }}
    />
  )

  const renderSearchReseller = () => (
    <Autocomplete
      autoHighlight
      id="reseller_select_list"
      options={resellerOptions}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => {
        return <TextField {...params} label={t('car.selectReseller')} variant="outlined" />
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value || value.value === ''}
      value={selectedOptionValue || null}
      onChange={(event, item) => {
        setSelectedOptionValue(item)
        onSearchChange(event as ChangeEvent<HTMLInputElement>, item?.value, true)
      }}
    />
  )

  const renderComponentBasedOnSelectedSearch = () => {
    if (selectedSearch?.value === 'statusEqual') {
      return renderSearchStatus()
    }
    if (selectedSearch?.value === 'ownerProfileId') {
      return renderSearchOwner()
    }
    if (selectedSearch?.value === 'resellerServiceAreaId') {
      return renderSearchReseller()
    }

    return renderSearchInputField()
  }

  return (
    <Page>
      <PageTitle title={t('sidebar.carManagement.title')} breadcrumbs={breadcrumbs} />
      <Card>
        <Grid className={classes.gridTitle}>
          <Typography id="car_title_table" variant="h6" className={classes.typo}>
            <strong>{t('car.carList')}</strong>
          </Typography>
        </Grid>
        <Grid className={classes.gridSearch} container spacing={3}>
          <Grid item xs={9} sm={2}>
            <Autocomplete
              autoHighlight
              id="search_select_list"
              options={searchOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => {
                return <TextField {...params} label={t('car.selectSearch')} variant="outlined" />
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
          <Grid item xs={9} sm={2}>
            {renderComponentBasedOnSelectedSearch()}
          </Grid>
          <Grid item xs={9} sm={2}>
            <Autocomplete
              autoHighlight
              id="search_location_list"
              options={locationOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label={t('car.location')}
                    variant="outlined"
                    placeholder={t('car.allLocation')}
                  />
                )
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === 'all'
              }
              value={selectedLocation || defaultLocation}
              defaultValue={selectedLocation || defaultLocation}
              onChange={(_e, value) => {
                onSetSelectedLocation(value)
              }}
            />
          </Grid>
          <Grid item xs={9} sm={4} />
          <Grid item xs={9} sm={2} className={classes.gridExport}>
            <Button
              id="car_csv_button"
              variant="contained"
              className={classes.exportButton}
              size="large"
            >
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={t('sidebar.carManagement.car') + '.csv'}
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
                  <TableCell key={col.colName} hidden={col.hidden}>
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
          <div className={classes.paginationContainer}>
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
            &nbsp;&nbsp;{carData?.data.pagination?.page} {t('car.of')}
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
      </Card>
    </Page>
  )
}
