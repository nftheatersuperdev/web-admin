import { makeStyles } from '@mui/styles'
import styled from 'styled-components'
import { TextField, Chip, Card } from '@mui/material'

export const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
export const ContentSection = styled.div`
  margin-bottom: 20px;
`
export const TableWrapper = styled.div`
  margin: 10px 0;
`

export const ChipServiceType = styled(Chip)`
  border-radius: 64px !important;
  background: #376eff !important;
  height: 24px !important;
`

export const ChipPaymentType = styled(Chip)`
  border-radius: 64px !important;
  background: #4caf50 !important;
  height: 24px !important;
`

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
  wrapWidth: {
    width: '110px',
  },
  rowOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
}))
