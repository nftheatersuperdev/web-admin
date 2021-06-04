import { useState } from 'react'
import { Button, Card } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import toast from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useCars, useCreateCar } from 'services/evme'
import PageToolbar from 'layout/PageToolbar'
import { Car as CarType, CarInput } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import CarCreateDialog from './CarCreateDialog'

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
  const { data: carModelList } = useCars()
  const [isDialogOpen, openDialog] = useState<boolean>(false)
  const createCarMutation = useCreateCar()
  const queryClient = useQueryClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows: any = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const carModelOptions: any = []

  const onCloseDialog = async (data: CarInput | null) => {
    openDialog(false)
    if (!data) {
      return
    }

    try {
      // 1. We create the new car
      await createCarMutation.mutateAsync(data)

      queryClient.invalidateQueries('evme:cars')
      toast.success('Created car successfully!')
    } catch (error) {
      console.error('failed to created car', error)
      toast.error('Failed to create car!')
    }
  }

  // Transform response into table format
  carModelList?.edges?.forEach(({ node }) => {
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

  carModelList?.edges?.forEach(({ node }) => {
    carModelOptions.push({
      id: node?.id,
      modelName: `${node?.brand} - ${node?.model}`,
    })
  })

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => openDialog(true)}>
          New Car
        </Button>
      </PageToolbar>

      {rows.length > 0 && (
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
      )}
      <CarCreateDialog
        open={isDialogOpen}
        onClose={(data) => onCloseDialog(data)}
        carModelOptions={carModelOptions}
      />
    </Page>
  )
}
