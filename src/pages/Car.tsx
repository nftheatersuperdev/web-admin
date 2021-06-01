import { Button, Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { useCars } from 'services/evme'
import PageToolbar from 'layout/PageToolbar'
import { Car as CarType } from 'services/evme.types'

const columns: GridColDef[] = [
  { field: 'brand', headerName: 'Brand', description: 'Brand', flex: 1 },
  { field: 'topSpeed', headerName: 'Top Speed', description: 'Top Speed', flex: 1, hide: true },
  {
    field: 'acceleration',
    headerName: 'Acceleration',
    description: 'Acceleration',
    flex: 1,
    hide: true,
  },
  { field: 'range', headerName: 'Range', description: 'Range', flex: 1 },
  { field: 'totalPower', headerName: 'Total Power', description: 'Total Power', flex: 1 },
  { field: 'chargeType', headerName: 'Charge Type', description: 'Charge Type', flex: 1 },
  {
    field: 'chargeTime',
    headerName: 'Charge Time',
    description: 'Charge Time',
    flex: 1,
    hide: true,
  },
  {
    field: 'fastChargeTime',
    headerName: 'Fast Charge Time',
    description: 'Fast Charge Time',
    flex: 1,
    hide: true,
  },
  {
    field: 'bodyTypeId',
    headerName: 'Body Type ID',
    description: 'Body Type Id',
    flex: 1,
    hide: true,
  },
  { field: 'model', headerName: 'Model', description: 'Model', flex: 1 },
  { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
  { field: 'vin', headerName: 'VIN', description: 'VIN', flex: 1 },
  { field: 'plateNumber', headerName: 'Plate Number', description: 'PlateNumber', flex: 1 },
]

export default function Car(): JSX.Element {
  const { data } = useCars()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any = []

  // Transform response into table format
  data?.edges?.forEach(({ node }) => {
    if (node.cars) {
      rows.push(
        ...(node.cars as unknown as CarType[]).map((car: CarType) => ({
          brand: node?.brand,
          topSpeed: node?.topSpeed,
          acceleration: node?.acceleration,
          range: node?.range,
          totalPower: node?.totalPower,
          chargeType: node?.chargeType,
          chargeTime: node?.chargeTime,
          fastChargeTime: node?.fastChargeTime,
          bodyTypeId: node?.bodyTypeId,
          model: node?.model,
          id: car?.id,
          vin: car?.vin,
          plateNumber: car?.plateNumber,
        }))
      )
    }
  })

  return (
    <div>
      <PageToolbar>
        <Button color="primary" variant="contained">
          New Car
        </Button>
      </PageToolbar>

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
    </div>
  )
}
