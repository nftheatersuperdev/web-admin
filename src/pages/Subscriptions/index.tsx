import { useState, useEffect } from 'react'
import { Card, Button } from '@material-ui/core'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridRowData,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  columnFormatMoney,
  renderEmailLink,
  getIdFilterOperators,
  getStringFilterOperators,
  getNumericFilterOperators,
  getDateFilterOperators,
  getSelectFilterOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,
} from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import DataGridLocale from 'components/DataGridLocale'
import { useSubscriptions } from 'services/evme'
import { SubFilter } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import { columnFormatDuration, getDurationOptions } from 'pages/Pricing/utils'
import UpdateDialog from './UpdateDialog'

export default function Subscription(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState()
  const [subFilter, setSubFilter] = useState<SubFilter>({})

  const { data, refetch, fetchNextPage, fetchPreviousPage } = useSubscriptions(pageSize, subFilter)

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const numericFilterOperators = getNumericFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)
  const durationOptions = getDurationOptions(t)

  const handleRowClick = (data: GridRowData) => {
    setUpdateDialogOpen(true)
    setSelectedSubscription(data.row)
  }

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setSubFilter(
      params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        if (
          (columnField === 'carModelId' ||
            columnField === 'plateNumber' ||
            columnField === 'vin') &&
          value
        ) {
          filter.car = {
            [columnField]: {
              [operatorValue as string]:
                operatorValue === 'iLike' ? stringToFilterContains(value) : value,
            },
          }
          return filter
        }

        if ((columnField === 'price' || columnField === 'duration') && value) {
          filter.packagePrice = {
            [columnField]: {
              [operatorValue as string]: columnField === 'price' ? +value : value,
            },
          }
          return filter
        }

        if (
          (columnField === 'email' ||
            columnField === 'phoneNumber' ||
            columnField === 'firstName' ||
            columnField === 'lastName') &&
          value
        ) {
          filter.user = {
            [columnField]: {
              [operatorValue as string]:
                operatorValue === 'iLike' ? stringToFilterContains(value) : value,
            },
          }
          return filter
        }

        if ((columnField === 'startDate' || columnField === 'endDate') && value) {
          filter[columnField] = {
            [operatorValue as string]:
              operatorValue === 'between' ? dateToFilterOnDay(value) : dateToFilterNotOnDay(value),
          }
        }

        return filter
      }, {} as SubFilter)
    )
    // reset page
    setCurrentPageIndex(0)
  }

  useEffect(() => {
    refetch()
  }, [subFilter, refetch])

  const rows =
    data?.pages[currentPageIndex]?.edges?.map(({ node }) => ({
      id: node.id,
      vin: node.car?.vin,
      plateNumber: node.car?.plateNumber,
      brand: node.car?.carModel?.brand,
      model: node.car?.carModel?.model,
      price: node.packagePrice?.price,
      duration: node.packagePrice?.duration,
      seats: node.car?.carModel?.seats,
      topSpeed: node.car?.carModel?.topSpeed,
      fastChargeTime: node.car?.carModel?.fastChargeTime,
      startDate: node.startDate,
      endDate: node.endDate,
      startAddress: node.startAddress?.full,
      startLat: node.startAddress?.latitude,
      startLng: node.startAddress?.longitude,
      endAddress: node.endAddress?.full,
      endLat: node.endAddress?.latitude,
      endLng: node.endAddress?.longitude,
      createdAt: node.createdAt,
      updatedAt: node.updatedAt,
      email: node.user.email,
      phoneNumber: node.user.phoneNumber,
      firstName: node.user.firstName,
      lastName: node.user.lastName,
      // not shown in table
      color: node.car?.color,
      carModelId: node.car?.carModel?.id,
    })) || []

  const columns: GridColDef[] = [
    {
      field: 'brand',
      headerName: t('subscription.brand'),
      description: t('subscription.brand'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'model',
      headerName: t('subscription.model'),
      description: t('subscription.model'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'carModelId',
      headerName: t('subscription.modelId'),
      description: t('subscription.modelId'),
      flex: 1,
      filterOperators: idFilterOperators,
    },
    {
      field: 'seats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'topSpeed',
      headerName: t('subscription.topSpeed'),
      description: t('subscription.topSpeed'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('subscription.plateNumber'),
      description: t('subscription.plateNumber'),
      flex: 1,
      hide: true,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'vin',
      headerName: t('subscription.vin'),
      description: t('subscription.vin'),
      flex: 1,
      hide: true,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'price',
      headerName: t('subscription.price'),
      description: t('subscription.price'),
      valueFormatter: columnFormatMoney,
      flex: 1,
      filterOperators: numericFilterOperators,
    },
    {
      field: 'duration',
      headerName: t('subscription.duration'),
      description: t('subscription.duration'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        columnFormatDuration(params.value as string, t),
      filterOperators: selectFilterOperators,
      valueOptions: durationOptions,
    },
    {
      field: 'fastChargeTime',
      headerName: t('subscription.fastChargeTime'),
      description: t('subscription.fastChargeTime'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'startDate',
      headerName: t('subscription.startDate'),
      description: t('subscription.startDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: t('subscription.endDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'startAddress',
      headerName: t('subscription.startAddress'),
      description: t('subscription.startAddress'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'endAddress',
      headerName: t('subscription.endAddress'),
      description: t('subscription.endAddress'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'createdAt',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'updatedAt',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'email',
      headerName: t('subscription.email'),
      description: t('subscription.email'),
      renderCell: renderEmailLink,
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'phoneNumber',
      headerName: t('subscription.phone'),
      description: t('subscription.phone'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'firstName',
      headerName: t('subscription.firstName'),
      description: t('subscription.firstName'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'lastName',
      headerName: t('subscription.lastName'),
      description: t('subscription.lastName'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
  ]

  return (
    <Page>
      <PageToolbar>
        <a href="https://dashboard.omise.co/" target="_blank" rel="noreferrer">
          <Button color="primary" variant="contained">
            {t('subscription.omiseButton')}
          </Button>
        </a>
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
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleRowClick}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
        />
      </Card>

      <UpdateDialog
        open={isUpdateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        subscription={selectedSubscription}
      />
    </Page>
  )
}
