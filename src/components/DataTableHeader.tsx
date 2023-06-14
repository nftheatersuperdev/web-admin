/* eslint-disable react/jsx-key */
import { TableCell, TableHead, TableRow } from '@mui/material'
import styled from 'styled-components'

interface DataTableProps {
  header: TableHeaderProps[]
}

export interface TableHeaderProps {
  text: string
  style?: string
}

const TableHeaderColumn = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: bold;
  padding-left: 10px;
`

export default function DataTableHeader({ header }: DataTableProps): JSX.Element {
  return (
    <TableHead>
      <TableRow>
        {header && header.length >= 1 ? (
          <TableCell align="left">
            {header.map((text) => {
              return <TableHeaderColumn>{text}</TableHeaderColumn>
            })}
          </TableCell>
        ) : (
          ''
        )}
      </TableRow>
    </TableHead>
  )
}
