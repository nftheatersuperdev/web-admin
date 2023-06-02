import styled from 'styled-components'
import { TextField } from '@mui/material'

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
