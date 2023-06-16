import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
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

export const useStyles = makeStyles({
  textField: {
    '& .MuiInputBase-input': {
      height: '1.4rem',
    },
    '& input.Mui-disabled': {
      WebkitTextFillColor: '#000000',
      color: '#000000',
      background: '#F5F5F5',
    },
    '& div.Mui-disabled': {
      background: '#F5F5F5 !important',
    },
    '& .MuiInputLabel-root': {
      color: '#e936a7',
    },
  },
  card: {
    padding: '20px',
  },
  gridTitle: {
    marginBottom: '30px',
  },
  container: {
    marginTop: '5px!important',
    marginBottom: '5px',
  },
  alignRight: {
    textAlign: 'right',
  },
  bottomContrainer: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '10px',
  },
  deleteButton: {
    color: 'red',
    borderColor: 'red',
  },
  w83: {
    width: '83px',
  },
  hideObject: {
    display: 'none',
  },
  chipLightGrey: {
    backgroundColor: '#E0E0E0',
    color: 'black !important',
    borderRadius: '64px',
    padding: '4px',
    margin: '2px',
  },
  chipBgPrimary: {
    backgroundColor: '#4584FF',
    color: 'white',
    borderRadius: '64px',
    padding: '4px',
    margin: '2px',
  },
  checkBoxLightGrey: {
    '&.Mui-checked': {
      color: '#999',
    },
  },
  locationSelect: {
    '& fieldSet': {
      borderColor: '#424E63',
    },
  },
})
