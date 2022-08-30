import { useHistory } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Card, IconButton } from '@material-ui/core'
import {
  GridCellParams,
  GridColDef,
  GridPageChangeParams,
  GridFilterModel,
  GridFilterItem,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { columnFormatDate, getOnlyEqualFilterOperators } from 'utils'
import config from 'config'
import { Edit as EditIcon } from '@material-ui/icons'
import { useQuery } from 'react-query'
import { getListBFF } from 'services/web-bff/car'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import { CarListFilterRequest } from 'services/web-bff/car.type'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

export default function ModelAndPricing(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(config.tableRowsDefaultPageSize)
  const [filter, setFilter] = useState<CarListFilterRequest>({})

  const {
    data: cars,
    refetch,
    isFetching,
  } = useQuery('model-and-pricing-page', () => getListBFF({ filter, page, size: pageSize }))

  const onlyEqualFilterOperator = getOnlyEqualFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPage(0)
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setFilter(
      params.items.reduce((filter, { value }: GridFilterItem) => {
        if (value) {
          filter.carId = value
        }

        return filter
      }, {} as CarListFilterRequest)
    )
    setPage(0)
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

  useEffect(() => {
    refetch()
  }, [filter, page, pageSize, refetch])

  const rowCount = cars?.data.pagination.totalRecords
  const rows = useMemo(
    () =>
      cars?.data.cars?.map((car) => ({
        id: car?.id || '-',
        modelId: car?.carSku?.carModel?.id || '-',
        brand: car?.carSku?.carModel?.brand?.name || '-',
        name: car?.carSku?.carModel?.name || '-',
        createdDate: car?.createdDate || '-',
        updatedDate: car?.updatedDate || '-',
      })) || [],
    [cars]
  )

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('pricing.id'),
      description: t('pricing.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: onlyEqualFilterOperator,
    },
    {
      field: 'modelId',
      headerName: t('pricing.modelId'),
      description: t('pricing.modelId'),
      hide: !visibilityColumns.modelId,
      flex: 1,
      filterable: false,
      // filterOperators: idFilterOperators,
    },
    {
      field: 'brand',
      headerName: t('pricing.brand'),
      description: t('pricing.brand'),
      hide: !visibilityColumns.brand,
      flex: 1,
      filterable: false,
    },
    {
      field: 'name',
      headerName: t('pricing.model'),
      description: t('pricing.model'),
      hide: !visibilityColumns.name,
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdDate',
      headerName: t('pricing.createdDate'),
      description: t('pricing.createdDate'),
      hide: !visibilityColumns.createdDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'updatedDate',
      headerName: t('pricing.updatedDate'),
      description: t('pricing.updatedDate'),
      hide: !visibilityColumns.updatedDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'actions',
      headerName: t('car.actions'),
      description: t('car.actions'),
      hide: !visibilityColumns.actions,
      flex: 1,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => history.push(`/model-and-pricing/${row.modelId}/edit`)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ]

  return (
    <Page>
      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={page}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
          onColumnVisibilityChange={onColumnVisibilityChange}
          rows={rows}
          columns={columns}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          loading={isFetching}
        />
      </Card>
    </Page>
  )
}
