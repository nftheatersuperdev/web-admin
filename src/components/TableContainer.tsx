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

export interface TableColmun {
  key: string
  name: string
  hidden: boolean
}
interface TableContainerProps {
  columns: TableColmun[]
  isFetching?: boolean
  data: JSX.Element | JSX.Element[]
}

const HeaderTableCell = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: 500;
  padding-left: 16px;
`

export default function TableContainer({
  columns,
  isFetching,
  data,
}: TableContainerProps): JSX.Element {
  return (
    <MUITableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(({ key, name, hidden }) => (
              <TableCell key={key} hidden={hidden}>
                <HeaderTableCell>{name}</HeaderTableCell>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {isFetching ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
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
