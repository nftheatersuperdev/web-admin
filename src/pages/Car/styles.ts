import { makeStyles } from '@mui/styles'

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
  exportButton: {
    background: '#333c4d',
    color: '#fff',
    height: '56px',
  },
  table: {
    border: 0,
  },
  pagination: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  paginationForm: {
    display: 'inline-flex',
  },
  chipBgGreen: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    height: '24px',
    borderRadius: '64px',
  },
  chipBgGray: {
    backgroundColor: '#E0E0E0',
    height: '24px',
    borderRadius: '64px',
  },
  wrapText: {
    lineHeight: '1.5em',
    height: '3em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
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
})
