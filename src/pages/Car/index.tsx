import { Fragment, useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  GridColDef,
  GridRowData,
  GridCellParams,
  GridPageChangeParams,
  GridFilterModel,
  GridFilterItem,
  GridSortModel,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  getIdFilterOperators,
  getStringFilterOperators,
  getSelectFilterOperators,
  stringToFilterContains,
} from 'utils'
import config from 'config'
import { useAuth } from 'auth/AuthContext'
import {
  useCarModels,
  useCreateCar,
  useUpdateCar,
  useUpdateCarStatus,
  useDeleteCar,
} from 'services/evme'
import PageToolbar from 'layout/PageToolbar'
import { CarInput, CarFilter, SortDirection, SubOrder } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import ConfirmDialog from 'components/ConfirmDialog'
import { getList } from 'services/web-bff/car'
import { CarListQuery } from 'services/web-bff/car.type'
import CarCreateDialog from './CarCreateDialog'
import CarUpdateDialog, { CarInfo } from './CarUpdateDialog'
import {
  getCarStatusOptions,
  columnFormatCarStatus,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
} from './utils'

const HideSection = styled(Button)`
  display: none;
`

export default function Car(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [selectedCarId, setSelectedCarId] = useState('')
  const [carInfo, setCarInfo] = useState({} as CarInfo)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({} as GridRowData)
  const createCarMutation = useCreateCar()
  const updateCarMutation = useUpdateCar()
  const updateCarStatusMutation = useUpdateCarStatus()
  const deleteCarMutation = useDeleteCar()
  const [carFilter, setCarFilter] = useState<CarFilter>({})
  const [carSort, setCarSort] = useState<SubOrder>({})

  const accessToken = useAuth().getToken() ?? ''
  const [query] = useState<CarListQuery>()
  const {
    data: carData,
    refetch,
    isFetching,
  } = useQuery('cars', () =>
    getList({
      accessToken,
      query,
      sort: carSort,
    })
  )

  const { data: carModels } = useCarModels(config.maxInteger)

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)
  const statusOptions = getCarStatusOptions(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setCarFilter(
      params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (operatorValue === 'iLike' && value) {
          filterValue = stringToFilterContains(value)
        }

        if (filterValue) {
          /* @ts-expect-error TODO */
          filter[columnField] = {
            [operatorValue as string]: filterValue,
          }
        }

        return filter
      }, {} as CarFilter)
    )
    // reset page
    setCurrentPageIndex(0)
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const onColumnVisibilityChange = (params: any) => {
    if (params.field === '__check__') {
      return
    }

    const visibilityColumns = params.api.current
      .getAllColumns()
      .filter(({ field }: { field: string }) => field !== '__check__')
      .reduce((columns: VisibilityColumns, column: { field: string; hide: boolean }) => {
        columns[column.field] = !column.hide
        return columns
      }, {})

    visibilityColumns[params.field] = params.isVisible

    setVisibilityColumns(visibilityColumns)
  }

  const handleSortChange = (params: GridSortModel) => {
    if (params?.length > 0 && !isFetching) {
      const { field: refField, sort } = params[0]

      const order: SubOrder = {
        [refField]: sort?.toLocaleLowerCase() === 'asc' ? SortDirection.Asc : SortDirection.Desc,
      }

      setCarSort(order)
      refetch()
    }
  }

  useEffect(() => {
    refetch()
  }, [carFilter, refetch])

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

  const onCloseEditDialog = async (data: CarInput | null) => {
    setIsUpdateDialogOpen(false)
    if (!data) {
      return
    }

    await toast.promise(
      Promise.all([
        updateCarStatusMutation.mutateAsync({
          carId: selectedCarId,
          status: data.status,
        }),
        updateCarMutation.mutateAsync({
          id: selectedCarId,
          update: {
            carModelId: data.carModelId,
            color: data.color,
            colorHex: data.colorHex,
          },
        }),
      ]),
      {
        loading: t('toast.loading'),
        success: t('car.updateDialog.success'),
        error: t('car.updateDialog.error'),
      }
    )

    refetch()

    /**
     * @DESCRIPTION Disable the update following as our backend disabled this function
     */
    // toast.promise(
    //   updateCarMutation.mutateAsync({
    //     update: data,
    //     id: selectedCarId,
    //   }),
    //   {
    //     loading: t('toast.loading'),
    //     success: t('car.updateDialog.success'),
    //     error: t('car.updateDialog.error'),
    //   }
    // )
  }

  const carModelOptions = useMemo(
    () =>
      carModels?.pages[0].edges?.map(({ node }) => ({
        id: node?.id,
        modelName: `${node?.brand} - ${node?.model}`,
      })) || [],
    [carModels]
  )

  const openEditCarDialog = (param: GridRowData) => {
    setSelectedCarId(param.id)
    const { vin, plateNumber, carModelId, color, colorHex, status } = param.row

    setCarInfo({
      vin,
      plateNumber,
      carModelId,
      color,
      colorHex,
      status,
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

  const rowCount = carData?.data.pagination.totalRecords
  const rows =
    carData?.data.cars.map((car) => {
      return {
        id: car.id,
        name: car.name,
        brand: car.brand,
        vin: car.vin,
        plateNumber: car.plateNumber,
        color: car.color,
        colorHex: car.colorHex,
        topSpeed: car.topSpeed,
        acceleration: car.acceleration,
        range: car.range,
        totalPower: car.totalPower,
        batteryCapacity: car.batteryCapacity,
        chargeTime: car.chargeTime,
        fastChargeTime: car.fastChargeTime,
        connectorType: car.connectorType.description,
        bodyType: car.bodyType.description,
        createdDate: car.createdDate,
        updatedDate: car.updatedDate,
        status: car.status,
      }
    }) ?? []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('car.id'),
      description: t('car.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: idFilterOperators,
      sortable: true,
    },
    {
      field: 'brand',
      headerName: t('car.brand'),
      description: t('car.brand'),
      hide: !visibilityColumns.brand,
      flex: 1,
      filterable: false,
    },
    {
      field: 'model',
      headerName: t('car.model'),
      description: t('car.model'),
      hide: !visibilityColumns.model,
      flex: 1,
      filterable: false,
    },
    {
      field: 'color',
      headerName: t('car.color'),
      description: t('car.color'),
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.color,
      flex: 1,
    },
    {
      field: 'vin',
      headerName: t('car.vin'),
      description: t('car.vin'),
      filterOperators: stringFilterOperators,
      flex: 1,
      hide: !visibilityColumns.vin,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('car.plateNumber'),
      description: t('car.plateNumber'),
      hide: !visibilityColumns.plateNumber,
      flex: 1,
      filterOperators: stringFilterOperators,
      sortable: false,
    },
    {
      field: 'bodyType',
      headerName: t('car.bodyType'),
      description: t('car.bodyType'),
      hide: !visibilityColumns.bodyType,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'totalPower',
      headerName: t('car.totalPower'),
      description: t('car.totalPower'),
      hide: !visibilityColumns.totalPower,
      flex: 1,
      filterable: false,
    },
    {
      field: 'batteryCapacity',
      headerName: t('car.batteryCapacity'),
      description: t('car.batteryCapacity'),
      hide: !visibilityColumns.batteryCapacity,
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdDate',
      headerName: t('car.createdDate'),
      description: t('car.createdDate'),
      hide: !visibilityColumns.createdDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'updatedDate',
      headerName: t('car.updatedDate'),
      description: t('car.updatedDate'),
      hide: !visibilityColumns.updatedDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'topSpeed',
      headerName: t('car.topSpeed'),
      description: t('car.topSpeed'),
      hide: !visibilityColumns.topSpeed,
      flex: 1,
      filterable: false,
    },
    {
      field: 'acceleration',
      headerName: t('car.acceleration'),
      description: t('car.acceleration'),
      hide: !visibilityColumns.acceleration,
      flex: 1,
      filterable: false,
    },
    {
      field: 'range',
      headerName: t('car.range'),
      description: t('car.range'),
      hide: !visibilityColumns.range,
      flex: 1,
      filterable: false,
    },
    {
      field: 'connectorType',
      headerName: t('car.connectorType'),
      description: t('car.connectorType'),
      hide: !visibilityColumns.connectorType,
      flex: 1,
      filterable: false,
    },
    {
      field: 'chargeTime',
      headerName: t('car.chargeTime'),
      description: t('car.chargeTime'),
      hide: !visibilityColumns.chargeTime,
      flex: 1,
      filterable: false,
    },
    {
      field: 'fastChargeTime',
      headerName: t('car.fastChargeTime'),
      description: t('car.fastChargeTime'),
      hide: !visibilityColumns.fastChargeTime,
      flex: 1,
      filterable: false,
    },
    {
      field: 'status',
      flex: 1,
      headerName: t('car.status'),
      description: t('car.status'),
      hide: !visibilityColumns.status,
      filterOperators: selectFilterOperators,
      valueFormatter: (params: GridValueFormatterParams) =>
        columnFormatCarStatus(params.value as string, t),
      valueOptions: statusOptions,
      filterable: true,
      sortable: false,
    },
    {
      field: 'actions',
      headerName: t('car.actions'),
      description: t('car.actions'),
      sortable: false,
      filterable: false,
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
        <HideSection>
          <Button
            color="primary"
            disabled
            variant="contained"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            {t('car.createButton')}
          </Button>
        </HideSection>
      </PageToolbar>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={openEditCarDialog}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
          sortingMode="server"
          onSortModelChange={handleSortChange}
          loading={isFetching}
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
