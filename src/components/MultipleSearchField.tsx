/* eslint-disable react/jsx-props-no-spreading */
import { useState, ChangeEvent, useRef } from 'react'
import { Autocomplete, Grid, TextField, InputAdornment, IconButton, Button } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATE_FORMAT_MONTH_TEXT } from 'utils'
import styled from 'styled-components'
import dayjs from 'dayjs'
import DatePicker from 'components/DatePicker'

export const SearchDatePicker = styled(DatePicker)`
  .MuiInputBase-root {
    height: 51px;
  }
`
const SearchSubmitButton = styled(Button)`
  height: 51px;
`

export interface SelectOption {
  label: string
  value: string
}

export interface SearchField {
  type: 'textbox' | 'datepicker'
  optionId: string
  optionLabel: string
  defaultValue?: string | undefined
  defaultDate?: string | undefined
  placeholder?: string
}

interface MultipleSearchFieldProps {
  id: string
  fields: SearchField[]
  onSubmit: (inputId: string | undefined | null, inputValue: string | undefined | null) => void
  spacing?: number
}

interface RenderTextFieldProps {
  fieldId: string
  placeholder?: string | undefined
  defaultValue?: string
  disabled?: boolean
}

interface RenderDatePickerFieldProps {
  fieldId: string
  fieldLable: string
  value: string | number | null | undefined
}

export default function MultipleSearchField({
  id,
  fields,
  spacing,
  onSubmit,
}: MultipleSearchFieldProps): JSX.Element {
  const { t } = useTranslation()

  const textInputElement = useRef<HTMLInputElement>()
  const [selectedOption, setSelectedOption] = useState<SelectOption | null | undefined>(null)
  const [stateValue, setStateValue] = useState<string>()

  const isDisabledSearchButton = !stateValue

  const searchOptions: SelectOption[] = fields.map((field) => {
    return {
      label: field.optionLabel,
      value: field.optionId,
    }
  })

  function handleOnSubmit() {
    onSubmit(selectedOption?.value, stateValue)
  }

  function renderTextField({ fieldId, placeholder, defaultValue, disabled }: RenderTextFieldProps) {
    return (
      <TextField
        inputRef={textInputElement}
        id={`${id}_${fieldId}_input`}
        type="text"
        variant="outlined"
        fullWidth
        onChange={(event: ChangeEvent<HTMLInputElement>, value?: string) => {
          const { value: eventValue } = event.target
          const fieldValue = value ? value : eventValue
          setStateValue(() => fieldValue)
        }}
        placeholder={placeholder}
        disabled={disabled}
        value={stateValue}
        defaultValue={defaultValue}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton disabled={disabled}>
                <SearchIcon color={disabled ? 'disabled' : 'action'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    )
  }

  function renderDatePickerField({ fieldId, fieldLable, value }: RenderDatePickerFieldProps) {
    return (
      <SearchDatePicker
        fullWidth={true}
        label={fieldLable}
        KeyboardButtonProps={{
          id: `${id}_${fieldId}_icon`,
        }}
        id={`${id}_${fieldId}_input`}
        name={fieldId}
        value={value}
        format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
        inputVariant="outlined"
        onChange={(date) => {
          if (date) {
            const dateToString = date.startOf('day').toISOString()
            setStateValue(dateToString)
            return
          }
          setStateValue('')
        }}
      />
    )
  }

  function renderSearchInputField() {
    const searchField: SearchField | undefined = fields.find(
      (field) => field.optionId === selectedOption?.value
    )

    if (textInputElement.current) {
      textInputElement.current.value = ''
    }

    if (!searchField || !selectedOption) {
      return renderTextField({
        fieldId: 'disabled',
        placeholder: t('booking.selectSearch'),
        disabled: true,
      })
    }

    const { type, optionId, optionLabel, placeholder, defaultValue, defaultDate } = searchField

    switch (type) {
      case 'textbox': {
        return renderTextField({
          fieldId: optionId,
          placeholder,
          defaultValue,
        })
      }
      case 'datepicker': {
        if (!stateValue) {
          setStateValue(() => dayjs().startOf('day').toISOString())
        }
        return renderDatePickerField({
          fieldId: optionId,
          fieldLable: optionLabel,
          value: stateValue || defaultDate,
        })
      }
    }
  }

  return (
    <Grid container spacing={spacing}>
      <Grid item xs={12} sm={6} md={5}>
        <Autocomplete
          autoHighlight
          id="search_select_list"
          options={searchOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => {
            return <TextField {...params} label={t('booking.selectSearch')} variant="outlined" />
          }}
          isOptionEqualToValue={(option, value) =>
            option.value === value.value || value.value === ''
          }
          value={selectedOption || null}
          onChange={(_e, value) => {
            setStateValue(() => '')
            if (value) {
              setSelectedOption(() => value)
              return
            }
            setSelectedOption(() => null)
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={5}>
        {renderSearchInputField()}
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <SearchSubmitButton
          fullWidth
          id="user_group_search_button"
          variant="contained"
          size="large"
          disabled={isDisabledSearchButton}
          onClick={handleOnSubmit}
        >
          {t('carAvailability.searchBtn').toUpperCase()}
        </SearchSubmitButton>
      </Grid>
    </Grid>
  )
}
