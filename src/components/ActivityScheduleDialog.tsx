import { useState } from 'react'
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
  const [state, setState] = useState<DataState>({
    startDate: dayjs(),
    endDate: dayjs(),
    service: '',
  })
  console.log('state ->', state)

  const handleOnClose = () => {
    onClose()
  }

  const handleOnStartDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    console.log(handleOnStartDateChange.name, date)
    setState({
      ...state,
      startDate: date,
    })
  }

  const handleOnEndDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    console.log(handleOnEndDateChange.name, date)
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
                label="Start Date"
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
                label="End Date"
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
                <InputLabel htmlFor="service-status">Service status</InputLabel>
                <Select
                  label="Service status"
                  value={state.service}
                  onChange={handleOnServiceChange}
                  inputProps={{
                    name: 'service-status',
                    id: 'service-status',
                  }}
                >
                  <MenuItem value="service_1">Preventive Maintenance</MenuItem>
                  <MenuItem value="service_2">Reserved</MenuItem>
                  <MenuItem value="service_3">PR</MenuItem>
                  <MenuItem value="service_4">Marketing</MenuItem>
                  <MenuItem value="service_5">Breakdown</MenuItem>
                  <MenuItem value="service_6">Repair</MenuItem>
                  <MenuItem value="service_7">EVme internal</MenuItem>
                  <MenuItem value="service_8">Carpool</MenuItem>
                  <MenuItem value="service_9">B2B delivered</MenuItem>
                  <MenuItem value="service_10">B2B pending delivery</MenuItem>
                  <MenuItem value="service_11">Red plate</MenuItem>
                  <MenuItem value="service_12">Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Remarks" fullWidth variant="outlined" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <SpaceButtons>
            <Button onClick={handleOnClose} variant="contained" color="secondary">
              Cancel
            </Button>
            <Button onClick={handleOnClose} variant="contained" color="primary">
              Save
            </Button>
          </SpaceButtons>
        </DialogActions>
      </Dialog>
    </div>
  )
}
