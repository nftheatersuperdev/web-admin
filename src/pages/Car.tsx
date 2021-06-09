import { useState } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowData,
  GridCellParams,
} from '@material-ui/data-grid'
import DeleteIcon from '@material-ui/icons/Delete'
import toast from 'react-hot-toast'
import { ICarModelItem } from 'helper/car.helper'
import { useCars, useCreateCar, useUpdateCar, useDeleteCar } from 'services/evme'
import PageToolbar from 'layout/PageToolbar'
import { Car as CarType, CarInput } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import ConfirmDialog from 'components/ConfirmDialog'
import CarCreateDialog from './CarCreateDialog'
import CarUpdateDialog, { ICarInfo } from './CarUpdateDialog'

interface IRowModel {
  carModelId: string
  brand: string
  topSpeed: number
  acceleration: number
  range: number
  totalPower: number
  chargeType: string
  chargeTime: number
  fastChargeTime: number
  bodyTypeId: number
  model: string
  id: string
  vin: string
  plateNumber: string
  color: string
}

export default function Car(): JSX.Element {
  const { data: carModelList } = useCars()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState('')
  const [carInfo, setCarInfo] = useState({} as ICarInfo)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({} as GridRowData)
  const createCarMutation = useCreateCar()
  const updateCarMutation = useUpdateCar()
  const deleteCarMutation = useDeleteCar()

  const rows = [] as IRowModel[]
  const carModelOptions = [] as ICarModelItem[]

  const onCloseCreateDialog = (data: CarInput | null) => {
    setIsCreateDialogOpen(false)
    if (!data) {
      return
    }

    toast.promise(createCarMutation.mutateAsync(data), {
      loading: 'Loading',
      success: 'Created car successfully!',
      error: 'Failed to create car!',
    })
  }

  const onCloseEditDialog = (data: CarInput | null) => {
    setIsUpdateDialogOpen(false)
    if (!data) {
      return
    }

    toast.promise(
      updateCarMutation.mutateAsync({
        update: data,
        id: selectedCarId,
      }),
      {
        loading: 'Loading',
        success: 'Updated car successfully!',
        error: 'Failed to update car!',
      }
    )
  }

  // Transform response into table format
  carModelList?.edges?.forEach(({ node }) => {
    if (node.cars) {
      rows.push(
        ...(node.cars as unknown as CarType[]).map((car: CarType) => ({
          carModelId: node?.id,
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
          color: car?.color,
        }))
      )
    }
  })

  // INFO: parsing option to display in dialog select element
  carModelList?.edges?.forEach(({ node }) => {
    carModelOptions.push({
      id: node?.id,
      modelName: `${node?.brand} - ${node?.model}`,
    })
  })

  const openEditCarDialog = (param: GridRowData) => {
    setSelectedCarId(param.id)
    const { vin, plateNumber, carModelId, color } = param.row
    setCarInfo({
      vin,
      plateNumber,
      carModelId,
      color,
    })
    setIsUpdateDialogOpen(true)
  }

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
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      description: 'Record actions',
      disableClickEventBubbling: true,
      width: 140,
      renderCell: (params: GridCellParams) => (
        <IconButton aria-label="delete" onClick={() => handleDeleteIconClick(params.row)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]

  const handleDeleteIconClick = (rowData: GridRowData) => {
    setCurrentRowData(rowData)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = (rowData: GridRowData) => {
    toast.promise(
      deleteCarMutation.mutateAsync({
        id: rowData.id,
      }),
      {
        loading: 'Loading',
        success: 'Deleted additional expense successfully!',
        error: 'Failed to delete additional expense!',
      }
    )

    setIsDeleteDialogOpen(false)
  }

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          New Car
        </Button>
      </PageToolbar>

      {rows.length > 0 ? (
        <Card>
          <DataGrid
            autoHeight
            autoPageSize
            rows={rows}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            onRowClick={openEditCarDialog}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Card>
      ) : null}
      <CarCreateDialog
        open={isCreateDialogOpen}
        onClose={onCloseCreateDialog}
        carModelOptions={carModelOptions}
      />
      <CarUpdateDialog
        open={isUpdateDialogOpen}
        onClose={(data) => onCloseEditDialog(data)}
        carModelOptions={carModelOptions}
        carInfo={carInfo}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Car"
        message={`Are you sure that you want to delete this ID: ${currentRowData.id} ?`}
        onConfirm={() => handleConfirmDelete(currentRowData)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Page>
  )
}
