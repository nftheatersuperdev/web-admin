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
  },
  chargeTypeStyle: {
    display: 'flex',
  },
}))
