import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import dayjs, { Dayjs } from 'dayjs'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Alert from '@material-ui/lab/Alert'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { validateRemarkText, DEFAULT_DATE_FORMAT_BFF } from 'utils'
import DatePicker from 'components/DatePicker'
import { createSchedule, editSchedule, getScheduleServices } from 'services/web-bff/car-activity'
import { Schedule, CarActivityBookingTypeIds } from 'services/web-bff/car-activity.type'

interface Props {
  visible: boolean
  carId?: string
  serviceSchedule?: Schedule | null
  onClose: (refetch?: boolean) => void
}

interface DataState {
  startDate: MaterialUiPickersDate | Dayjs
  endDate: MaterialUiPickersDate | Dayjs
  service: string
  remark: string
}

const SpaceButtons = styled.div`
  padding: 15px;

  & button {
    margin-left: 15px;
  }
`

export default function ActivityScheduleDialog({
  visible,
  carId,
  serviceSchedule,
  onClose,
}: Props): JSX.Element {
  const { t, i18n } = useTranslation()
  const isEdit = !!serviceSchedule
  const isThaiLanguage = i18n.language === 'th'

  const todayDate = dayjs()
  const defaultState = {
    startDate: todayDate.startOf('day'),
    endDate: todayDate.endOf('day'),
    service: '',
    remark: '',
  }

  const [state, setState] = useState<DataState>(defaultState)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string>('')
  const [remarkError, setRemarkError] = useState<string>('')

  const { data: activityServiceList, isFetched: isFetchedServices } = useQuery(
    'schedule-services',
    () => getScheduleServices()
  )

  const startMaxDate = defaultState.startDate.add(1, 'year')
  const endDateMaxDate = state.startDate
    ? state.startDate.add(5, 'year')
    : todayDate.add(5, 'years')
  const isDisableStartDate =
    isEdit && dayjs(serviceSchedule?.startDate).diff(todayDate, 'day', true) <= 0 ? true : false
  const isDisableMinStartDate = !!isDisableStartDate

  useEffect(() => {
    if (isEdit && serviceSchedule) {
      setState({
        startDate: dayjs(serviceSchedule?.startDate),
        endDate: dayjs(serviceSchedule?.endDate),
        service: String(serviceSchedule?.bookingType.id) || '',
        remark: serviceSchedule?.remark || '',
      })
    }
  }, [isEdit, serviceSchedule])

  const isUnableToSave =
    !state.startDate ||
    !state.service ||
    !state.service ||
    (state.endDate && state.endDate < state.startDate) ||
    !!remarkError

  const handleOnClose = () => {
    setState(defaultState)
    setRemarkError('')
    setSubmitErrorMessage('')
    onClose()
  }

  const handleOnSave = async () => {
    if (carId && state.startDate && state.endDate) {
      const requestToApi =
        isEdit && serviceSchedule
          ? editSchedule({
              bookingId: serviceSchedule.bookingId,
              bookingDetailId: serviceSchedule.bookingDetailId,
              data: {
                remark: state.remark,
                startDate: state.startDate.format(DEFAULT_DATE_FORMAT_BFF),
                endDate: state.endDate.format(DEFAULT_DATE_FORMAT_BFF),
              },
            })
          : createSchedule({
              carId,
              bookingTypeId: state.service,
              remark: state.remark,
              startDate: state.startDate.format(DEFAULT_DATE_FORMAT_BFF),
              endDate: state.endDate.format(DEFAULT_DATE_FORMAT_BFF),
            })

      await toast.promise(requestToApi, {
        loading: t('toast.loading'),
        success: () => {
          handleOnClose()
          return t('carActivity.createDialog.success')
        },
        error: (error) => {
          if (error.message) {
            setSubmitErrorMessage(error.message)
            return error.message
          } else if (error.data.status) {
            setSubmitErrorMessage(error.data.message)
            return error.data.message
          }
          return t('error.unknown')
        },
      })
    }
  }

  const handleOnStartDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    if (date) {
      setState({
        ...state,
        startDate: date,
        endDate: date,
      })
    }
  }

  const handleOnEndDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    setState({
      ...state,
      endDate: date,
    })
  }

  const handleOnServiceChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setState({
      ...state,
      service: event.target.value as string,
    })
  }

  const handleOnRemarksChange = (value: string) => {
    setRemarkError('')
    const isRemarkAccepted = validateRemarkText(value)

    if (value === '') {
      setState({
        ...state,
        remark: value,
      })
    } else if (!isRemarkAccepted) {
      setRemarkError(t('carActivity.remark.errors.invalidFormat'))
    } else if (value.length > 100) {
      setRemarkError(t('carActivity.remark.errors.invalidLength'))
    }
    setState({
      ...state,
      remark: value,
    })
  }

  return (
    <div>
      <Dialog open={visible} onClose={handleOnClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {isEdit ? t('carActivity.editSchedule.header') : t('carActivity.addSchedule.header')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                fullWidth
                inputVariant="outlined"
                label={t('carActivity.startDate.label')}
                id="selectedFromDate"
                name="selectedFromDate"
                format="DD/MM/YYYY"
                value={state.startDate}
                onChange={handleOnStartDateChange}
                minDate={isDisableMinStartDate ? undefined : todayDate}
                maxDate={startMaxDate}
                disabled={isDisableStartDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                fullWidth
                inputVariant="outlined"
                label={t('carActivity.endDate.label')}
                id="selectedFromDate"
                name="selectedFromDate"
                format="DD/MM/YYYY"
                value={state.endDate}
                onChange={handleOnEndDateChange}
                minDate={state.startDate}
                maxDate={endDateMaxDate}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="service">{t('carActivity.service.label')}</InputLabel>
                <Select
                  label={t('carActivity.service.label')}
                  defaultValue={state.service}
                  value={state.service}
                  onChange={handleOnServiceChange}
                  inputProps={{
                    name: 'service',
                    id: 'service',
                  }}
                  disabled={!isFetchedServices}
                >
                  {activityServiceList &&
                    activityServiceList.length > 0 &&
                    activityServiceList
                      .filter((service) => service.id !== CarActivityBookingTypeIds.RENT)
                      .map((service, index) => {
                        return (
                          <MenuItem key={`${index}-${service.id}`} value={service.id}>
                            {isThaiLanguage ? service.nameTh : service.nameEn}
                          </MenuItem>
                        )
                      })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!!remarkError}
                helperText={remarkError}
                fullWidth
                label={t('carActivity.remark.label')}
                variant="outlined"
                value={state.remark}
                onChange={(event) => handleOnRemarksChange(event.target.value)}
              />
            </Grid>
          </Grid>
          {submitErrorMessage && (
            <div>
              <br />
              <Alert severity="error">{submitErrorMessage}</Alert>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <SpaceButtons>
            <Button onClick={handleOnClose} variant="contained" color="secondary">
              {t('button.cancel')}
            </Button>
            <Button
              onClick={handleOnSave}
              variant="contained"
              color="primary"
              disabled={isUnableToSave}
            >
              {t('button.save')}
            </Button>
          </SpaceButtons>
        </DialogActions>
      </Dialog>
    </div>
  )
}
