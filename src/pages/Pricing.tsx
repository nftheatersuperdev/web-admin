import { useState } from 'react'
import { Button, Card } from '@material-ui/core'
import {
  DataGrid,
  GridColDef,
  GridPageChangeParams,
  GridRowData,
  GridToolbar,
} from '@material-ui/data-grid'
import { formatDates, formatMoney } from 'utils'
import { ICarModelItem } from 'helper/car.helper'
import toast from 'react-hot-toast'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import { useCars, useCreatePrices, usePricing } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import { PackagePriceInput, PackagePriceSortFields, SortDirection } from 'services/evme.types'
import PricingCreateDialog from './PricingCreateDialog'
import PricingUpdateDialog from './PricingUpdateDialog'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
  { field: 'duration', headerName: 'Duration', description: 'Duration', flex: 1 },
  { field: 'brand', headerName: 'Car Brand', description: 'Car Brand', flex: 1 },
  { field: 'model', headerName: 'Model', description: 'Model', flex: 1 },
  {
    field: 'price',
    headerName: 'Price',
    description: 'Price',
    valueFormatter: formatMoney,
    flex: 1,
  },
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
]

export default function Pricing(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [updatedModelId, setUpdatedModelId] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { data, fetchNextPage, fetchPreviousPage } = usePricing(pageSize, [
    {
      field: PackagePriceSortFields.CarModelId,
      direction: SortDirection.Desc,
    },
  ])
  const { data: carModelList } = useCars()
  const mutationCreatePrice = useCreatePrices()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handlePageChange = (params: GridPageChangeParams) => {
    // If we navigate FORWARD in our pages, i.e. the new page number is higher than current page
    if (params.page > currentPageIndex) {
      fetchNextPage()
    }
    // If we navigate BACKWARD in our pages, i.e. the new page number is lower than current page
    else {
      fetchPreviousPage()
    }
    setCurrentPageIndex(params.page)
  }

  // Transform response into table format
  const rows = data?.pages[currentPageIndex]?.edges?.map(({ node }) => ({
    id: node?.id,
    createdAt: node?.createdAt,
    updatedAt: node?.updatedAt,
    price: node?.price,
    duration: node?.duration,
    brand: node?.carModel?.brand,
    model: node?.carModel?.model,
    modelId: node?.carModel?.id,
  }))

  const carModelOptions = [] as ICarModelItem[]

  // INFO: parsing option to display in dialog select element
  carModelList?.edges?.forEach(({ node }) => {
    carModelOptions.push({
      id: node?.id,
      modelName: `${node?.brand} - ${node?.model}`,
    })
  })

  const handleCreatePrice = (data: PackagePriceInput[] | null) => {
    setIsCreateDialogOpen(false)
    if (!data) {
      return
    }

    toast.promise(mutationCreatePrice.mutateAsync(data), {
      loading: 'Loading',
      success: 'Create price successfully!',
      error: 'Failed to create price! 11',
    })
  }

  const handleUpdatePrice = (data: PackagePriceInput[] | null) => {
    setIsUpdateDialogOpen(false)

    if (!data) {
      return
    }

    toast.promise(mutationCreatePrice.mutateAsync(data), {
      loading: 'Loading',
      success: 'Update price successfully!',
      error: 'Failed to update price!',
    })
  }

  const handleRowClick = (param: GridRowData) => {
    setIsUpdateDialogOpen(true)
    setUpdatedModelId(param.row.modelId)
  }

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          New Price
        </Button>
      </PageToolbar>
      {rows ? (
        <Card>
          <DataGrid
            autoHeight
            pagination
            pageSize={pageSize}
            page={currentPageIndex}
            rowCount={data?.pages[currentPageIndex]?.totalCount}
            paginationMode="server"
            rowsPerPageOptions={config.tableRowsPerPageOptions}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={handlePageChange}
            rows={rows}
            columns={columns}
            components={{
              Toolbar: GridToolbar,
            }}
            onRowClick={handleRowClick}
            checkboxSelection
            disableSelectionOnClick
          />
        </Card>
      ) : null}
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
