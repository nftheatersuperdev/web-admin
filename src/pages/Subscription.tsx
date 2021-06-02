import { Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { formatDates, formatMoney, renderEmailLink } from 'utils'
import { useSubscriptions } from 'services/evme'
import { Page } from 'layout/LayoutRoute'

const columns: GridColDef[] = [
  { field: 'brand', headerName: 'Car Brand', description: 'Car Brand', flex: 1 },
  { field: 'model', headerName: 'Car Model', description: 'Car Model', flex: 1 },
  { field: 'seats', headerName: 'Car Seats', description: 'Car Seats', flex: 1 },
  { field: 'topSpeed', headerName: 'Top Speed', description: 'Top Speed', flex: 1 },
  { field: 'plateNumber', headerName: 'Plate Number', description: 'Plate Number', flex: 1 },
  { field: 'vin', headerName: 'VIN', description: 'Vehicle Identification Number', flex: 1 },
  {
    field: 'price',
    headerName: 'Price',
    description: 'Price',
    valueFormatter: formatMoney,
    flex: 1,
  },
  { field: 'duration', headerName: 'Duration', description: 'Duration', flex: 1 },
  {
    field: 'fastChargeTime',
    headerName: 'Fast Charge Time',
    description: 'Fast Charge Time',
    flex: 1,
  },
  {
    field: 'startDate',
    headerName: 'Start Date',
    description: 'Start Date',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'endDate',
    headerName: 'End Date',
    description: 'End Date',
    valueFormatter: formatDates,
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Created Date',
    description: 'Created Date',
    valueFormatter: formatDates,
    hide: true,
    flex: 1,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated Date',
    description: 'Updated Date',
    valueFormatter: formatDates,
    hide: true,
    flex: 1,
  },
  {
    field: 'email',
    headerName: 'Customer',
    description: 'Customer',
    renderCell: renderEmailLink,
    flex: 1,
  },
  { field: 'phoneNumber', headerName: 'Phone', description: 'Phone', flex: 1 },
]

export default function Subscription(): JSX.Element {
  const { data } = useSubscriptions()

  // Transform response into table format
  const rows = data?.edges?.map(({ node }) => ({
    id: node?.id,
    vin: node?.car?.vin,
    plateNumber: node?.car?.plateNumber,
    brand: node?.car?.carModel?.brand,
    model: node?.car?.carModel?.model,
    price: node?.packagePrice?.price,
    duration: node?.packagePrice?.duration,
    seats: node?.car?.carModel?.seats,
    topSpeed: node?.car?.carModel?.topSpeed,
    fastChargeTime: node?.car?.carModel?.fastChargeTime,
    startDate: node?.startDate,
    endDate: node?.endDate,
    createdAt: node?.createdAt,
    updatedAt: node?.updatedAt,
    email: node?.user?.email,
    phoneNumber: node?.user?.phoneNumber,
  }))

  return (
    <Page>
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
