import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TFunction, Namespace, useTranslation } from 'react-i18next'
import {
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  MenuItem,
  IconButton,
  InputLabel,
  Select,
  Typography,
} from '@material-ui/core'
import {
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridCellParams,
} from '@material-ui/data-grid'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { makeStyles } from '@material-ui/core/styles'
import carActivitiesJson from 'data/car-activity.json'
import { DEFAULT_DATE_FORMAT } from 'utils'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import { columnFormatCarStatus, CarStatus } from 'pages/Car/utils'
import { getServiceLabel } from 'pages/CarActivity/utils'
import DataGridLocale from 'components/DataGridLocale'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
import ConfirmDialog from 'components/ConfirmDialog'

interface CarActivityDetailParams {
  id: string
}
export interface ServiceSchedule {
  id: string
  startDate: string
  endDate: string
  service: string
  status: string
  remark: string
  modifyDate: string
  modifyBy: string
}
enum ScheduleActions {
  Edit = 'edit',
  Delete = 'delete',
}

const useStyles = makeStyles({
  cardWrapper: {
    width: '100%',
    padding: '20px',
    margin: '20px 0',
  },
  marginSpace: {
    margin: '20px 0',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  hide: {
    display: 'none',
  },
  fullWidth: {
    width: '100%',
  },
  buttonWithoutShadow: {
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
  },
})

function CustomToolBar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
    </GridToolbarContainer>
  )
}

