import { GridFilterInputValueProps } from '@material-ui/data-grid'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATE_FORMAT } from 'utils'
import DatePicker from './DatePicker'

export default function GridFilterInputDateTimePicker(
  props: GridFilterInputValueProps
): JSX.Element {
  const { item, applyValue } = props
  const { t } = useTranslation()
  const handleFilterChange = (date: MaterialUiPickersDate | null) => {
    applyValue({ ...item, value: date?.format('YYYY-MM-DDTHH:mm:ssZ') })
  }

  return (
    <DatePicker
      label={t('filter.date')}
      format={DEFAULT_DATE_FORMAT}
      defaultValue={null}
      value={item.value ? item.value : null}
      onChange={handleFilterChange}
      KeyboardButtonProps={{
        'aria-label': 'change date',
      }}
    />
  )
}
