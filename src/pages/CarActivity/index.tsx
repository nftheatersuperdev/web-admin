import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Breadcrumbs,
  Button,
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
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { makeStyles } from '@material-ui/core/styles'
import carBrandsJson from 'data/car-brands.json'
import carModelsJson from 'data/car-models.json'
import carColorsJson from 'data/car-colors.json'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'

const useStyles = makeStyles({
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
    // whiteSpace: 'nowrap',
    borderLeft: '1px solid #DDD',
    borderRight: '1px solid #DDD',
  },
  tableColumnActions: {
    position: 'sticky',
    right: 0,
    background: '#fff',
    textAlign: 'center',
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
export enum CarStatus {
  Available = 'available',
  OutOfService = 'out_of_service',
}
export interface SearchValues {
  plate?: string
}
export interface FilterValues {
  brand?: string
  model?: string
  color?: string
  status?: string
  startDate?: string
}

export default function CarActivity(): JSX.Element {
  const classes = useStyles()
  const { t } = useTranslation()

  const [filterBrand, setFilterBrand] = useState<string>('')
  const [filterModel, setFilterModel] = useState<string>('')
  const [filterColor, setFilterColor] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterStartDate, setFilterStartDate] = useState<MaterialUiPickersDate | Dayjs>(dayjs())
  const [carBrands, setCarBrands] = useState<CarBrand[]>([])
  const [carModels, setCarModels] = useState<CarModel[]>([])
  const [carColors, setCarColors] = useState<CarColor[]>([])
  const noFilters = false

  useEffect(() => {
    setCarBrands(carBrandsJson)
  }, [])

  const clearFilters = () => {
    setFilterBrand('')
    setFilterModel('')
    setFilterColor('')
    setFilterStatus('')
    setFilterStartDate(dayjs())
    setCarModels([])
    setCarColors([])
  }

  const handleOnBrandChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const brandId = event.target.value as CarBrand['id']
    if (brandId) {
      setFilterBrand(brandId)
      setCarModels(carModelsJson.filter(({ brand_id }) => brand_id === brandId) || [])
    } else {
      setCarModels([])
    }
  }

  const handleOnModelChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const modelId = event.target.value as CarModel['id']
    if (modelId) {
      setFilterModel(modelId)
      setCarColors(carColorsJson.filter((carColor) => carColor.model_id === modelId) || [])
    } else {
      setCarColors([])
    }
  }

  const handleOnColorChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const colorId = event.target.value as CarColor['id']
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
        <Link to="/">Venicle</Link>
        <Typography color="textPrimary">{t('sidebar.carActivity')}</Typography>
      </Breadcrumbs>

      <div className={classes.searchWrapper}>
        <Grid container spacing={2} className={classes.gridContainer}>
          <Grid item xs={9} sm={9} lg={5}>
            <Grid container spacing={1}>
              <Grid item xs={8} sm={9}>
                <FormControl variant="outlined" className={classes.fullWidth}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Plate"
                    placeholder="Please type at lease 2 charators"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonWithoutShadow}
                  type="submit"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3} sm={3} lg={7}>
            <div className={classes.textRight}>
              <Button variant="contained" color="primary" className={classes.buttonWithoutShadow}>
                Export
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
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="brand-label">Brand</InputLabel>
              <Select
                labelId="brand-label"
                id="brand"
                label="Brand"
                onChange={handleOnBrandChange}
                value={filterBrand}
                defaultValue={filterBrand}
              >
                {carBrands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item className="filter-model" xs={6} sm={4} md={2} lg={2} xl={1}>
            <FormControl
              variant="outlined"
              className={classes.fullWidth}
              disabled={carModels.length < 1}
            >
              <InputLabel id="model-label">Model</InputLabel>
              <Select
                labelId="model-label"
                id="model"
                label="Model"
                onChange={handleOnModelChange}
                value={filterModel}
                defaultValue={filterModel}
              >
                {carModels.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item className="filter-color" xs={6} sm={4} md={2} lg={2} xl={1}>
            <FormControl
              variant="outlined"
              className={classes.fullWidth}
              disabled={carColors.length < 1}
            >
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                label="Color"
                onChange={handleOnColorChange}
                value={filterColor}
                defaultValue={filterColor}
              >
                {carColors.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    {color.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item className="filter-status" xs={6} sm={4} md={2} lg={1} xl={1}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label="Status"
                onChange={handleOnStatusChange}
                value={filterStatus}
                defaultValue={filterStatus}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="out_of_service">Out Of Service</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item className="filter-start-date" xs={12} sm={8} md={4} lg={2} xl={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <DatePicker
                inputVariant="outlined"
                label="Start Date"
                id="selectedFromDate"
                name="selectedFromDate"
                format="DD/MM/YYYY"
                onChange={handleOnStartDateSelected}
                value={filterStartDate}
                defaultValue={filterStartDate}
              />
            </FormControl>
          </Grid>
          <Grid item className="filter-buttons" xs={12} sm={12} md={12} lg={3}>
            <Button variant="contained" color="primary" className={classes.buttonWithoutShadow}>
              Filter
            </Button>
            <Button
              color="secondary"
              className={[classes.buttonWithoutShadow, noFilters ? classes.displayNone : ''].join(
                ' '
              )}
              onClick={() => clearFilters()}
            >
              X CLEAR ALL
            </Button>
          </Grid>
        </Grid>
      </div>

      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableColumnCarInfo}>Car</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>1 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>2 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>3 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>4 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>5 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>6 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>7 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>8 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>9 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnDateHeader}>10 TUE JUNE</TableCell>
              <TableCell className={classes.tableColumnActions}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableColumnCarInfo}>
                <div>TESLA</div>
                <div>กก 1234</div>
              </TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate} colSpan={2}>
                Reparing #1
              </TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnActions}>+</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className={classes.tableColumnCarInfo}>
                <div>TESLA</div>
                <div>กก 1234</div>
              </TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate} colSpan={2}>
                Reparing #1
              </TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>Reparing #2</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate} colSpan={2}>
                Reparing #3
              </TableCell>
              <TableCell className={classes.tableColumnActions}>+</TableCell>
            </TableRow>

            <TableRow>
              <TableCell className={classes.tableColumnCarInfo}>
                <div>TESLA</div>
                <div>กก 1234</div>
              </TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate} colSpan={2}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti optio facere,
                vitae tenetur corporis accusamus, quo placeat assumenda doloremque consequuntur sunt
                adipisci. Quidem dolorum, ad tempore aliquid obcaecati quaerat et.
              </TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnDate}>&nbsp;</TableCell>
              <TableCell className={classes.tableColumnActions}>+</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  )
}
