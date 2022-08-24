/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
import dayjs, { Dayjs } from 'dayjs'
import React, { Fragment, useEffect, useState, useMemo } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import Pagination from '@material-ui/lab/Pagination'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { makeStyles } from '@material-ui/core/styles'
import { DEFAULT_DATE_FORMAT, validateKeywordText } from 'utils'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
import NoResultCard from 'components/NoResultCard'
import { getActivities } from 'services/web-bff/car-activity'
import { getCarBrands } from 'services/web-bff/car-brand'
import { CarBrand, CarModel, CarSku as CarColor } from 'services/web-bff/car-brand.type'

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
})

const useQueryString = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export default function CarActivity(): JSX.Element {
  const classes = useStyles()
  const { t } = useTranslation()
  const history = useHistory()
  const queryString = useQueryString()

  const defaultSelectList = {
    brandAll: { id: 'all', name: t('all'), carModels: [] },
    modelEmpty: {
      id: 'empty',
      name: `-${t('carActivity.model.emptyValue')}-`,
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
    colorEmpty: { id: 'empty', color: `-${t('carActivity.color.emptyValue')}-`, cars: [] },
    colorAll: { id: 'all', color: t('all'), cars: [] },
  }

  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [carId, setCarId] = useState<string>('')
  const [visibleScheduleDialog, setVisibleScheduleDialog] = useState<boolean>(false)
  const [filterPlate, setFilterPlate] = useState<string>('')
  const [filterPlateError, setFilterPlateError] = useState<string>('')
  const [filterBrandObject, setFilterBrandObject] = useState<CarBrand | null>()
  const [filterModelObject, setFilterModelObject] = useState<CarModel | null>()
  const [filterColorObject, setFilterColorObject] = useState<CarColor | null>()
  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterModel, setFilterModel] = useState<string>('')
  const [filterColor, setFilterColor] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterStartDate, setFilterStartDate] = useState<MaterialUiPickersDate | Dayjs>(dayjs())
  const [resetFilters, setResetFilters] = useState<boolean>(false)
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [carColors, setCarColors] = useState<CarColor[]>([])
  const applyFilters =
    !!filterPlate ||
    !!filterBrand ||
    !!filterModel ||
    !!filterColor ||
    !!filterStatus ||
    filterStartDate?.format(DEFAULT_DATE_FORMAT) !== dayjs().format(DEFAULT_DATE_FORMAT)

  const { data: carBrands, isFetched: isFetchedBrands } = useQuery('get-car-brands', () =>
    getCarBrands()
  )
  const {
    data: carActivitiesData,
    refetch,
    isFetched: isFetchedActivities,
  } = useQuery('get-car-activities', () =>
    getActivities({
      page,
      size: pageSize,
      carBrandId: filterBrand,
      carModelId: filterModel,
      carSkuId: filterColor,
      plateNumber: filterPlate,
    })
  )

  const checkAndRenderValue = (value: string) => {
    if (!value) {
      return '-'
    }
    return value
  }

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
            {/* <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate} colSpan={2}>
            Reparing #1
          </TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
          <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell> */}
            <TableCell className={classes.tableColumnActions}>
              <Button
                onClick={() => {
                  /**
                   * @TODO need to set the carId below
                   */
                  setCarId(carActivity.carId)
                  setVisibleScheduleDialog(true)
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
  }, [])

  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [pages, page, pageSize])

  /**
   * Use for filtering data by query strings.
   */
  useEffect(() => {
    if (isFetchedBrands && carBrands && carBrands?.length > 0) {
      const plate = queryString.get('plate')
      const brandId = queryString.get('brand')
      const modelId = queryString.get('model')
      const colorId = queryString.get('color')

      setFilterPlate(plate || '')

      const brand = carBrands.find((carBrand) => carBrand.id === brandId)
      setFilterBrand(brand?.id || '')
      setFilterBrandObject(brand)
      setCarModels(brand?.carModels || [])

      const model = brand?.carModels.find((carModel) => carModel.id === modelId)
      setFilterModel(model?.id || '')
      setFilterModelObject(model)
      setCarColors(model?.carSkus || [])

      const color = model?.carSkus.find((carSku) => carSku.id === colorId)
      setFilterColor(color?.id || '')
      setFilterColorObject(color)

      refetch()
    }
  }, [isFetchedBrands, isFetchedActivities])

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
    setVisibleScheduleDialog(false)
  }

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
    setFilterStatus('')
    setFilterStartDate(dayjs())
    setCarModels([])
    setCarColors([])
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

    if (isKeywordAccepted && value.length >= 2) {
      setFilterPlate(value)
    } else if (value !== '') {
      setFilterPlateError(t('carActivity.plateNumber.errors.invalidFormat'))
    } else {
      setFilterPlate('')
      setResetFilters(true)
    }
  }

  const handleOnEnterPlateChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleOnClickFilters()
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

  const handleOnStatusChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const status = event.target.value as string
    if (status) {
      setFilterStatus(status)
    }
  }

  const handleOnStartDateSelected = (date: MaterialUiPickersDate | Dayjs) => {
    setFilterStartDate(date)
  }

  return (
    <Page>
      <Typography variant="h5" component="h1" gutterBottom>
        {t('sidebar.carActivity')}
      </Typography>
      <Breadcrumbs>
        <Link to="/">{t('carActivity.breadcrumbs.vehicle')}</Link>
        <Typography color="textPrimary">{t('sidebar.carActivity')}</Typography>
      </Breadcrumbs>
      <div className={classes.searchWrapper}>
        {/* <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={9} sm={9} lg={5}>
            <Grid container spacing={1}>
              <Grid item xs={8} sm={9}>
                <FormControl variant="outlined" className={classes.fullWidth}>
                  <TextField
                    error={!!filterPlateError}
                    helperText={filterPlateError}
                    fullWidth
                    variant="outlined"
                    label={t('carActivity.plateNumber.label')}
                    placeholder={t('carActivity.plateNumber.placeholder')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleOnPlateChange}
                    onKeyDown={handleOnEnterPlateChange}
                    value={filterPlate}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} sm={3} lg={7}>
            <div className={classes.textRight}>
              <Button variant="contained" color="primary" className={classes.buttonWithoutShadow}>
                {t('button.export')}
              </Button>
            </div>
          </Grid>
        </Grid> */}
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
                fullWidth
                variant="outlined"
                label={t('carActivity.plateNumber.label')}
                placeholder={t('carActivity.plateNumber.placeholder')}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleOnPlateChange}
                onKeyDown={handleOnEnterPlateChange}
                value={filterPlate}
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
            className={[classes.hide, 'filter-status'].join(' ')}
            xs={12}
            sm={6}
            md={2}
            lg={2}
            xl={1}
          >
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="status-label">{t('carActivity.status.label')}</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label={t('carActivity.status.label')}
                onChange={handleOnStatusChange}
                value={filterStatus}
                defaultValue={filterStatus}
              >
                <MenuItem value="in_use">{t('car.statuses.inUse')}</MenuItem>
                <MenuItem value="available">{t('car.statuses.available')}</MenuItem>
                <MenuItem value="out_of_service">{t('car.statuses.outOfService')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            className={[classes.hide, 'filter-start-date'].join(' ')}
            xs={12}
            sm={6}
            md={4}
            lg={2}
            xl={2}
          >
            <FormControl variant="outlined" className={classes.fullWidth}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.startDate.label')}
                id="selectedFromDate"
                name="selectedFromDate"
                format="DD/MM/YYYY"
                onChange={handleOnStartDateSelected}
                value={filterStartDate}
                defaultValue={filterStartDate}
              />
            </FormControl>
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
              disabled={!applyFilters}
            >
              {t('button.filter')}
            </Button>
            <Button
              color="secondary"
              className={[
                classes.buttonClearAllFilters,
                classes.buttonWithoutShadow,
                classes.buttonOverridePadding,
                !applyFilters ? classes.displayNone : '',
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
            <Button variant="contained" color="primary" className={classes.buttonWithoutShadow}>
              {t('button.export')}
            </Button>
          </Grid>
        </Grid>
      </div>

      {isNoData ? (
        <NoResultCard />
      ) : (
        <Fragment>
          <TableContainer component={Paper} className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableColumnCarInfo}>
                    <div className={classes.textBold}>{t('carActivity.car.label')}</div>
                    <div className={classes.subText}>
                      {t('carActivity.totalCars.label', {
                        total: carActivitiesData?.pagination?.totalRecords || 0,
                      })}
                    </div>
                  </TableCell>
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell
                    className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}
                  />
                  <TableCell className={[classes.tableColumnActions, classes.textBold].join(' ')}>
                    {t('carActivity.action.label')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{carActivities}</TableBody>
            </Table>
          </TableContainer>
          <Card>
            <div className={classes.paginationContrainer}>
              Rows per page:&nbsp;
              <FormControl className={classes.inlineElement}>
                <Select
                  value={carActivitiesData?.pagination?.size || pageSize}
                  defaultValue={carActivitiesData?.pagination?.size || pageSize}
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
                count={carActivitiesData?.pagination?.totalPage || pages}
                page={carActivitiesData?.pagination?.page || page}
                defaultPage={carActivitiesData?.pagination?.page || page}
                variant="text"
                shape="rounded"
                onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                  setPage(value)
                }}
              />
            </div>
          </Card>
        </Fragment>
      )}
      <ActivityScheduleDialog
        visible={visibleScheduleDialog}
        carId={carId}
        onClose={handleOnScheduleDialogClose}
      />
    </Page>
  )
}
