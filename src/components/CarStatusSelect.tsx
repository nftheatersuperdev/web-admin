import { ChangeEventHandler } from 'react'
import { MenuItem, FormControl, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

interface CardStatusProps {
  status: string
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
}

export default function CarStatusSelect({ status, onChange }: CardStatusProps): JSX.Element {
  const { t } = useTranslation()

  const statuses = [
    {
      key: 'available',
      value: 'available',
      label: t('car.statuses.available'),
      isDefault: true,
    },
    {
      key: 'outOfService',
      value: 'out_of_service',
      label: t('car.statuses.outOfService'),
    },
  ]
  const defaultStatus = statuses.find((status) => status.isDefault)

  return (
    <FormControl fullWidth={true}>
      <TextField
        fullWidth
        select
        label={t('car.status')}
        id="status"
        name="status"
        defaultValue={defaultStatus?.value}
        value={status}
        onChange={onChange}
        InputLabelProps={{
          shrink: true,
        }}
      >
        {statuses.map((status) => {
          return (
            <MenuItem key={status.key} value={status.value}>
              {status.label}
            </MenuItem>
          )
        })}
      </TextField>
    </FormControl>
  )
}
