import { Button, Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar, GridRowData } from '@material-ui/data-grid'
import { formatDates, formatMoney } from 'utils'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import { useSubAdditionalExpenses } from 'services/evme'
import { AdditionalExpense } from 'services/evme.types'

const columns: GridColDef[] = [
  {
    field: 'subscriptionId',
    headerName: 'Subscription ID',
    description: 'Subscription ID',
    flex: 1,
  },
  { field: 'userId', headerName: 'User ID', description: 'User ID', flex: 1 },
  { field: 'userFullname', headerName: 'Full name', description: 'Full name', flex: 1 },
  {
    field: 'noticeDate',
    headerName: 'Date of expense notice',
    description: 'Date of expense notice',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    description: 'Created At',
    valueFormatter: formatDates,
    flex: 1,
  },
  { field: 'type', headerName: 'Type of expense', description: 'Type of expense', flex: 1 },
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
  const { data } = useSubAdditionalExpenses()

  // Transform response into table format
  const rows = data?.edges?.reduce((results, { node }) => {
    const { id, userId, user, additionalExpenses } = node

    const newResults = additionalExpenses?.map((expense: AdditionalExpense) => ({
      subscriptionId: id || '-',
      userId: userId || '-',
      userFullname: user?.phoneNumber || '-',
      noticeDate: expense?.noticeDate || '-',
      createdAt: expense?.createdAdt || '-',
      type: expense?.type || '-',
      status: expense?.status || '-',
      price: expense?.price || '-',
    }))

    return [...results, ...(newResults || [])]
  }, [] as GridRowData[])

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained">
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
    </Page>
  )
}
