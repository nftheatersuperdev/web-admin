import { Fragment, useMemo, useState } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRowData,
  GridCellParams,
  GridValueFormatterParams,
  GridPageChangeParams,
} from '@material-ui/data-grid'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import toast from 'react-hot-toast'
import { formatDateWithPattern, DEFAULT_DATE_FORMAT } from 'utils'
import config from 'config'
import { useCars, useCarModels, useCreateCar, useUpdateCar, useDeleteCar } from 'services/evme'
import PageToolbar from 'layout/PageToolbar'
import { CarInput } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import ConfirmDialog from 'components/ConfirmDialog'
import CarCreateDialog from './CarCreateDialog'
import CarUpdateDialog, { ICarInfo } from './CarUpdateDialog'

export default function Car(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState('')
  const [carInfo, setCarInfo] = useState({} as ICarInfo)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({} as GridRowData)
  const createCarMutation = useCreateCar()
  const updateCarMutation = useUpdateCar()
  const deleteCarMutation = useDeleteCar()

  const [pageSize, setPageSize] = useState(5)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const { data: cars, fetchNextPage, fetchPreviousPage } = useCars(pageSize)
  const { data: carModels } = useCarModels()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handlePageChange = (params: GridPageChangeParams) => {
    if (params.page > currentPageIndex) {
      fetchNextPage()
    } else {
      fetchPreviousPage()
    }
    setCurrentPageIndex(params.page)
  }

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

  const rows = useMemo(
    () =>
      cars?.pages[currentPageIndex]?.edges?.map(({ node }) => {
        const { id, vin, plateNumber, color, carModelId, carModel, updatedAt } = node || {}

        const {
          brand,
          model,
          acceleration,
          topSpeed,
          range,
          totalPower,
          connectorType,
          chargeTime,
          fastChargeTime,
        } = carModel || {}

        return {
          carModelId,
          brand,
          topSpeed,
          acceleration,
          range,
          totalPower,
          connectorType: connectorType?.description,
          chargeTime,
          fastChargeTime,
          bodyType: carModel?.bodyType?.bodyType,
          model,
          id,
          vin,
          plateNumber,
          color,
          updatedAt,
        }
      }) || [],
    [cars, currentPageIndex]
  )

  const carModelOptions = useMemo(
    () =>
      carModels?.edges?.map(({ node }) => ({
        id: node?.id,
        modelName: `${node?.brand} - ${node?.model}`,
      })) || [],
    [carModels]
  )

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
    { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
    { field: 'brand', headerName: 'Brand', description: 'Brand', flex: 1 },
    { field: 'model', headerName: 'Model', description: 'Model', flex: 1 },
    { field: 'color', headerName: 'Color', description: 'Color', flex: 1 },
    { field: 'plateNumber', headerName: 'Plate Number', description: 'PlateNumber', flex: 1 },
    {
      field: 'bodyType',
      headerName: 'Body Type',
      description: 'Body Type',
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated Date',
      description: 'Updated date',
      valueFormatter: (params: GridValueFormatterParams) =>
        formatDateWithPattern(params, DEFAULT_DATE_FORMAT),
      flex: 1,
    },
    { field: 'topSpeed', headerName: 'Top Speed', description: 'Top Speed', flex: 1, hide: true },
    {
      field: 'acceleration',
      headerName: 'Acceleration',
      description: 'Acceleration',
      flex: 1,
      hide: true,
    },
    { field: 'range', headerName: 'Range', description: 'Range', flex: 1, hide: true },
    {
      field: 'totalPower',
      headerName: 'Total Power',
      description: 'Total Power',
      flex: 1,
      hide: true,
    },
    {
      field: 'connectorType',
      headerName: 'Connector Type',
      description: 'Connector Type',
      flex: 1,
      hide: true,
    },
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
    { field: 'vin', headerName: 'VIN', description: 'VIN', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      description: 'Record actions',
      disableClickEventBubbling: true,
      width: 140,
      renderCell: (params: GridCellParams) => (
        <Fragment>
          <IconButton
            aria-label="edit"
            onClick={() => {
              openEditCarDialog(params)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDeleteIconClick(params.row)}>
            <DeleteIcon />
          </IconButton>
        </Fragment>
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

      <Card>
        <DataGrid
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={cars?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          rowsPerPageOptions={config.tableRowsPerPageOptions}
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          // loading={isFetching}
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
        message={`Are you sure that you want to delete this: ${currentRowData.brand} - ${currentRowData.model}, ${currentRowData.color}, ${currentRowData.plateNumber} ?`}
        onConfirm={() => handleConfirmDelete(currentRowData)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Page>
  )
}
