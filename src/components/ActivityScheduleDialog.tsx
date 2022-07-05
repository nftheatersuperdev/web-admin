import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import styled from 'styled-components'
import { validateRemarkText } from 'utils'
import DatePicker from 'components/DatePicker'
import { useActivityServiceList } from 'pages/CarActivity/utils'
import type { ServiceSchedule } from 'pages/CarActivityDetail'

interface Props {
  visible: boolean
  serviceSchedule?: ServiceSchedule | null
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

const defaultState = {
  startDate: dayjs(),
  endDate: dayjs().add(1, 'day'),
  service: '',
  remark: '',
}
const maxDate = dayjs().add(5, 'year')

export default function ActivityScheduleDialog({
  visible,
  serviceSchedule,
  onClose,
}: Props): JSX.Element {
  const { t } = useTranslation()
  const activityServiceList = useActivityServiceList(t)
  const isEdit = !!serviceSchedule

  const [state, setState] = useState<DataState>(defaultState)
  const [mockError, setMockError] = useState<boolean>(false)
  const [remarkError, setRemarkError] = useState<string>('')

  useEffect(() => {
    if (!isEdit) {
      setState(defaultState)
    }
  }, [isEdit])

  useEffect(() => {
    if (isEdit && serviceSchedule) {
      setState({
        startDate: dayjs(serviceSchedule?.startDate),
        endDate: dayjs(serviceSchedule?.endDate),
        service: serviceSchedule?.service || '',
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
    setMockError(false)
    onClose()
  }

  const handleOnSave = () => {
    setMockError(true)
  }

  const handleOnStartDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    if (date) {
      setState({
        ...state,
        startDate: date,
        endDate: date.add(1, 'day'),
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
    setState({
      ...state,
      remark: '',
    })
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
    } else {
      setState({
        ...state,
        remark: value,
      })
    }
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
                minDate={isEdit ? state.startDate : dayjs()}
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
                maxDate={maxDate}
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
                >
                  {activityServiceList.map((service, index) => {
                    return (
                      <MenuItem key={`${index}-${service.id}`} value={service.id}>
                        {service.label}
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
                onChange={(event) => handleOnRemarksChange(event.target.value)}
              />
            </Grid>
          </Grid>
          {mockError && (
            <div>
              <br />
              <Alert severity="error">
                Sorry, Your schedule is overlap with Schedule ID{' '}
                <u>595de56d-aaa8-411d-a36c-ed64868fcb96</u> Please choose new date.
              </Alert>
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
