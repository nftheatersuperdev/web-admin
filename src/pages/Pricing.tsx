import { useState } from 'react'
import { Button, Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { formatDates, formatMoney } from 'utils'
import PageToolbar from 'layout/PageToolbar'
import { usePricing } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import PackageCreateDialog from './PackageCreateDialog'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
  { field: 'duration', headerName: 'Duration', description: 'Duration', flex: 1 },
  { field: 'brand', headerName: 'Car Brand', description: 'Car Brand', flex: 1 },
  { field: 'model', headerName: 'Model', description: 'Model', flex: 1 },
  {
    field: 'price',
    headerName: 'Price',
    description: 'Price',
    valueFormatter: formatMoney,
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    description: 'Created At',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    description: 'Updated At',
    valueFormatter: formatDates,
    flex: 1,
  },
]

export default function Pricing(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data } = usePricing()

  // Transform response into table format
  const rows = data?.edges?.map(({ node }) => ({
    id: node?.id,
    createdAt: node?.createdAt,
    updatedAt: node?.updatedAt,
    price: node?.price,
    duration: node?.duration,
    brand: node?.carModel?.brand,
    model: node?.carModel?.model,
  }))

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          Create Package
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
      <PackageCreateDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />
    </Page>
  )
}
