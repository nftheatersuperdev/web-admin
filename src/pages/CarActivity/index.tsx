/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  Button,
  Card,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
  TableCell,
  TableRow,
  InputAdornment,
} from '@material-ui/core'
import {
  GridColDef,
  GridPageChangeParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@material-ui/data-grid'
import Pagination from '@material-ui/lab/Pagination'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import { Search as SearchIcon } from '@material-ui/icons'
import { validateKeywordText } from 'utils'
import config from 'config'
import { Page } from 'layout/LayoutRoute'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
import NoResultCard from 'components/NoResultCard'
import Backdrop from 'components/Backdrop'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import DataGridLocale from 'components/DataGridLocale'
import { getActivities } from 'services/web-bff/car-activity'
import { getCarBrands } from 'services/web-bff/car-brand'
import { CarBrand, CarModel, CarSku as CarColor } from 'services/web-bff/car-brand.type'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

// interface CarActivityParams {
//   plate: string
//   brand: string
//   model: string
//   color: string
// }

const useStyles = makeStyles({
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
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
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
})

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
  const [carId, setCarId] = useState<string>('')
  const [visibleAddDialog, setVisibleAddDialog] = useState<boolean>(false)
  const [filterPlateError, setFilterPlateError] = useState<string>('')
  const [filterBrandObject, setFilterBrandObject] = useState<CarBrand | null>()
  const [filterModelObject, setFilterModelObject] = useState<CarModel | null>()
  const [filterColorObject, setFilterColorObject] = useState<CarColor | null>()
  const [filterPlate, setFilterPlate] = useState<string>(qs.plate || '')
  const [filterBrand, setFilterBrand] = useState<string>(qs.brand || '')
  const [filterModel, setFilterModel] = useState<string>(qs.model || '')
  const [filterColor, setFilterColor] = useState<string>(qs.color || '')
  const [resetFilters, setResetFilters] = useState<boolean>(false)
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [carColors, setCarColors] = useState<CarColor[]>([])

  const visibilityColumns = getVisibilityColumns()

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
      }
    )
  )

  const checkAndRenderValue = (value: string) => {
    if (!value) {
      return '-'
    }
    return value
  }

  const rowCount = carActivitiesData?.pagination?.totalRecords ?? 0
  const rows =
    carActivitiesData?.cars.map((carActivity) => {
      return {
        id: carActivity.carId,
        brandName: carActivity.brandName,
        modelName: carActivity.modelName,
        color: carActivity.color,
        plateNumber: carActivity.plateNumber,
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'brandName',
      headerName: t('carActivity.brand.label'),
      description: t('carActivity.brand.label'),
      hide: !visibilityColumns.brandName,
      flex: 1,
      sortable: false,
    },
    {
      field: 'modelName',
      headerName: t('carActivity.model.label'),
      description: t('carActivity.model.label'),
      hide: !visibilityColumns.modelName,
      flex: 1,
      sortable: false,
    },
    {
      field: 'color',
      headerName: t('carActivity.color.label'),
      description: t('carActivity.color.label'),
      hide: !visibilityColumns.color,
      flex: 1,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('carActivity.plateNumber.label'),
      description: t('carActivity.plateNumber.label'),
      hide: !visibilityColumns.plateNumber,
      flex: 1,
      sortable: false,
    },
  ]

  const carActivities =
    (carActivitiesData &&
      carActivitiesData.cars?.length > 0 &&
      carActivitiesData.cars.map((carActivity) => {
        return (
          <TableRow key={`car-activity-${carActivity.carId}`}>
            <TableCell className={classes.tableColumnCarInfo}>
              <Link to={`/car-activity/${carActivity.carId}`} className={classes.link}>
                <div className={classes.textBold}>{checkAndRenderValue(carActivity.brandName)}</div>
                <div className={classes.textBold}>
                  {checkAndRenderValue(carActivity.plateNumber)}
                </div>
                <div className={classes.subText}>
                  <div>{checkAndRenderValue(carActivity.modelName)}</div>
                  <div>{checkAndRenderValue(carActivity.color)}</div>
                </div>
              </Link>
            </TableCell>
            <TableCell className={classes.tableColumnDate} colSpan={10}>
              &nbsp;
            </TableCell>
            <TableCell className={classes.tableColumnActions}>
              <Button
                onClick={() => {
                  /**
                   * @TODO need to set the carId below
                   */
                  setCarId(carActivity.carId)
                  setVisibleAddDialog(true)
                }}
                type="button"
              >
                <span className={classes.textBold}>+</span>
              </Button>
            </TableCell>
          </TableRow>
        )
      })) ||
    []

  const isNoData = carActivities.length < 1

  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (carActivitiesData?.pagination) {
      setPage(carActivitiesData.pagination.page)
      setPageSize(carActivitiesData.pagination.size)
      setPages(carActivitiesData.pagination.totalPage)
    }

    if (isFetchedBrands && isFetchedActivities && carBrands && carBrands.length >= 1) {
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

  const customToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  )

  const adjustBrowserHistory = (params = {}) => {
    const adjustParams = {
      plate: filterPlate,
      brand: filterBrand,
      model: filterModel,
      color: filterColor,
      ...params,
    }
    const validParams: {} = Object.fromEntries(
      Object.entries(adjustParams).filter(([_key, value]) => !!value)
    )
    const searchParams = new URLSearchParams(validParams)

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
    setResetFilters(true)
  }

  const handleOnClickFilters = () => {
    setPage(1) // reset current page to be 1
    setResetFilters(true)
  }

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
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
      <div className={classes.searchWrapper}>
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className={classes.gridContainer}
        >
          <Grid item className={[classes.filter].join(' ')} xs={12} sm={6} lg={3} xl={3}>
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
            lg={2}
            xl={2}
          >
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWithoutShadow}
              onClick={() => handleOnClickFilters()}
              disabled={!isEnableFilterButton}
            >
              {t('button.search')}
            </Button>
            <Button
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
            className={[classes.filter, classes.textRight].join(' ')}
            xs={6}
            sm={6}
            md={2}
            lg={1}
            xl={1}
          >
            <Button
              color="primary"
              variant="contained"
              className={[classes.buttonWithoutShadow, classes.buttonExport].join(' ')}
            >
              {t('button.export')}
            </Button>
          </Grid>
        </Grid>
      </div>

      {isNoData ? (
        <NoResultCard />
      ) : (
        <Fragment>
          <DataGridLocale
            autoHeight
            pagination
            pageSize={pageSize}
            page={page - 1}
            rowCount={rowCount}
            paginationMode="server"
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setPage}
            rows={rows}
            columns={columns}
            onColumnVisibilityChange={onColumnVisibilityChange}
            sortingMode="server"
            customToolbar={customToolbar}
            hideFooter
            onRowClick={(param) => {
              history.push(`/car-activity/${param.id}`)
            }}
          />
          <Card>
            <div className={classes.paginationContrainer}>
              Rows per page:&nbsp;
              <FormControl className={classes.inlineElement} variant="standard">
                <Select
                  value={carActivitiesData?.pagination?.size || pageSize}
                  defaultValue={carActivitiesData?.pagination?.size || pageSize}
                  onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                    setPage(0)
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
                count={carActivitiesData?.pagination?.totalPage || pages}
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
      )}
      <ActivityScheduleDialog
        visible={visibleAddDialog}
        carId={carId}
        onClose={handleOnScheduleDialogClose}
      />
      <Backdrop open={isFetchingBrands || isFetchingActivities} />
    </Page>
  )
}
