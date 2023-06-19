import styled from 'styled-components'
import DatePicker from 'components/DatePicker'
import { makeStyles } from '@mui/styles'

export const SearchDatePicker = styled(DatePicker)`
  .MuiInputBase-root {
    height: 51.69px;
  }
`

export const useStyles = makeStyles({
  typo: {
    marginBottom: '0px',
  },
  gridTitle: {
    padding: '20px',
    paddingBottom: 0,
  },
  gridSearch: {
    padding: '20px',
  },
  gridExport: {
    textAlign: 'right',
  },
  marginRight: {
    marginRight: '50px',
  },
  exportButton: {
    background: '#333c4d',
    color: '#fff',
    height: '51px',
  },
  table: {
    border: 0,
  },
  chipBgGray: {
    backgroundColor: '#E0E0E0',
    height: '24px',
    borderRadius: '64px',
  },
  csvlink: {
    color: '#fff',
    textDecoration: 'none',
  },
  columnHeader: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: '500',
    paddingLeft: '16px',
  },
  rowOverflowSmall: {
    width: '80px',
    overflowWrap: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    'line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  rowOverflow: {
    width: '115px',
    overflowWrap: 'break-word',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    'line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  paginationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  paddingLeftCell: {
    paddingLeft: '12px',
  },
  autoCompleteSelect: {
    '& fieldSet': {
      borderColor: '#424E63',
    },
  },
})
