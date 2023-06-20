import styled from 'styled-components'
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer as MUITableContainer,
  TableHead,
  TableRow,
} from '@mui/material'

interface TableContainerHeader {
  colName: string
  hidden: boolean
}
interface TableContainerProps {
  columnHeaders: TableContainerHeader[]
  isFetching?: boolean
  data: JSX.Element | JSX.Element[]
}

const HeaderTableCell = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: 500;
  padding-left: 16px;
`

export default function TableContainer({
  columnHeaders,
  isFetching,
  data,
}: TableContainerProps): JSX.Element {
  return (
    <MUITableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columnHeaders.map(({ colName, hidden }) => (
              <TableCell key={colName} hidden={hidden}>
                <HeaderTableCell>{colName}</HeaderTableCell>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {isFetching ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columnHeaders.length} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>{data}</TableBody>
        )}
      </Table>
    </MUITableContainer>
  )
}
