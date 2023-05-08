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
  gridSubTitle: {
    margin: '20px',
    display: 'flex',
    justifyItems: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  subCard: {
    marginTop: '20px',
    padding: '0',
  },
  chargeTypeStyle: {
    display: 'flex',
  },
  table: {
    border: 0,
    marginBottom: '20px',
  },
  columnHeader: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: '500',
    paddingLeft: '16px',
  },
  paddingLeftCell: {
    paddingLeft: '12px',
  },
}))
