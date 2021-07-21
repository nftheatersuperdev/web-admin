import { useState, useMemo, useEffect } from 'react'
import { Button, Card } from '@material-ui/core'
import {
  GridColDef,
  GridFilterModelParams,
  GridPageChangeParams,
  GridRowData,
  getGridNumericColumnOperators,
  getGridStringOperators,
  GridFilterItem,
} from '@material-ui/data-grid'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { formatDates, formatMoney } from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import { useCarModels, useCreatePrices, usePricing } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import {
  PackagePriceInput,
  PackagePriceSortFields,
  SortDirection,
  PackagePriceFilter,
} from 'services/evme.types'
import PricingCreateDialog from './PricingCreateDialog'
import PricingUpdateDialog from './PricingUpdateDialog'
import { getFieldComparator } from './utils'

const equalsOperators = getGridStringOperators().filter((operator) => operator.value === 'equals')

/**
 * The Pricing page contains all functionality for administering pricing information in EVme.
 *
 * For example, you can perform the following actions:
 * - 1. Create a price for a vehicle, which will directly reflect in the application
 * - 2. Add a price description, which will show as the second row of the price in the application
 */
export default function Pricing(): JSX.Element {
  const { t } = useTranslation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updatedModelId, setUpdatedModelId] = useState('')
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [priceFilter, setPriceFilter] = useState<PackagePriceFilter>({})
  const { data, refetch, fetchNextPage, fetchPreviousPage } = usePricing(pageSize, priceFilter, [
    {
      field: PackagePriceSortFields.CarModelId,
      direction: SortDirection.Desc,
    },
    {
      field: PackagePriceSortFields.Duration,
      direction: SortDirection.Desc,
    },
  ])
  const { data: carModels } = useCarModels()
  const mutationCreatePrice = useCreatePrices()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModelParams) => {
    setPriceFilter(
      params.filterModel.items.reduce(
        (filter, { columnField, operatorValue, value }: GridFilterItem) => {
          if (columnField && value) {
            const comparator = getFieldComparator(operatorValue)
            /* @ts-expect-error TODO */
            filter[columnField] = {
              [comparator]: columnField === 'price' ? +value : value,
            }
          }
          return filter
        },
        {} as PackagePriceFilter
      )
    )
  }

  useEffect(() => {
    refetch()
  }, [priceFilter, refetch])

  const carModelOptions = useMemo(
    () =>
      carModels?.edges?.map(({ node }) => ({
        id: node?.id,
        modelName: `${node?.brand} - ${node?.model}`,
      })) || [],
    [carModels]
  )

  const handleCreatePrice = (data: PackagePriceInput[] | null) => {
    setIsCreateDialogOpen(false)

    if (!data) {
      return
    }

    toast.promise(mutationCreatePrice.mutateAsync(data), {
      loading: t('toast.loading'),
      success: t('pricing.createDialog.success'),
      error: t('pricing.createDialog.error'),
    })
  }

  const handleUpdatePrice = (data: PackagePriceInput[] | null) => {
    setIsUpdateDialogOpen(false)

    if (!data) {
      return
    }

    toast.promise(mutationCreatePrice.mutateAsync(data), {
      loading: t('toast.loading'),
      success: t('pricing.updateDialog.success'),
      error: t('pricing.updateDialog.error'),
    })
  }

  const handleRowClick = (param: GridRowData) => {
    setIsUpdateDialogOpen(true)
    setUpdatedModelId(param.row.modelId)
  }

  const rows = useMemo(
    () =>
      data?.pages[currentPageIndex]?.edges?.map(({ node }) => ({
        id: node?.id,
        createdAt: node?.createdAt,
        updatedAt: node?.updatedAt,
        price: node?.price,
        duration: node?.duration,
        description: node?.description,
        fullPrice: node?.fullPrice,
        brand: node?.carModel?.brand,
        model: node?.carModel?.model,
        carModelId: node?.carModel?.id,
      })) || [],
    [data, currentPageIndex]
  )

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('pricing.id'),
      description: t('pricing.id'),
      flex: 1,
      filterOperators: equalsOperators,
    },
    {
      field: 'duration',
      headerName: t('pricing.duration'),
      description: t('pricing.duration'),
      flex: 1,
      filterOperators: equalsOperators,
    },
    {
      field: 'description',
      headerName: t('pricing.description'),
      description: t('pricing.description'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'brand',
      headerName: t('pricing.brand'),
      description: t('pricing.brand'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'model',
      headerName: t('pricing.model'),
      description: t('pricing.model'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'carModelId',
      headerName: t('pricing.modelId'),
      description: t('pricing.modelId'),
      flex: 1,
      filterOperators: equalsOperators,
    },
    {
      field: 'price',
      headerName: t('pricing.price'),
      description: t('pricing.price'),
      valueFormatter: formatMoney,
      flex: 1,
      filterOperators: getGridNumericColumnOperators(),
    },
    {
      field: 'fullPrice',
      headerName: t('pricing.fullPrice'),
      description: t('pricing.fullPrice'),
      valueFormatter: formatMoney,
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdAt',
      headerName: t('pricing.createdDate'),
      description: t('pricing.createdDate'),
      valueFormatter: formatDates,
      flex: 1,
      filterable: false,
    },
    {
      field: 'updatedAt',
      headerName: t('pricing.updatedDate'),
      description: t('pricing.updatedDate'),
      valueFormatter: formatDates,
      flex: 1,
      filterable: false,
    },
  ]

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          {t('pricing.createButton')}
        </Button>
      </PageToolbar>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={data?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onFetchNextPage={fetchNextPage}
          onFetchPreviousPage={fetchPreviousPage}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
          checkboxSelection
          disableSelectionOnClick
          filterMode="server"
          onFilterModelChange={handleFilterChange}
        />
      </Card>

      <PricingCreateDialog
        open={isCreateDialogOpen}
        onClose={(data) => handleCreatePrice(data)}
        modelOptions={carModelOptions}
      />

      <PricingUpdateDialog
        open={isUpdateDialogOpen}
        onClose={(data) => handleUpdatePrice(data)}
        modelOptions={carModelOptions}
        modelId={updatedModelId}
      />
    </Page>
  )
}
