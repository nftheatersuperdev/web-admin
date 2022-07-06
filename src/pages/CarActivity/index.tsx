/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import carBrandsJson from 'data/car-brands.json'
import carModelsJson from 'data/car-models.json'
import carColorsJson from 'data/car-colors.json'
import carActivitiesJson from 'data/car-activity.json'
import { DEFAULT_DATE_FORMAT, validateKeywordText } from 'utils'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'

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
  buttonWithoutShadow: {
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
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
    borderLeft: '1px solid #DDD',
    borderRight: '1px solid #DDD',
  },
  tableColumnDate: {
    minWidth: '200px',
    borderLeft: '1px solid #DDD',
    borderRight: '1px solid #DDD',
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
})

export interface CarBrand {
  id: string
  name: string
}
export interface CarModel {
  id: string
  name: string
  brand_id: string
}
export interface CarColor {
  id: string
  name: string
  brand_id: string
  model_id: string
}
export interface Activity {
  id: string
  carModel: {
    brand_name: string
    model_name: string
    color_name: string
  }
  plateNumber: string
}
export enum CarStatus {
  InUse = 'in_use',
  Available = 'available',
  OutOfService = 'out_of_service',
}

export default function CarActivity(): JSX.Element {
  const classes = useStyles()
  const { t } = useTranslation()

  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [activities, setActivities] = useState<Activity[]>([])
  const [visibleScheduleDialog, setVisibleScheduleDialog] = useState<boolean>(false)
  const [searchPlate, setSearchPlate] = useState<string>('')
  const [searchPlateError, setSearchPlateError] = useState<string>('')
  const [filterBrandObject, setFilterBrandObject] = useState<CarBrand | null>()
  const [filterModelObject, setFilterModelObject] = useState<CarModel | null>()
  const [filterColorObject, setFilterColorObject] = useState<CarColor | null>()
  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterModel, setFilterModel] = useState<string>('')
  const [filterColor, setFilterColor] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterStartDate, setFilterStartDate] = useState<MaterialUiPickersDate | Dayjs>(dayjs())
  const [carBrands, setCarBrands] = useState<CarBrand[]>([])
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [carColors, setCarColors] = useState<CarColor[]>([])
  const applyFilters =
    !!searchPlate ||
    !!filterBrand ||
    !!filterModel ||
    !!filterColor ||
    !!filterStatus ||
    filterStartDate?.format(DEFAULT_DATE_FORMAT) !== dayjs().format(DEFAULT_DATE_FORMAT)

  const fetchData = () => {
    const filterIndex = (page - 1) * pageSize
    const minIndex = filterIndex
    const maxIndex = filterIndex + pageSize
    const data = carActivitiesJson.activities.filter((activity, index) => {
      if (index < maxIndex && index >= minIndex) {
        return activity
      }
      return null
    })
    setActivities(data)

    const totalPages = Math.ceil(carActivitiesJson.activities.length / pageSize)
    setPages(totalPages)
  }

  useEffect(() => {
    setCarBrands(carBrandsJson)
  }, [])

  useEffect(() => {
    fetchData()
  }, [pages, page, pageSize])

  useEffect(() => {
    setPage(1)
  }, [pageSize])

  const carActivities =
    activities.map((carActivity) => {
      return (
        <TableRow key={carActivity.id}>
          <TableCell className={classes.tableColumnCarInfo}>
            <Link to={`/car-activity/${carActivity.id}`} className={classes.link}>
              <div className={classes.textBold}>{carActivity.carModel.brand_name}</div>
              <div className={classes.textBold}>{carActivity.plateNumber}</div>
              <div className={classes.subText}>
                <div>{carActivity.carModel.model_name}</div>
                <div>{carActivity.carModel.color_name}</div>
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
            <Button onClick={() => setVisibleScheduleDialog(true)} type="button">
              <span className={classes.textBold}>+</span>
            </Button>
          </TableCell>
        </TableRow>
      )
    }) || []

  const handleOnScheduleDialogClose = () => {
    setVisibleScheduleDialog(false)
  }

  const clearFilters = () => {
    setSearchPlate('')
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
  }

  const handleOnSearchPlate = () => {
    // console.log('handleOnSearchPlate ->', {
    //   searchPlate,
    // })
  }

  const handleOnClickFilters = () => {
    // console.log('handleOnClickFilters ->', {
    //   filterBrand,
    //   filterModel,
    //   filterColor,
    //   filterStatus,
    //   filterStartDate,
    // })
  }

  const handleOnPlateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const isKeywordAccepted = validateKeywordText(value)

    setSearchPlate(value)
    setSearchPlateError('')

    if (isKeywordAccepted && value.length >= 2) {
      setSearchPlate(value)
    } else if (value !== '') {
      setSearchPlateError(t('carActivity.plateNumber.errors.invalidFormat'))
    } else {
      setSearchPlate('')
    }
  }

  const handleOnBrandChange = (brandId: string) => {
    setCarModels([])
    setFilterModelObject(null)
    setFilterColorObject(null)
    if (brandId) {
      setFilterBrand(brandId)
      setCarModels(carModelsJson.filter(({ brand_id }) => brand_id === brandId) || [])
    }
  }

  const handleOnModelChange = (modelId: string) => {
    setCarColors([])
    setFilterColorObject(null)
    if (modelId) {
      setFilterModel(modelId)
      setCarColors(carColorsJson.filter((carColor) => carColor.model_id === modelId) || [])
    }
  }

  const handleOnColorChange = (colorId: string) => {
    if (colorId) {
      setFilterColor(colorId)
    }
  }

  const handleOnStatusChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const status = event.target.value as CarStatus
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
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={9} sm={9} lg={5}>
            <Grid container spacing={1}>
              <Grid item xs={8} sm={9}>
                <FormControl variant="outlined" className={classes.fullWidth}>
                  <TextField
                    error={!!searchPlateError}
                    helperText={searchPlateError}
                    fullWidth
                    variant="outlined"
                    label={t('carActivity.plateNumber.label')}
                    placeholder={t('carActivity.plateNumber.placeholder')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={handleOnPlateChange}
                    value={searchPlate}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonWithoutShadow}
                  type="submit"
                  disabled={!searchPlate || !!searchPlateError}
                  onClick={() => handleOnSearchPlate()}
                >
                  {t('button.search')}
                </Button>
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
        </Grid>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          className={classes.gridContainer}
        >
          <Grid item className="filter-brand" xs={6} sm={4} md={2} lg={2} xl={1}>
            <Autocomplete
              autoHighlight
              id="brand-select-list"
              options={carBrands}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label={t('carActivity.brand.label')} variant="outlined" />
              )}
              value={filterBrandObject || null}
              defaultValue={filterBrandObject || null}
              onChange={(_event, value) => {
                if (value || value === '') {
                  setFilterBrandObject(value)
                  handleOnBrandChange(value.id)
                }
              }}
            />
          </Grid>
          <Grid item className="filter-model" xs={6} sm={4} md={2} lg={2} xl={1}>
            <Autocomplete
              autoHighlight
              id="model-select-list"
              disabled={carModels.length < 1}
              options={carModels}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label={t('carActivity.model.label')} variant="outlined" />
              )}
              value={filterModelObject || null}
              defaultValue={filterModelObject || null}
              onChange={(_event, value) => {
                if (value || value === '') {
                  setFilterModelObject(value)
                  handleOnModelChange(value.id)
                }
              }}
            />
          </Grid>
          <Grid item className="filter-color" xs={6} sm={4} md={2} lg={2} xl={1}>
            <Autocomplete
              autoHighlight
              id="color-select-list"
              disabled={carColors.length < 1}
              options={carColors}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label={t('carActivity.color.label')} variant="outlined" />
              )}
              value={filterColorObject || null}
              defaultValue={filterColorObject || null}
              onChange={(_event, value) => {
                if (value || value === '') {
                  setFilterColorObject(value)
                  handleOnColorChange(value.id)
                }
              }}
            />
          </Grid>
          <Grid item className="filter-status" xs={6} sm={4} md={2} lg={2} xl={1}>
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
                <MenuItem value="in_use">In Use</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="out_of_service">Out Of Service</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item className="filter-start-date" xs={12} sm={8} md={4} lg={2} xl={2}>
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
          <Grid item className="filter-buttons" xs={12} sm={12} md={12} lg={2}>
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
                classes.buttonWithoutShadow,
                !applyFilters ? classes.displayNone : '',
              ].join(' ')}
              onClick={() => clearFilters()}
            >
              X {t('button.clearAll')}
            </Button>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableColumnCarInfo}>
                <div className={classes.textBold}>Car</div>
                <div className={classes.subText}>
                  Total {carActivitiesJson.pagination.total} Cars
                </div>
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                1 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                2 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                3 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                4 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                5 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                6 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                7 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                8 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                9 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnDateHeader, classes.textBold].join(' ')}>
                10 TUE JUNE
              </TableCell>
              <TableCell className={[classes.tableColumnActions, classes.textBold].join(' ')}>
                Actions
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
              value={pageSize}
              defaultValue={pageSize}
              onChange={(event: ChangeEvent<{ name?: string; value: unknown }>) =>
                setPageSize(event.target.value as number)
              }
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Pagination
            count={pages}
            variant="text"
            shape="rounded"
            onChange={(_event: ChangeEvent<unknown>, value: number) => {
              setPage(value)
            }}
          />
        </div>
      </Card>

      <Card className={classes.hide}>
        <pre>Plate: {JSON.stringify(searchPlate, null, 2)}</pre>
        <pre>
          Filters:
          <br />
          {JSON.stringify(
            {
              filterBrand,
              filterModel,
              filterColor,
              filterStatus,
              filterStartDate,
            },
            null,
            2
          )}
        </pre>
      </Card>

      <ActivityScheduleDialog
        visible={visibleScheduleDialog}
        onClose={handleOnScheduleDialogClose}
      />
    </Page>
  )
}
