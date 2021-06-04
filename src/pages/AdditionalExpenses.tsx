import { useState } from 'react'
import { Button, Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { formatDates, formatMoney } from 'utils'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import { useAdditionalExpenses } from 'services/evme'
import AdditionalExpenseCreateDialog from './AdditionalExpenseCreateDialog'

const columns: GridColDef[] = [
  {
    field: 'subscriptionId',
    headerName: 'Subscription ID',
    description: 'Subscription ID',
    flex: 1,
  },
  { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
  { field: 'note', headerName: 'Notes', description: 'Notes', flex: 1 },
  {
    field: 'noticeDate',
    headerName: 'Date of expense notice',
    description: 'Date of expense notice',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Date Created',
    description: 'Date Created',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'updatedAt',
    headerName: 'Dated Updated',
    description: 'Date Updated',
    valueFormatter: formatDates,
    flex: 1,
  },
  { field: 'type', headerName: 'Type', description: 'Type of Expense', flex: 1 },
  { field: 'status', headerName: 'Status', description: 'Status', flex: 1 },
  {
    field: 'price',
    headerName: 'Price',
    description: 'Price',
    valueFormatter: formatMoney,
    flex: 1,
  },
]

export default function AdditionalExpenses(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data } = useAdditionalExpenses()

  // Transform response into table format
  const rows = data?.edges?.map(({ node }) => ({
    id: node?.id,
    subscriptionId: node?.subscriptionId,
    createdAt: node?.createdAt,
    updatedAt: node?.updatedAt,
    noticeDate: node?.noticeDate,
    type: node?.type,
    status: node?.status,
    note: node?.note,
    price: node?.price,
  }))

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          Create Additional Expense
        </Button>
      </PageToolbar>
      {rows ? (
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
      <AdditionalExpenseCreateDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Page>
  )
}
