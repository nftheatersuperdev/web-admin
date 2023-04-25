import { makeStyles } from '@mui/styles'

export const useStyles = makeStyles(() => ({
  searchBar: {
    '& .MuiOutlinedInput-input': { padding: '17px 12px' },
    '& .MuiIconButton-root': { padding: '4px 4px' },
  },
  paginationContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  paddindElement: {
    marginLeft: '8px',
  },
  chipBgGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '16px',
  },
  chipBgPrimary: {
    backgroundColor: '#4584FF',
    color: 'white',
    borderRadius: '16px',
  },
  table: {
    width: '100%',
  },
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
    paddingLeft: '4px',
  },
  rowOverflow: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  setWidth: {
    width: '80px',
  },
  setWidthBookingId: {
    width: '130px',
  },
  hideObject: {
    display: 'none',
  },
  paddingRigthBtnClear: {
    marginLeft: '-40px',
    cursor: 'pointer',
    padding: '4px 4px',
  },
  noResultMessage: {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '48px 0',
  },
  hidenField: {
    display: 'none',
  },
}))
