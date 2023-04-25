import { makeStyles } from '@mui/styles'

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
  },
  chargeTypeStyle: {
    display: 'flex',
  },
}))
