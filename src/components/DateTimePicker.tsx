import { useTranslation } from 'react-i18next'
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  KeyboardDateTimePickerProps,
} from '@material-ui/pickers'
import DayjsUtils from '@date-io/dayjs'
import en, { Locale } from 'dayjs/locale/en'
import th from 'dayjs/locale/th'

const locales: { [key: string]: Locale } = {
  en,
  th,
}

export default function DateTimePicker(props: KeyboardDateTimePickerProps): JSX.Element {
  const { t, i18n } = useTranslation()

  return (
    <MuiPickersUtilsProvider utils={DayjsUtils} locale={locales[i18n.language]}>
      <KeyboardDateTimePicker
        {...props}
        invalidDateMessage={t('datetimePicker.invalidDateMessage')}
        invalidLabel={t('datetimePicker.invalidLabel')}
        cancelLabel={t('datetimePicker.cancelLabel')}
        clearLabel={t('datetimePicker.clearLabel')}
        okLabel={t('datetimePicker.okLabel')}
        todayLabel={t('datetimePicker.todayLabel')}
      />
    </MuiPickersUtilsProvider>
  )
}
