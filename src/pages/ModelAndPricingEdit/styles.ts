import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(() => ({
  disabledField: {
    '& .MuiInputBase-root': {
      background: '#f5f5f5',
    },
    '& .MuiInputBase-input:disabled': {
      WebkitTextFillColor: '#000000',
      color: '#000000',
    },
    '& label.Mui-disabled': {
      WebkitTextFillColor: '#000000',
      color: '#000000',
    },
  },
  disabledSelect: {
    '& .MuiSelect-select:disabled': {
      background: '#f5f5f5',
      WebkitTextFillColor: '#000000',
      color: '#000000',
    },
    '& label.Mui-disabled': {
      WebkitTextFillColor: '#000000',
      color: '#000000',
    },
  },
}))
