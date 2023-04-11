/* eslint-disable react/jsx-props-no-spreading */
import styled from 'styled-components'
import { Button, Grid, TextField } from '@material-ui/core'
import { DEFAULT_DATE_FORMAT } from 'utils'
import { useState } from 'react'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import DatePicker from 'components/DatePicker'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const ContainerWrapper = styled.div`
  padding: 10px 0;
`

interface FilterBarProps {
  onChange?: () => void
}

export default function FilterBar({ onChange }: FilterBarProps): JSX.Element {
  const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()
  const initSelectedToDate = dayjs().tz(config.timezone).endOf('day').toDate()

  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [selectedToDate, setSelectedToDate] = useState(initSelectedToDate)

  return (
    <ContainerWrapper>
      <Grid container spacing={3}>
        <Grid item xs={9} sm={4}>
          <TextField
            id="txtSearchKeyword"
            label="Search"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="Please enter some keyword"
            variant="outlined"
            fullWidth
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Button variant="contained" color="primary">
            Search
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={2}>
          <DatePicker
            label="Start Date"
            id="car_availability__startdate_input"
            KeyboardButtonProps={{
              id: 'car_availability__startdate_icon',
            }}
            name="selectedFromDate"
            format={DEFAULT_DATE_FORMAT}
            value={selectedFromDate}
            onChange={(date) => {
              date && setSelectedFromDate(date.toDate())
            }}
            inputVariant="outlined"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <DatePicker
            label="End Date"
            id="car_availability__enddate_input"
            KeyboardButtonProps={{
              id: 'car_availability__enddate_icon',
            }}
            name="selectedToDate"
            format={DEFAULT_DATE_FORMAT}
            value={selectedToDate}
            onChange={(date) => {
              date && setSelectedToDate(date.toDate())
            }}
            inputVariant="outlined"
            fullWidth
          />
        </Grid>
      </Grid>
    </ContainerWrapper>
  )
}
