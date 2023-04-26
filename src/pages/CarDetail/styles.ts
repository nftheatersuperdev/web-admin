import { makeStyles } from '@mui/styles'
import styled from 'styled-components'
import { TextField } from '@mui/material'

export const DisabledField = styled(TextField)`
  .MuiInputBase-root {
    background-color: #f5f5f5;
  }
  .MuiInputBase-input:disabled {
    color: #000000 !important;
    -webkit-text-fill-color: #000000 !important;
  }
  label.Mui-disabled {
    color: #000000 !important;
    -webkit-text-fill-color: #000000 !important;
  }
`
export const EnabledTextField = styled(TextField)`
  .MuiInputBase-input {
    color: #000000 !important;
    -webkit-text-fill-color: #000000 !important;
  }
  fieldset.MuiOutlinedInput-notchedOutline {
    border-color: #000000;
  }
  label {
    color: #000000 !important;
    -webkit-text-fill-color: #000000 !important;
  }
`
export const useStyles = makeStyles(() => ({
  gridTitle: {
    marginBottom: '30px',
  },
  marginSection: {
    marginTop: '50px',
  },
  container: {
    marginTop: '5px!important',
    marginBottom: '5px',
  },
  card: {
    padding: '20px',
  },
  chargeTypeStyle: {
    display: 'flex',
  },
}))
