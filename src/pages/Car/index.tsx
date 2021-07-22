import { Fragment, useMemo, useState } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  GridColDef,
  GridRowData,
  GridCellParams,
  GridValueFormatterParams,
  GridPageChangeParams,
} from '@material-ui/data-grid'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { formatDateWithPattern, DEFAULT_DATETIME_FORMAT } from 'utils'
// import config from 'config'
import { useCars, useCarModels, useCreateCar, useUpdateCar, useDeleteCar } from 'services/evme'
import PageToolbar from 'layout/PageToolbar'
import { CarInput, CarSortFields, SortDirection } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import ConfirmDialog from 'components/ConfirmDialog'
import CarCreateDialog from './CarCreateDialog'
import CarUpdateDialog, { CarInfo } from './CarUpdateDialog'

export default function Car(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(10)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState('')
  const [carInfo, setCarInfo] = useState({} as CarInfo)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({} as GridRowData)
  const createCarMutation = useCreateCar()
  const updateCarMutation = useUpdateCar()
  const deleteCarMutation = useDeleteCar()

  const {
    data: cars,
    fetchNextPage,
    fetchPreviousPage,
  } = useCars(pageSize, [
    {
      field: CarSortFields.CarModelId,
      direction: SortDirection.Desc,
    },
  ])
  const { data: carModels } = useCarModels()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const onCloseCreateDialog = (data: CarInput | null) => {
    setIsCreateDialogOpen(false)
    if (!data) {
      return
    }

    toast.promise(createCarMutation.mutateAsync(data), {
      loading: t('toast.loading'),
      success: t('car.createDialog.success'),
      error: t('car.createDialog.error'),
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
        loading: t('toast.loading'),
        success: t('car.updateDialog.success'),
        error: t('car.updateDialog.error'),
      }
    )
  }

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
    const { vin, plateNumber, carModelId, color, colorHex } = param.row
    setCarInfo({
      vin,
      plateNumber,
      carModelId,
      color,
      colorHex,
    })
    setIsUpdateDialogOpen(true)
  }

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
        loading: t('toast.loading'),
        success: t('car.deleteDialog.success'),
        error: t('car.deleteDialog.error'),
      }
    )

    setIsDeleteDialogOpen(false)
  }

  const rows = useMemo(
    () =>
      cars?.pages[currentPageIndex]?.edges?.map(({ node }) => {
        const { id, vin, plateNumber, color, colorHex, carModelId, carModel, updatedAt } =
          node || {}

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
          batteryCapacity,
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
          colorHex,
          updatedAt,
          batteryCapacity,
        }
      }) || [],
    [cars, currentPageIndex]
  )

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('car.id'), description: t('car.id'), flex: 1 },
    { field: 'brand', headerName: t('car.brand'), description: t('car.brand'), flex: 1 },
    { field: 'model', headerName: t('car.model'), description: t('car.model'), flex: 1 },
    { field: 'color', headerName: t('car.color'), description: t('car.color'), flex: 1 },
    {
      field: 'plateNumber',
      headerName: t('car.plateNumber'),
      description: t('car.plateNumber'),
      flex: 1,
    },
    {
      field: 'bodyType',
      headerName: t('car.bodyType'),
      description: t('car.bodyType'),
      flex: 1,
    },
    {
      field: 'totalPower',
      headerName: t('car.totalPower'),
      description: t('car.totalPower'),
      flex: 1,
    },
    {
      field: 'batteryCapacity',
      headerName: t('car.batteryCapacity'),
      description: t('car.batteryCapacity'),
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: t('car.updatedDate'),
      description: t('car.updatedDate'),
      valueFormatter: (params: GridValueFormatterParams) =>
        formatDateWithPattern(params, DEFAULT_DATETIME_FORMAT),
      flex: 1,
      hide: true,
    },
    {
      field: 'topSpeed',
      headerName: t('car.topSpeed'),
      description: t('car.topSpeed'),
      flex: 1,
      hide: true,
    },
    {
      field: 'acceleration',
      headerName: t('car.acceleration'),
      description: t('car.acceleration'),
      flex: 1,
      hide: true,
    },
    {
      field: 'range',
      headerName: t('car.range'),
      description: t('car.range'),
      flex: 1,
      hide: true,
    },
    {
      field: 'connectorType',
      headerName: t('car.connectorType'),
      description: t('car.connectorType'),
      flex: 1,
      hide: true,
    },
    {
      field: 'chargeTime',
      headerName: t('car.chargeTime'),
      description: t('car.chargeTime'),
      flex: 1,
      hide: true,
    },
    {
      field: 'fastChargeTime',
      headerName: t('car.fastChargeTime'),
      description: t('car.fastChargeTime'),
      flex: 1,
      hide: true,
    },
    { field: 'vin', headerName: t('car.vin'), description: t('car.vin'), flex: 1 },
    {
      field: 'actions',
      headerName: t('car.actions'),
      description: t('car.actions'),
      sortable: false,
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

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          {t('car.createButton')}
        </Button>
      </PageToolbar>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={cars?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onFetchNextPage={fetchNextPage}
          onFetchPreviousPage={fetchPreviousPage}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={openEditCarDialog}
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
        title={t('car.deleteDialog.title')}
        message={`${t('car.deleteDialog.message')}: ${currentRowData.brand} - ${
          currentRowData.model
        }, ${currentRowData.color}, ${currentRowData.plateNumber} ?`}
        onConfirm={() => handleConfirmDelete(currentRowData)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Page>
  )
}