export default function CarActivityDetail(): JSX.Element {
  const classes = useStyles()
  const { id } = useParams<CarActivityDetailParams>()
  const { t } = useTranslation()

  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState<boolean>(false)
  const [serviceSchedule, setServiceSchedule] = useState<ServiceSchedule | null>(null)
  const [visibleScheduleDialog, setVisibleScheduleDialog] = useState<boolean>(false)
  const [filterStartDate, setFilterStartDate] = useState<MaterialUiPickersDate | Dayjs>(
    dayjs().startOf('day')
  )
  const [filterEndDate, setFilterEndDate] = useState<MaterialUiPickersDate | Dayjs>(
    dayjs().endOf('day').add(1, 'day')
  )
  const [filterCarStatus, setFilterCarStatus] = useState<string>('')

  const carActivity = carActivitiesJson.activities.find((activity) => activity.id === id)
  const schedules =
    carActivity?.activities && carActivity?.activities.length > 0
      ? carActivity.activities.map((activity) => {
          return activity
        })
      : []

  const handleOnClickFilters = () => {
    // console.log('handleOnClickFilters ->', {
    //   filterStartDate,
    //   filterEndDate,
    //   filterService,
    // })
  }

  const handleOnClickButton = (scheduleId: string, action: ScheduleActions) => {
    const schedule = schedules.find((row) => row.id === scheduleId)
    if (!schedule) {
      return false
    }
    setServiceSchedule(schedule)

    if (action === ScheduleActions.Edit) {
      setVisibleScheduleDialog(true)
    } else if (action === ScheduleActions.Delete) {
      setVisibleConfirmDialog(true)
    }
  }

  const handleOnCloseConfirmDialog = () => {
    setVisibleConfirmDialog(false)
    toast.promise(
      Promise.resolve(true),
      {
        loading: t('toast.loading'),
        success: 'Success message',
        error: 'Error message',
      },
      {
        duration: 5000,
      }
    )
  }

  const generatelConfirmDeleteHtml = (
    schedule: ServiceSchedule | null,
    t: TFunction<Namespace>
  ): string => {
    if (!schedule) {
      return ''
    }

    const template = `
      <div>
        <p style="margin-bottom: 20px">${t(
          'carActivity.deleteDialog.title'
        )} <strong>:scheduleId</strong>?</p>
        <div>
          <div style="clear: both;">
            <div style="width: 100px; float: left; font-weight: bold;">${t(
              'carActivity.deleteDialog.startDate'
            )}</div>
            <div style="float: left">:startDate</div>
          </div>
          <div style="clear: both;">
            <div style="width: 100px; float: left; font-weight: bold;">${t(
              'carActivity.deleteDialog.endDate'
            )}</div>
            <div style="float: left">:endDate</div>
          </div>
          <div style="clear: both;">
            <div style="width: 100px; float: left; font-weight: bold;">${t(
              'carActivity.deleteDialog.service'
            )}</div>
            <div style="float: left">:service</div>
          </div>
        </div>
      </div>
    `

    return template
      .replace(':scheduleId', schedule.id)
      .replace(':startDate', dayjs(schedule.startDate).format(DEFAULT_DATE_FORMAT))
      .replace(':endDate', dayjs(schedule.endDate).format(DEFAULT_DATE_FORMAT))
      .replace(':service', getServiceLabel(schedule.service, t))
  }

  const columns: GridColDef[] = [
    {
      field: 'startDate',
      headerName: t('carActivity.startDate.label'),
      description: t('carActivity.startDate.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.value as string).format(DEFAULT_DATE_FORMAT),
    },
    {
      field: 'endDate',
      headerName: t('carActivity.endDate.label'),
      description: t('carActivity.endDate.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.value as string).format(DEFAULT_DATE_FORMAT),
    },
    {
      field: 'id',
      headerName: t('carActivity.scheduleId.label'),
      description: t('carActivity.scheduleId.label'),
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'status',
      headerName: t('carActivity.status.label'),
      description: t('carActivity.status.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => columnFormatCarStatus(params.value as string, t),
    },
    {
      field: 'service',
      headerName: t('carActivity.service.label'),
      description: t('carActivity.service.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => getServiceLabel(params.value as string, t),
    },
    {
      field: 'remark',
      headerName: t('carActivity.remark.label'),
      description: t('carActivity.remark.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => params.value || '-',
    },
    {
      field: 'modifyDate',
      headerName: t('carActivity.modifyDate.label'),
      description: t('carActivity.modifyDate.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.value as string).format(DEFAULT_DATE_FORMAT),
    },
    {
      field: 'modifyBy',
      headerName: t('carActivity.modifyBy.label'),
      description: t('carActivity.modifyBy.label'),
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'action',
      headerName: t('carActivity.action.label'),
      description: t('carActivity.action.label'),
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const isUnableToDelete = dayjs() > dayjs(params.row.endDate)
        const hideButton = params.row.status !== CarStatus.OUT_OF_SERVICE ? classes.hide : ''
        return (
          <Fragment>
            <IconButton
              className={hideButton}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Delete)}
              disabled={isUnableToDelete}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              className={hideButton}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Edit)}
            >
              <EditIcon />
            </IconButton>
          </Fragment>
        )
      },
    },
  ]

  return (
    <Page>
      <Typography variant="h5" component="h1" gutterBottom>
        {t('sidebar.carActivity')}
      </Typography>
      <Breadcrumbs>
        <Link to="/">{t('carActivity.breadcrumbs.vehicle')}</Link>
        <Link to="/car-activity">{t('sidebar.carActivity')}</Link>
        <Typography color="textPrimary">{carActivity?.plateNumber}</Typography>
      </Breadcrumbs>

      <Card className={classes.cardWrapper}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('carActivity.overview.header')}:
        </Typography>
        <Grid className="id" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.activityId.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.id}
          </Grid>
        </Grid>
        <Grid className="brand" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.brand.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.carModel.brand_name}
          </Grid>
        </Grid>
        <Grid className="model" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.model.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.carModel.model_name}
          </Grid>
        </Grid>
        <Grid className="color" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.color.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.carModel.color_name}
          </Grid>
        </Grid>
        <Grid className="plateNumber" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.plateNumber.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.plateNumber}
          </Grid>
        </Grid>
        <Grid className="visibility" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.visibility.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {columnFormatCarStatus(carActivity?.status as string, t)}
          </Grid>
        </Grid>
      </Card>

      <Card className={classes.cardWrapper}>
        <Grid className="id" container spacing={4}>
          <Grid item xs={6}>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('sidebar.carActivity')}
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.textAlignRight}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWithoutShadow}
              onClick={() => setVisibleScheduleDialog(true)}
            >
              {t('button.add')}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.marginSpace}>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.startDate.label')}
                format="DD/MM/YYYY"
                onChange={(date) => setFilterStartDate(date)}
                value={filterStartDate}
                defaultValue={filterStartDate}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.endDate.label')}
                format="DD/MM/YYYY"
                onChange={(date) => setFilterEndDate(date)}
                value={filterEndDate}
                defaultValue={filterEndDate}
                minDate={filterStartDate}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="status-label">{t('carActivity.status.label')}</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label={t('carActivity.status.label')}
                onChange={({ target: { value } }) => setFilterCarStatus(value as string)}
                value={filterCarStatus}
                defaultValue={filterCarStatus}
              >
                <MenuItem value="in_use">{t('car.statuses.inUse')}</MenuItem>
                <MenuItem value="available">{t('car.statuses.available')}</MenuItem>
                <MenuItem value="out_of_service">{t('car.statuses.outOfService')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWithoutShadow}
              onClick={() => handleOnClickFilters()}
            >
              {t('button.filter')}
            </Button>
          </Grid>
        </Grid>

        <DataGridLocale
          className={classes.marginSpace}
          autoHeight
          pagination
          pageSize={10}
          page={1}
          rowCount={10}
          paginationMode="server"
          // onPageSizeChange={handlePageSizeChange}
          // onPageChange={setPage}
          rows={schedules}
          columns={columns}
          disableSelectionOnClick
          components={{
            Toolbar: CustomToolBar,
          }}
        />

        <ActivityScheduleDialog
          visible={visibleScheduleDialog}
          serviceSchedule={serviceSchedule}
          onClose={() => {
            setServiceSchedule(null)
            setVisibleScheduleDialog(false)
          }}
        />
        <ConfirmDialog
          open={visibleConfirmDialog}
          title={t('carActivity.deleteDialog.title')}
          htmlContent={generatelConfirmDeleteHtml(serviceSchedule, t)}
          confirmText={t('carActivity.deleteDialog.confirm')}
          cancelText={t('carActivity.deleteDialog.close')}
          onConfirm={handleOnCloseConfirmDialog}
          onCancel={() => setVisibleConfirmDialog(false)}
        />
      </Card>
    </Page>
  )
}
