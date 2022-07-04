import { useState } from 'react'
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
import styled from 'styled-components'
import DatePicker from 'components/DatePicker'

interface Props {
  visible: boolean
  onClose: (refetch?: boolean) => void
}

interface DataState {
  startDate: MaterialUiPickersDate | Dayjs
  endDate: MaterialUiPickersDate | Dayjs
  service: string
}

const SpaceButtons = styled.div`
  padding: 15px;

  & button {
    margin-left: 15px;
  }
`

export default function ActivityScheduleDialog({ visible, onClose }: Props): JSX.Element {
  const { t } = useTranslation()
  const [state, setState] = useState<DataState>({
    startDate: dayjs(),
    endDate: dayjs(),
    service: '',
  })

  const handleOnClose = () => {
    onClose()
  }

  const handleOnStartDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    setState({
      ...state,
      startDate: date,
    })
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

  return (
    <div>
      <Dialog open={visible} onClose={handleOnClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add schedule</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.startDate.label')}
                id="selectedFromDate"
                name="selectedFromDate"
                format="DD/MM/YYYY"
                value={state.startDate}
                onChange={handleOnStartDateChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.endDate.label')}
                id="selectedFromDate"
                name="selectedFromDate"
                format="DD/MM/YYYY"
                value={state.endDate}
                onChange={handleOnEndDateChange}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="service-status">
                  {t('carActivity.serviceStatus.label')}
                </InputLabel>
                <Select
                  label={t('carActivity.serviceStatus.label')}
                  value={state.service}
                  onChange={handleOnServiceChange}
                  inputProps={{
                    name: 'service-status',
                    id: 'service-status',
                  }}
                >
                  <MenuItem value="preventiveMaintenance">
                    {t('carActivity.statuses.preventiveMaintenance')}
                  </MenuItem>
                  <MenuItem value="reserved">{t('carActivity.statuses.reserved')}</MenuItem>
                  <MenuItem value="pr">{t('carActivity.statuses.pr')}</MenuItem>
                  <MenuItem value="marketing">{t('carActivity.statuses.marketing')}</MenuItem>
                  <MenuItem value="breakdown">{t('carActivity.statuses.breakdown')}</MenuItem>
                  <MenuItem value="repair">{t('carActivity.statuses.repair')}</MenuItem>
                  <MenuItem value="internal">{t('carActivity.statuses.internal')}</MenuItem>
                  <MenuItem value="carpool">{t('carActivity.statuses.carpool')}</MenuItem>
                  <MenuItem value="b2bDelivered">{t('carActivity.statuses.b2bDelivered')}</MenuItem>
                  <MenuItem value="b2bPendingDelivered">
                    {t('carActivity.statuses.b2bPendingDelivered')}
                  </MenuItem>
                  <MenuItem value="redPlate">{t('carActivity.statuses.redPlate')}</MenuItem>
                  <MenuItem value="other">{t('carActivity.statuses.other')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label={t('carActivity.remarks.label')} fullWidth variant="outlined" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <SpaceButtons>
            <Button onClick={handleOnClose} variant="contained" color="secondary">
              {t('button.cancel')}
            </Button>
            <Button onClick={handleOnClose} variant="contained" color="primary">
              {t('button.save')}
            </Button>
          </SpaceButtons>
        </DialogActions>
      </Dialog>
    </div>
  )
}
