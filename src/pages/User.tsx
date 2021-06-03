import { Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { formatDates } from 'utils'
import { useUsers } from 'services/evme'
import { Page } from 'layout/LayoutRoute'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', description: 'ID', flex: 1, hide: true },
  { field: 'email', headerName: 'E-mail', description: 'E-mail', flex: 1 },
  { field: 'phoneNumber', headerName: 'Phone Number', description: 'Phone Number', flex: 1 },
  { field: 'role', headerName: 'Role', description: 'Role', flex: 1 },
  { field: 'disabled', headerName: 'Disabled', description: 'Disabled', flex: 1 },
  {
    field: 'createdAt',
    headerName: 'Date Created',
    description: 'Date Created',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'updatedAt',
    headerName: 'Date Updated',
    description: 'Date Updated',
    valueFormatter: formatDates,
    flex: 1,
  },
]

export default function User(): JSX.Element {
  const { data: users } = useUsers()

  const rows = users?.edges.map(({ node }) => node)

  return (
    <Page>
      {rows && rows.length > 0 ? (
        <Card>
          <DataGrid
            autoHeight
            autoPageSize
            rows={rows}
            columns={columns}
            checkboxSelection
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Card>
      ) : null}
    </Page>
  )
}
