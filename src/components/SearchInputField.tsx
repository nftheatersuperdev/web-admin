import { ChangeEvent, KeyboardEvent } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { SelectOption } from 'utils'

interface SearchInputFieldProps {
  value: string
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  selectedSearch: SelectOption | null | undefined
  textLabel: string
}

export default function SearchInputField({
  value,
  handleChange,
  handleKeyDown,
  selectedSearch,
  textLabel,
}: SearchInputFieldProps): JSX.Element {
  return (
    <TextField
      id="booking_search_input"
      type="text"
      variant="outlined"
      fullWidth
      value={value || ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={!selectedSearch || selectedSearch?.value === 'all' || selectedSearch?.value === ''}
      placeholder={textLabel}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <IconButton>
              <SearchIcon
                color={
                  !selectedSearch || selectedSearch?.value === 'all' || selectedSearch?.value === ''
                    ? 'disabled'
                    : 'action'
                }
              />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
