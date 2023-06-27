import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles({
  hide: {
    display: 'none',
  },
  headerTopic: {
    padding: '8px 16px',
  },
  detailContainer: {
    padding: '10px 25px',
  },
  bottomContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 25px',
  },
  deleteProfileButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chipLightGrey: {
    backgroundColor: '#E0E0E0',
    color: 'black',
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
})
