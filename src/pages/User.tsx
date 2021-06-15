import { useState } from 'react'
import { Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridPageChangeParams, GridToolbar } from '@material-ui/data-grid'
import { formatDates } from 'utils'
import config from 'config'
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
  const [pageSize, setPageSize] = useState(5)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { data, fetchNextPage, fetchPreviousPage } = useUsers(pageSize)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handlePageChange = (params: GridPageChangeParams) => {
    // If we navigate FORWARD in our pages, i.e. the new page number is higher than current page
    if (params.page > currentPageIndex) {
      fetchNextPage()
    }
    // If we navigate BACKWARD in our pages, i.e. the new page number is lower than current page
    else {
      fetchPreviousPage()
    }
    setCurrentPageIndex(params.page)
  }

  const rows = data?.pages[currentPageIndex]?.edges?.map(({ node }) => node)

  return (
    <Page>
      {rows && rows.length > 0 ? (
        <Card>
          <DataGrid
            autoHeight
            pagination
            pageSize={pageSize}
            page={currentPageIndex}
            rowCount={data?.pages[currentPageIndex]?.totalCount}
            paginationMode="server"
            rowsPerPageOptions={config.tableRowsPerPageOptions}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={handlePageChange}
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
