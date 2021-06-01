import { useState } from 'react'
import { Button, Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { formatDates, formatMoney } from 'utils'
import PageToolbar from 'layout/PageToolbar'
import { usePackages } from 'services/evme'
import { PackagePrice } from 'services/evme.types'
import PackageCreateDialog from './PackageCreateDialog'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
  { field: 'active', headerName: 'Active', description: 'Active', flex: 1 },
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
  {
    field: 'price1w',
    headerName: 'Price 1w',
    description: 'Price 1w',
    valueFormatter: formatMoney,
    flex: 1,
  },
  {
    field: 'price1m',
    headerName: 'Price 1m',
    description: 'Price 1m',
    valueFormatter: formatMoney,
    flex: 1,
  },
  {
    field: 'price3m',
    headerName: 'Price 3m',
    description: 'Price 3m',
    valueFormatter: formatMoney,
    flex: 1,
  },
  {
    field: 'price6m',
    headerName: 'Price 6m',
    description: 'Price 6m',
    valueFormatter: formatMoney,
    flex: 1,
  },
  {
    field: 'price9m',
    headerName: 'Price 9m',
    description: 'Price 9m',
    valueFormatter: formatMoney,
    flex: 1,
  },
]

export default function Package(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { data } = usePackages()

  // Transform response into table format
  const rows = data?.edges?.map(({ node }) => ({
    id: node?.id,
    active: node?.active ? 'Active' : 'Disabled',
    createdAt: node?.createdAt,
    updatedAt: node?.updatedAt,
    price1w:
      (node?.prices as unknown as PackagePrice[])?.find(({ duration }) => duration === '1w')
        ?.price || '-',
    price1m:
      (node?.prices as unknown as PackagePrice[])?.find(({ duration }) => duration === '1m')
        ?.price || '-',
    price3m:
      (node?.prices as unknown as PackagePrice[])?.find(({ duration }) => duration === '3m')
        ?.price || '-',
    price6m:
      (node?.prices as unknown as PackagePrice[])?.find(({ duration }) => duration === '6m')
        ?.price || '-',
    price9m:
      (node?.prices as unknown as PackagePrice[])?.find(({ duration }) => duration === '9m')
        ?.price || '-',
  }))

  return (
    <div>
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
    </div>
  )
}
