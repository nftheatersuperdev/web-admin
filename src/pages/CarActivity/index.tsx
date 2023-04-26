/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  Button,
  Card,
  FormControl,
  Grid,
  TextField,
  InputAdornment,
  Typography,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Paper,
} from '@mui/material'
// import {
//   GridColDef,
//   GridPageChangeParams,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
//   GridToolbarDensitySelector,
// } from '@material-ui/data-grid'
// import Pagination from '@mui/lab/Pagination'
import { makeStyles } from '@mui/styles'
import { Search as SearchIcon } from '@mui/icons-material'
import { CSVLink } from 'react-csv'
import styled from 'styled-components'
import { validateKeywordText } from 'utils'
import config from 'config'
import { Page } from 'layout/LayoutRoute'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
// import NoResultCard from 'components/NoResultCard'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
// import DataGridLocale from 'components/DataGridLocale'
import { getActivities } from 'services/web-bff/car-activity'
import { getCarBrands } from 'services/web-bff/car-brand'
import { getLocationList } from 'services/web-bff/location'
import { CarBrand, CarModel, CarSku as CarColor } from 'services/web-bff/car-brand.type'
import { getLocationOptions, SelectOption } from './utils'

// interface CarActivityParams {
//   plate: string
//   brand: string
//   model: string
//   color: string
// }

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
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

const useStyles = makeStyles(() => ({
  hide: {
    display: 'none',
  },
  link: {
    color: '#333',
  },
  textBold: {
    fontWeight: 'bold',
  },
  subText: {
    color: '#AAA',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  displayNone: {
    display: 'none',
  },
  displayBlock: {
    display: 'block',
  },
  textRight: {
    textAlign: 'right',
  },
  fullWidth: {
    width: '100%',
  },
  searchWrapper: {
    margin: '20px 0',
  },
  buttonClearAllFilters: {
    padding: '16px 9px 16px 9px !important',
    color: '#3f51b5',
    '&:hover, &:focus': {
      background: 'none',
    },
  },
  buttonWithoutShadow: {
    fontWeight: 'bold',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '14px 12px',
  },
  buttonOverridePadding: {
    padding: '16px',
  },
  gridContainer: {
    marginBottom: '10px',
  },
  table: {
    width: '100%',
  },
  tableColumnCarInfo: {
    minWidth: '200px',
    position: 'sticky',
    left: 0,
    background: '#fff',
    whiteSpace: 'nowrap',
  },
  tableColumnDateHeader: {
    minWidth: '200px',
    whiteSpace: 'nowrap',
    // borderLeft: '1px solid #DDD',
    // borderRight: '1px solid #DDD',

    // Hide the mock data
    color: '#FFF',
    borderLeft: 'none',
    borderRight: 'none',
  },
  tableColumnDate: {
    minWidth: '200px',
    // borderLeft: '1px solid #DDD',
    // borderRight: '1px solid #DDD',

    // Hide the mock data
    color: '#FFF',
    borderLeft: 'none',
    borderRight: 'none',
  },
  tableColumnActions: {
    position: 'sticky',
    right: 0,
    background: '#fff',
    textAlign: 'center',
  },
  paginationContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  filter: {
    height: '90px',
  },
  buttonExport: {
    backgroundColor: '#424E63',
  },
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
    padding: '0px 8px',
  },
  rowOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  paddindElement: {
    marginLeft: '8px',
  },
  noResultMessage: {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '48px 0',
  },
}))

