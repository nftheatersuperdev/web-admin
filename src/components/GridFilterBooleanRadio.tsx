import { useState, useEffect, useCallback } from 'react'
import { GridFilterInputValueProps } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core'

export default function GridFilterBooleanRadio(props: GridFilterInputValueProps): JSX.Element {
  const { t } = useTranslation()
  const { item, applyValue } = props
  const [filterValueState, setFilterValueState] = useState(item.value || '')

  const onFilterChange = useCallback(
    (event) => {
      const value = event.target.value
      setFilterValueState(value)
      applyValue({ ...item, value })
    },
    [applyValue, item]
  )

  useEffect(() => {
    setFilterValueState(item.value || '')
  }, [item.value])

  return (
    <FormControl component="fieldset">
      <FormLabel component="label">{t('filter.value')}</FormLabel>
      <RadioGroup
        row
        aria-label="position"
        name="position"
        defaultValue="true"
        value={filterValueState}
        onChange={onFilterChange}
      >
        <FormControlLabel
          value="true"
          control={<Radio color="primary" />}
          label={t('filter.true')}
        />
        <FormControlLabel
          value="false"
          control={<Radio color="secondary" />}
          label={t('filter.false')}
        />
      </RadioGroup>
    </FormControl>
  )
}
