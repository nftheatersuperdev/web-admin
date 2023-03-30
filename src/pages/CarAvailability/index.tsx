import { useState, useEffect } from 'react'
import {
  GridColDef,
  GridPageChangeParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridCellParams,
  GridRowData,
  GridToolbarExport,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
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
  Button,
  Card,
  Chip,
  FormControl,
  Grid,
  InputAdornment,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { Search as SearchIcon } from '@material-ui/icons'
import { useFormik } from 'formik'
import Pagination from '@mui/lab/Pagination'
import { useHistory } from 'react-router-dom'
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

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const useStyles = makeStyles(() => ({
  searchBar: {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'left',
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
  buttonWithoutExport: {
    backgroundColor: '#424E63',
    color: 'white',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
  },
  buttoExport: {
    color: 'white',
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
    marginLeft: '16px',
  },
  chipBgGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  chipBgPrimary: {
    backgroundColor: '#4584FF',
    color: 'white',
  },
}))

export default function Car(): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()
  const classes = useStyles()
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [selectedToDate, setSelectedToDate] = useState(initSelectedToDate)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)
  const searchTypeList = getSearchTypeList(t)
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
        carTrackId: car.carTrackId || '-',
        createdDate: car.createdDate,
        updatedDate: car.updatedDate || '-',
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
      sortable: false,
      hide: false,
      flex: 1,
      renderCell: (params: GridCellParams) => (
        <div>
          <Chip
            label={params.value}
            className={
              String(params.value).toLowerCase() === 'available'
                ? classes.chipBgGreen
                : classes.chipBgPrimary
            }
          />
        </div>
      ),
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
  }
  const customToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ allColumns: true }} />
    </GridToolbarContainer>
  )
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.carManagement.carAvailability'),
      link: '/car-availability',
    },
  ]
  const handleRowClick = (data: GridRowData) => {
    return history.push({
      pathname: `/car-availability/${data.row.id}`,
      state: data.row,
    })
  }
  const csvHeaders = [
    { label: t('carAvailabilityDetail.carId'), key: 'id' },
    { label: t('carAvailabilityDetail.carStatus'), key: 'status' },
    { label: t('carAvailabilityDetail.carTrackId'), key: 'carTrackId' },
    { label: t('carAvailabilityDetail.plateNumber'), key: 'plateNumber' },
    { label: t('carAvailabilityDetail.carBrand'), key: 'brand' },
    { label: t('carAvailabilityDetail.carModel'), key: 'model' },
    { label: t('carAvailabilityDetail.color'), key: 'color' },
    { label: t('carAvailabilityDetail.vin'), key: 'vin' },
    { label: t('carAvailabilityDetail.bookingId'), key: 'subscriptionId' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  carData?.data.records.forEach(({ car, availabilityStatus: status, booking }) => {
    const makeData = () => ({
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
    })
    csvData.push(makeData())
  })

  return (
    <Page>
      <PageTitle title={t('sidebar.carAvailability')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h5" component="h2">
            {t('sidebar.carAvailabilityList')}
          </Typography>
          <Grid className={classes.searchBar} container spacing={1}>
            <Grid item className={[classes.filter].join(' ')} xs={2}>
              <TextField
                fullWidth
                select
                label={t('carAvailability.search')}
                variant="outlined"
                id="car_availability__searchtype_input"
                value={formik.values.searchType}
                onChange={(event) => {
                  formik.setFieldValue('searchType', event.target.value)
                  setFilterSearchField('')
                  setFilterSearchFieldError('')
                }}
              >
                <MenuItem value="">
                  <em>{t('carAvailability.none')}</em>
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
                error={!!filterSearchFieldError}
                helperText={filterSearchFieldError}
                variant="outlined"
                id="car_availability__searchField_input"
                placeholder={t('carAvailability.searchField.placeholder')}
                value={filterSearchField}
                onChange={handleOnSearchFieldChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item className={[classes.filter].join(' ')} xs={7}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
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
                    inputVariant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
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
                    inputVariant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Button
                    id="car_availability__search_btn"
                    className={classes.buttonWithoutShadow}
                    color="primary"
                    variant="contained"
                    onClick={() => formik.handleSubmit()}
                  >
                    {t('carAvailability.searchBtn')}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={2} className={classes.exportContrainer}>
                  <Button
                    id="car_availability__export_btn"
                    className={classes.buttonWithoutExport}
                    variant="contained"
                    disabled={isFetching}
                  >
                    <CSVLink
                      data={csvData}
                      headers={csvHeaders}
                      filename={t('sidebar.carAvailability') + '.csv'}
                      className={classes.buttoExport}
                    >
                      {t('button.export')}
                    </CSVLink>
                  </Button>
                </Grid>
              </Grid>
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
            onRowClick={handleRowClick}
            rows={rows}
            columns={columns}
            onColumnVisibilityChange={onColumnVisibilityChange}
            sortingMode="server"
            loading={isFetching}
            customToolbar={customToolbar}
            hideFooter
          />
        </ContentSection>
      </Wrapper>
      <Card>
        <div className={classes.paginationContrainer}>
          Rows per page:&nbsp;
          <FormControl className={classes.inlineElement}>
            <Select
              value={carData?.data?.pagination?.size || pageSize}
              defaultValue={carData?.data?.pagination?.size || pageSize}
              onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
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