const useQueryString = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export default function CarActivity(): JSX.Element {
  // const { id: carId } = useParams<CarActivityParams>()
  const classes = useStyles()
  const { t } = useTranslation()
  const history = useHistory()
  const qs = {
    plate: useQueryString().get('plate'),
    brand: useQueryString().get('brand'),
    model: useQueryString().get('model'),
    color: useQueryString().get('color'),
    location: useQueryString().get('resellerServiceAreaId'),
  }

  const conditionConfigs = {
    minimumToFilterPlateNumber: 2,
  }
  const defaultSelectList = {
    brandAll: { id: 'all', name: t('carActivity.brand.emptyValue'), carModels: [] },
    modelEmpty: {
      id: 'empty',
      name: `${t('carActivity.model.emptyValue')}`,
      subModelName: '',
      year: 0,
      carSkus: [],
    },
    modelAll: {
      id: 'all',
      name: t('all'),
      subModelName: '',
      year: 0,
      carSkus: [],
    },
    colorEmpty: { id: 'empty', color: `${t('carActivity.color.emptyValue')}`, cars: [] },
    colorAll: { id: 'all', color: t('all'), cars: [] },
  }

  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [carId] = useState<string>('')
  const [visibleAddDialog, setVisibleAddDialog] = useState<boolean>(false)
  const [filterPlateError, setFilterPlateError] = useState<string>('')
  const [filterBrandObject, setFilterBrandObject] = useState<CarBrand | null>()
  const [filterModelObject, setFilterModelObject] = useState<CarModel | null>()
  const [filterColorObject, setFilterColorObject] = useState<CarColor | null>()
  const [filterPlate, setFilterPlate] = useState<string>(qs.plate || '')
  const [filterBrand, setFilterBrand] = useState<string>(qs.brand || '')
  const [filterModel, setFilterModel] = useState<string>(qs.model || '')
  const [filterColor, setFilterColor] = useState<string>(qs.color || '')
  const [filterLocation, setFilterLocation] = useState<string>(qs.location || '')
  const [resetFilters, setResetFilters] = useState<boolean>(false)
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [carColors, setCarColors] = useState<CarColor[]>([])

  const checkFilterButtonConditions = () => {
    if (
      (!!filterBrand && !filterPlate) ||
      (!!filterBrand && filterPlate && !filterPlateError) ||
      (!filterBrand && filterPlate && !filterPlateError)
    ) {
      return true
    }
    return false
  }
  const isEnableFilterButton = checkFilterButtonConditions()

  const {
    data: carBrands,
    isFetched: isFetchedBrands,
    isFetching: isFetchingBrands,
  } = useQuery('get-car-brands', () => getCarBrands())
  const {
    data: carActivitiesData,
    refetch,
    isFetched: isFetchedActivities,
    isFetching: isFetchingActivities,
  } = useQuery('get-car-activities', () =>
    getActivities(
      {
        page,
        size: pageSize,
      },
      {
        carBrandId: filterBrand,
        carModelId: filterModel,
        carSkuId: filterColor,
        plateNumber: filterPlate,
        resellerServiceAreaId: filterLocation,
      }
    )
  )
  const { data: locations, isFetched: isFetchedLocation } = useQuery('get-location', () =>
    getLocationList()
  )
  const locationOptions = getLocationOptions(locations)
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>()
  const defaultLocation = {
    label: t('carActivity.location.all'),
    value: 'all',
  }
  const onSetSelectedLocation = (option: SelectOption | null) => {
    if (option) {
      setFilterLocation(option.value)
      setSelectedLocation(option)
    } else {
      setFilterLocation('')
      setSelectedLocation(defaultLocation)
    }
  }

  const checkAndRenderValue = (value: string) => {
    if (!value) {
      return '-'
    }
    return value
  }

  // const rowCount = carActivitiesData?.pagination?.totalRecords ?? 0
  const rows =
    carActivitiesData?.cars.map((carActivity) => {
      return {
        id: carActivity.carId,
        location: carActivity.areaNameEn,
        brandName: carActivity.brandName,
        modelName: carActivity.modelName,
        color: carActivity.color,
        plateNumber: carActivity.plateNumber,
        owner: carActivity.owner,
        reSeller: carActivity.reSeller,
      }
    }) || []

  const carActivitiesRowData =
    rows?.map((carActivity) => {
      return (
        <TableRow
          hover
          key={`car-activity-${carActivity.id}`}
          onClick={() =>
            history.push({
              pathname: `/car-activity/${carActivity.id}`,
              state: carActivity,
            })
          }
        >
          <TableCell>
            <div>{checkAndRenderValue(carActivity.location)}</div>
          </TableCell>
          <TableCell>
            <div>{checkAndRenderValue(carActivity.brandName)}</div>
          </TableCell>
          <TableCell>
            <div>{checkAndRenderValue(carActivity.modelName)}</div>
          </TableCell>
          <TableCell>
            <div>{checkAndRenderValue(carActivity.color)}</div>
          </TableCell>
          <TableCell>
            <div>{checkAndRenderValue(carActivity.plateNumber)}</div>
          </TableCell>
          <TableCell>
            <div>{checkAndRenderValue(carActivity.owner)}</div>
          </TableCell>
          <TableCell>
            <div>{checkAndRenderValue(carActivity.reSeller)}</div>
          </TableCell>
        </TableRow>
      )
    }) || []

  const csvHeaders = [
    { label: t('carActivity.export.header.id'), key: 'id' },
    { label: t('carActivity.export.header.locationService'), key: 'location' },
    { label: t('carActivity.export.header.brand'), key: 'brandName' },
    { label: t('carActivity.export.header.model'), key: 'modelName' },
    { label: t('carActivity.export.header.color'), key: 'color' },
    { label: t('carActivity.export.header.plateNumber'), key: 'plateNumber' },
    { label: t('carActivity.export.header.owner'), key: 'owner' },
    { label: t('carActivity.export.header.reseller'), key: 'reSeller' },
  ]
  // eslint-disable-next-line
  const csvData: any = [...rows]

  // const isNoData = carActivities.length < 1

  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (carActivitiesData?.pagination) {
      setPage(carActivitiesData.pagination.page)
      setPageSize(carActivitiesData.pagination.size)
      setPages(carActivitiesData.pagination.totalPage)
    }

    if (
      isFetchedLocation &&
      isFetchedBrands &&
      isFetchedActivities &&
      carBrands &&
      carBrands.length >= 1
    ) {
      setFilterPlate(qs.plate || '')

      const brand = carBrands.find((carBrand) => carBrand.id === qs.brand)
      setFilterBrand(brand?.id || '')
      setFilterBrandObject(brand)
      setCarModels(brand?.carModels || [])

      const model = brand?.carModels.find((carModel) => carModel.id === qs.model)
      setFilterModel(model?.id || '')
      setFilterModelObject(model)
      setCarColors(model?.carSkus || [])

      const color = model?.carSkus.find((carSku) => carSku.id === qs.color)
      setFilterColor(color?.id || '')
      setFilterColorObject(color)

      const loc = locations?.locations.find((location) => location.id === qs.location)
      setFilterLocation(loc?.id || '')
      const locOption: SelectOption = {
        label: loc?.areaNameEn || '',
        value: loc?.id || '',
      }
      setSelectedLocation(locOption)

      refetch()
    }
  }, [])

  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [pages, page, pageSize])

  /**
   * Use for triggering to reset all filters and fetch data again.
   */
  useEffect(() => {
    if (resetFilters) {
      refetch()
      adjustBrowserHistory()
      setResetFilters(false)
    }
  }, [resetFilters])

  const handleOnScheduleDialogClose = () => {
    setVisibleAddDialog(false)
  }

  const handleOnPlateSearchEnterKeyDown = () => {
    refetch()
  }

  const adjustBrowserHistory = (params = {}) => {
    const adjustParams = {
      plate: filterPlate,
      brand: filterBrand,
      model: filterModel,
      color: filterColor,
      resellerServiceAreaId: filterLocation,
      ...params,
    }
    const validParams: {} = Object.fromEntries(
      Object.entries(adjustParams).filter(([_key, value]) => !!value)
    )
    const searchParams = new URLSearchParams(validParams)
    // console.log('adjustParams:', adjustParams)
    return history.push({ search: `?${searchParams.toString()}` })
  }

  const clearFilters = () => {
    setFilterPlate('')
    setFilterPlateError('')
    setFilterBrand('')
    setFilterBrandObject(null)
    setFilterModel('')
    setFilterModelObject(null)
    setFilterColor('')
    setFilterColorObject(null)
    setCarModels([])
    setCarColors([])
    setFilterLocation('')
    setSelectedLocation(null)
    setResetFilters(true)
  }

  const handleOnClickFilters = () => {
    setPage(1) // reset current page to be 1
    setResetFilters(true)
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
      setResetFilters(true)
    }
  }

  const handleOnBrandChange = (brand: CarBrand | null) => {
    setFilterBrand(brand?.id || '')
    setFilterBrandObject(brand || defaultSelectList.brandAll)
    setFilterModel('')
    setFilterModelObject(defaultSelectList.modelAll)
    setFilterColor('')
    setFilterColorObject(defaultSelectList.colorEmpty)
    setCarModels(brand?.carModels || [])
    setCarColors([])

    if (!brand) {
      setFilterModelObject(defaultSelectList.modelEmpty)
      setFilterColorObject(defaultSelectList.colorEmpty)
      setResetFilters(true)
    }
  }

  const handleOnModelChange = (model: CarModel | null) => {
    setFilterModel(model?.id || '')
    setFilterModelObject(model || defaultSelectList.modelAll)
    setFilterColor('')
    setFilterColorObject(defaultSelectList.colorAll)
    setCarColors(model?.carSkus || [])

    if (!model) {
      setFilterColorObject(defaultSelectList.colorEmpty)
      setCarColors([])
    }
  }

  const handleOnColorChange = (color: CarColor | null) => {
    setFilterColor(color?.id || '')
    setFilterColorObject(color || defaultSelectList.colorAll)
  }

  const generateDataToTable = () => {
    if (carActivitiesRowData.length > 0) {
      return <TableBody>{carActivitiesRowData}</TableBody>
    }

    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7}>
            <div className={classes.noResultMessage}>{t('warning.noResult')}</div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.carActivity'),
      link: '/car-activity',
    },
  ]

  return (
    <Page>
      <PageTitle title="Car Activity" breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('sidebar.carActivityList')}
          </Typography>
          <div className={classes.searchWrapper}>
            <Grid
              container
              spacing={1}
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
              className={classes.gridContainer}
            >
              <Grid item className={[classes.filter].join(' ')} xs={12} sm={6} md={6} lg={2} xl={2}>
                <FormControl variant="outlined" className={classes.fullWidth}>
                  <TextField
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
                    onKeyDown={(event) => {
                      if (!filterPlateError && filterPlate !== '' && event.key === 'Enter') {
                        handleOnPlateSearchEnterKeyDown()
                      }
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid
                item
                className={[classes.filter, 'filter-brand'].join(' ')}
                xs={12}
                sm={6}
                md={6}
                lg={2}
                xl={2}
              >
                <Autocomplete
                  autoHighlight
                  id="brand-select-list"
                  options={carBrands || []}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('carActivity.brand.label')}
                      variant="outlined"
                      placeholder={t('all')}
                    />
                  )}
                  value={filterBrandObject || defaultSelectList.brandAll}
                  defaultValue={filterBrandObject || defaultSelectList.brandAll}
                  onChange={(_event, value) => handleOnBrandChange(value)}
                />
              </Grid>
              <Grid
                item
                className={[classes.filter, 'filter-model'].join(' ')}
                xs={12}
                sm={6}
                md={3}
                lg={2}
                xl={2}
              >
                <Autocomplete
                  autoHighlight
                  id="model-select-list"
                  disabled={carModels.length < 1}
                  options={carModels}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('carActivity.model.label')}
                      variant="outlined"
                      placeholder={t('all')}
                    />
                  )}
                  value={filterModelObject || defaultSelectList.modelEmpty}
                  defaultValue={filterModelObject || defaultSelectList.modelEmpty}
                  onChange={(_event, value) => handleOnModelChange(value)}
                />
              </Grid>
              <Grid
                item
                className={[classes.filter, 'filter-color'].join(' ')}
                xs={12}
                sm={6}
                md={3}
                lg={2}
                xl={2}
              >
                <Autocomplete
                  autoHighlight
                  id="color-select-list"
                  disabled={carColors.length < 1}
                  options={carColors}
                  getOptionLabel={(option) => option.color}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('carActivity.color.label')}
                      variant="outlined"
                      placeholder={t('all')}
                    />
                  )}
                  value={filterColorObject || defaultSelectList.colorEmpty}
                  defaultValue={filterColorObject || defaultSelectList.colorEmpty}
                  onChange={(_event, value) => handleOnColorChange(value)}
                />
              </Grid>
              <Grid
                item
                className={[classes.filter, 'filter-buttons'].join(' ')}
                xs={6}
                sm={6}
                md={4}
                lg={1}
                xl={1}
              >
                <Button
                  id="car_activity__search_btn"
                  variant="contained"
                  color="primary"
                  className={classes.buttonWithoutShadow}
                  onClick={() => handleOnClickFilters()}
                  disabled={isFetchingBrands || isFetchingActivities || !!filterPlateError}
                >
                  {t('button.search').toUpperCase()}
                </Button>
                <Button
                  id="car_activity__clear_all_btn"
                  color="secondary"
                  className={[
                    classes.buttonClearAllFilters,
                    classes.buttonWithoutShadow,
                    classes.buttonOverridePadding,
                    !isEnableFilterButton ? classes.displayNone : '',
                  ].join(' ')}
                  onClick={() => clearFilters()}
                >
                  X {t('button.clearAll')}
                </Button>
              </Grid>
              <Grid
                item
                className={[classes.filter, 'filter-model'].join(' ')}
                xs={12}
                sm={6}
                md={3}
                lg={2}
                xl={2}
              >
                <Autocomplete
                  autoHighlight
                  id="location-select-list"
                  options={locationOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('carActivity.location.all')}
                      variant="outlined"
                      placeholder={t('all')}
                    />
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value || value.value === 'all'
                  }
                  value={selectedLocation || defaultLocation}
                  defaultValue={selectedLocation || defaultLocation}
                  onChange={(_event, value) => onSetSelectedLocation(value)}
                />
              </Grid>
              <Grid
                item
                className={[classes.filter, classes.textRight].join(' ')}
                xs={6}
                sm={6}
                md={2}
                lg={1}
                xl={1}
              >
                {/* <Button
                  color="primary"
                  variant="contained"
                  disabled={isFetchingBrands || isFetchingActivities}
                  className={[classes.buttonWithoutShadow, classes.buttonExport].join(' ')}
                >
                  {t('button.export').toUpperCase()}
                </Button> */}
                <ButtonExport
                  id="car_activity__export_btn"
                  fullWidth
                  variant="contained"
                  disabled={isFetchingBrands || isFetchingActivities}
                >
                  <CsvButton
                    data={csvData}
                    headers={csvHeaders}
                    filename={t('sidebar.carActivity') + '.csv'}
                  >
                    {t('button.export').toUpperCase()}
                  </CsvButton>
                </ButtonExport>
              </Grid>
            </Grid>
          </div>

          <Fragment>
            <TableContainer component={Paper} className={classes.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.locationService')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.brand')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.model')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.color')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.plateNumber')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.owner')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={classes.textBoldBorder}>
                        {t('carActivity.table.header.reseller')}
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
            <Card>
              <div className={classes.paginationContrainer}>
                Rows per page:&nbsp;
                <FormControl className={classes.inlineElement} variant="standard">
                  <Select
                    value={carActivitiesData?.pagination?.size || pageSize}
                    defaultValue={carActivitiesData?.pagination?.size || pageSize}
                    onChange={(event) => {
                      setPage(1)
                      setPageSize(event.target.value as number)
                    }}
                  >
                    {config.tableRowsPerPageOptions.map((rowOption) => {
                      return (
                        <MenuItem key={rowOption} value={rowOption}>
                          {rowOption}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <Pagination
                  count={carActivitiesData?.pagination?.totalPage}
                  page={carActivitiesData?.pagination?.page || page}
                  defaultPage={carActivitiesData?.pagination?.page || page}
                  variant="text"
                  color="primary"
                  onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value)
                  }}
                />
              </div>
            </Card>
          </Fragment>
          <ActivityScheduleDialog
            visible={visibleAddDialog}
            carId={carId}
            onClose={handleOnScheduleDialogClose}
          />
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
