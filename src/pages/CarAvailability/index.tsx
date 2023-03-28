import { useState, useEffect } from 'react'
import {
  GridColDef,
  GridPageChangeParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_FORMAT_BFF,
  getStringFilterOperators,
  getEqualFilterOperators,
  FieldKeyOparators,
  validateKeywordText,
} from 'utils'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import { useQuery } from 'react-query'
import { Search as SearchIcon } from '@material-ui/icons'
import { useFormik } from 'formik'
import Pagination from '@mui/lab/Pagination'
import { getAvailableListBFF } from 'services/web-bff/car'
import { CarAvailableListFilterRequest } from 'services/web-bff/car.type'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import {
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
  getSearchTypeList,
} from './utils'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()
const initSelectedToDate = dayjs().tz(config.timezone).endOf('day').toDate()

const useStyles = makeStyles(() => ({
  searchBar: {
    margin: '20px 0 0 0',
    display: 'flex',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  filter: {
    height: '90px',
  },
  buttonWithoutShadow: {
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
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
}))

export default function Car(): JSX.Element {
  const { t } = useTranslation()
  const classes = useStyles()
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [selectedToDate, setSelectedToDate] = useState(initSelectedToDate)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)
  const searchTypeList = getSearchTypeList(t)
  const [filterPlate, setFilterPlate] = useState<string>('')
  const [filterPlateError, setFilterPlateError] = useState<string>('')
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
  }, [filter, page, pageSize, refetch])

  const equalFilterOperators = getEqualFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onColumnVisibilityChange = (params: any) => {
    if (params.field === '__check__') {
      return
    }

    const visibilityColumns = params.api.current
      .getAllColumns()
      .filter(({ field }: { field: string }) => field !== '__check__')
      .reduce((columns: VisibilityColumns, column: { field: string; hide: boolean }) => {
        columns[column.field] = !column.hide
        return columns
      }, {})

    visibilityColumns[params.field] = params.isVisible

    setVisibilityColumns(visibilityColumns)
  }

  const rowCount = carData?.data?.pagination?.totalRecords ?? 0
  const rows =
    carData?.data.records.map(({ car, availabilityStatus: status, booking }) => {
      return {
        id: car.id,
        vin: car.vin,
        plateNumber: car.plateNumber,
        model: car.carSku?.carModel.name || '-',
        brand: car.carSku?.carModel.brand.name || '-',
        color: car.carSku?.color || '-',
        status,
        subscriptionId: booking?.length > 0 ? booking.map((row) => row.id) : '-',
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('car.id'),
      description: t('car.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: equalFilterOperators,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('car.plateNumber'),
      description: t('car.plateNumber'),
      hide: !visibilityColumns.plateNumber,
      flex: 1,
      filterOperators: stringFilterOperators,
      sortable: false,
    },
    {
      field: 'vin',
      headerName: t('car.vin'),
      description: t('car.vin'),
      filterable: false,
      flex: 1,
      hide: !visibilityColumns.vin,
      sortable: false,
    },
    {
      field: 'brand',
      headerName: t('car.brand'),
      description: t('car.brand'),
      hide: !visibilityColumns.brand,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'model',
      headerName: t('car.model'),
      description: t('car.model'),
      hide: !visibilityColumns.model,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'color',
      headerName: t('car.color'),
      description: t('car.color'),
      filterable: false,
      sortable: false,
      hide: !visibilityColumns.color,
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('car.status'),
      description: t('car.status'),
      filterable: false,
      hide: false,
      flex: 1,
    },
    {
      field: 'subscriptionId',
      headerName: t('car.subscriptionId'),
      description: t('car.subscriptionId'),
      filterable: false,
      sortable: false,
      hide: false,
      flex: 1,
    },
  ]
  const formik = useFormik({
    initialValues: {
      input: '',
      searchType: '',
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
          [keyOfValue]: filterPlate,
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
  const handleOnPlateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isKeywordAccepted = validateKeywordText(value)
    setFilterPlate(value)
    setFilterPlateError('')
    if (isKeywordAccepted && value.length >= conditionConfigs.minimumToFilterPlateNumber) {
      setFilterPlate(value)
    } else if (value !== '') {
      setFilterPlateError(t('carActivity.plateNumber.errors.invalidFormat'))
    } else {
      setFilterPlate('')
    }
  }
  const customToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  )
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.vehicleManagement'),
      link: '/',
    },
    {
      text: t('sidebar.carAvailability'),
      link: '/car-availability',
    },
  ]
  return (
    <Page>
      <PageTitle title="Car Availability" breadcrumbs={breadcrumbs} />
      <Card>
        <Grid className={classes.searchBar} container spacing={3}>
          <Grid item className={[classes.filter].join(' ')} xs={2}>
            <TextField
              fullWidth
              select
              label="Select Search"
              variant="outlined"
              id="document"
              value={formik.values.searchType}
              onChange={(event) => {
                formik.setFieldValue('searchType', event.target.value)
                setFilterPlate('')
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {searchTypeList?.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item className={[classes.filter].join(' ')} xs={3}>
            <TextField
              disabled={formik.values.searchType === ''}
              className={classes.fullWidth}
              error={!!filterPlateError}
              helperText={filterPlateError}
              variant="outlined"
              placeholder={t('carActivity.plateNumber.placeholder')}
              value={filterPlate}
              onChange={handleOnPlateChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item className={[classes.filter].join(' ')} xs={2}>
            <DatePicker
              label={t('carAvailability.selectedFromDate')}
              id="car_availability__startdate_input"
              KeyboardButtonProps={{
                id: 'car_availability__startdate_icon',
              }}
              name="selectedFromDate"
              format={DEFAULT_DATE_FORMAT}
              value={selectedFromDate}
              onChange={(date) => {
                date && setSelectedFromDate(date.toDate())
              }}
            />
          </Grid>
          <Grid item className={[classes.filter].join(' ')} xs={2}>
            <DatePicker
              label={t('carAvailability.selectedToDate')}
              id="car_availability__enddate_input"
              KeyboardButtonProps={{
                id: 'car_availability__enddate_icon',
              }}
              name="selectedToDate"
              format={DEFAULT_DATE_FORMAT}
              value={selectedToDate}
              onChange={(date) => {
                date && setSelectedToDate(date.toDate())
              }}
            />
          </Grid>
          <Grid item className={[classes.filter].join(' ')} xs={3}>
            <Box display="flex" alignItems="center">
              <Button
                id="car_availability__search_btn"
                className={classes.buttonWithoutShadow}
                color="primary"
                variant="contained"
                onClick={() => formik.handleSubmit()}
              >
                {t('carAvailability.search')}
              </Button>
            </Box>
          </Grid>
        </Grid>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={page}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
          rows={rows}
          columns={columns}
          onColumnVisibilityChange={onColumnVisibilityChange}
          sortingMode="server"
          loading={isFetching}
          customToolbar={customToolbar}
          hideFooter
        />
      </Card>
      <Card>
        <div className={classes.paginationContrainer}>
          Rows per page:&nbsp;
          <FormControl className={classes.inlineElement}>
            <Select
              value={carData?.data?.pagination?.size || pageSize}
              defaultValue={carData?.data?.pagination?.size || pageSize}
              onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                setPage(1)
                setPageSize(event.target.value as number)
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
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
    </Page>
  )
}
