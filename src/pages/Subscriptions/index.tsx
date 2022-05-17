import config from 'config'
import { Card } from '@material-ui/core'
import {
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridPageChangeParams,
  GridRowData,
  GridFilterModel,
  GridFilterItem,
  GridValueFormatterParams,
  GridToolbarExport,
} from '@material-ui/data-grid'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  columnFormatText,
  convertMoneyFormat,
  geEqualtDateOperators,
  getEqualFilterOperators,
  getSelectEqualFilterOperators,
} from 'utils'
import { useLocation } from 'react-router-dom'
import { getList } from 'services/web-bff/subscription'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import {
  columnFormatPaymentEventStatus,
  columnFormatSubEventStatus,
  convertToDuration,
  getIsParentOptions,
  getLastedPayment,
  getListFromQueryParam,
  getSubEventStatusOptions,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
} from 'pages/Subscriptions/utils'
import UpdateDialog from 'pages/Subscriptions/UpdateDialog'
import { SubscriptionListQuery } from 'services/web-bff/subscription.type'
import { Payment } from 'services/web-bff/payment.type'

const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport csvOptions={{ allColumns: true }} />
  </GridToolbarContainer>
)

export default function Subscription(): JSX.Element {
  const { t } = useTranslation()
  const searchParams = useLocation().search
  const queryString = new URLSearchParams(searchParams)
  const statusList: string[] = getListFromQueryParam(queryString, 'status')
  const deliverDate = queryString.get('deliverDate')
  const returnDate = queryString.get('returnDate')

  const visibilityColumns = getVisibilityColumns()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState()
  const defaultFilter: SubscriptionListQuery = {
    deliverDate: deliverDate || null,
    returnDate: returnDate || null,
    statusList,
    size: pageSize,
    page: currentPageIndex + 1,
  } as SubscriptionListQuery

  const equalOperators = getEqualFilterOperators(t)
  const equalSelectFilterOperators = getSelectEqualFilterOperators(t)
  const dateEqualOperators = geEqualtDateOperators(t)

  const [subscriptionFilter, setSubscriptionFilter] = useState<SubscriptionListQuery>({
    ...defaultFilter,
  })

  const {
    data: response,
    isFetching,
    refetch,
  } = useQuery('subscriptions', () => getList({ query: subscriptionFilter }))

  const rowCount = response?.data.pagination.totalRecords ?? 0
  const rows =
    response?.data.records && response?.data.records.length > 0
      ? response?.data.records.map((subscription) => {
          const lastedPayment = getLastedPayment(subscription.payments as unknown as Payment[])
          const paymentStatus = lastedPayment
            ? columnFormatPaymentEventStatus(lastedPayment.status, t)
            : '-'
          const subscriptionPrice =
            subscription?.chargedPrice !== null
              ? convertMoneyFormat(subscription?.chargedPrice)
              : '-'
          const subscriptionPriceFullFormat = `${subscriptionPrice} ${t('pricing.currency.thb')}`

          return (
            {
              id: subscription.id,
              userFirstName: subscription.user.firstName,
              userLastName: subscription.user.lastName,
              userEmail: subscription.user.email,
              userPhoneNumber: subscription.user.phoneNumber,
              carId: subscription.car.id,
              carModelId: subscription.car.carSku?.carModel.id,
              carName: subscription.car.carSku?.carModel.name,
              carBrand: subscription.car.carSku?.carModel.brand.name,
              carColor: subscription.car.carSku?.color,
              carPlateNumber: subscription.car.plateNumber,
              carVin: subscription.car.vin,
              carSeats: subscription.car.carSku?.carModel.seats,
              carTopSpeed: subscription.car.carSku?.carModel.topSpeed,
              carFastChargeTime: subscription.car.carSku?.carModel.fastChargeTime,
              price: subscriptionPriceFullFormat,
              duration: convertToDuration(subscription.durationDay, t),
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              deliveryAddress: subscription.deliveryFullAddress,
              deliveryLatitude: subscription.deliveryLatitude,
              deliveryLongitude: subscription.deliveryLongitude,
              deliveryRemark: subscription.deliveryRemark,
              returnAddress: subscription.returnFullAddress,
              returnLatitude: subscription.returnLatitude,
              returnLongitude: subscription.returnLongitude,
              returnRemark: subscription.returnRemark,
              status: subscription.status,
              voucherId: subscription.voucherId,
              createdDate: subscription.createdDate,
              updatedDate: subscription.updatedDate,
              paymentStatus,
              paymentCreateDate: lastedPayment?.createdDate || '-',
              deliverDate: subscription.deliveryDateTime,
              returnDate: subscription.returnDateTime,
              failureMessage: lastedPayment?.statusMessage,
              payments: subscription.payments,
              parentId: subscription.parentId,
              voucherCode: subscription.voucher ? subscription.voucher.code : '',
              isExtendedSubscription: subscription.parentId ? 'True' : 'False',
            } ?? {}
          )
        })
      : []

  useEffect(() => {
    refetch()
  }, [subscriptionFilter, refetch])

  useEffect(() => {
    refetch()
  }, [refetch, pageSize])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('subscription.id'),
      description: t('subscription.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: equalOperators,
      valueFormatter: columnFormatText,
    },
    {
      field: 'userFirstName',
      headerName: t('subscription.firstName'),
      description: t('subscription.firstName'),
      flex: 1,
      hide: !visibilityColumns.userFirstName,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'userLastName',
      headerName: t('subscription.lastName'),
      description: t('subscription.lastName'),
      flex: 1,
      hide: !visibilityColumns.userLastName,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'userEmail',
      headerName: t('subscription.email'),
      description: t('subscription.email'),
      flex: 1,
      hide: !visibilityColumns.userEmail,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'userPhoneNumber',
      headerName: t('subscription.phone'),
      description: t('subscription.phone'),
      flex: 1,
      hide: !visibilityColumns.userPhoneNumber,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carId',
      headerName: t('subscription.modelId'),
      description: t('subscription.modelId'),
      flex: 1,
      hide: !visibilityColumns.carId,
      sortable: false,
      filterOperators: equalOperators,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carName',
      headerName: t('subscription.model'),
      description: t('subscription.model'),
      flex: 1,
      hide: !visibilityColumns.carName,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carBrand',
      headerName: t('subscription.brand'),
      description: t('subscription.brand'),
      flex: 1,
      hide: !visibilityColumns.carBrand,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carSeats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 1,
      hide: !visibilityColumns.carSeats,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carTopSpeed',
      headerName: t('subscription.topSpeed'),
      description: t('subscription.topSpeed'),
      flex: 1,
      hide: !visibilityColumns.carTopSpeed,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carPlateNumber',
      headerName: t('subscription.plateNumber'),
      description: t('subscription.plateNumber'),
      flex: 1,
      hide: !visibilityColumns.carPlateNumber,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carVin',
      headerName: t('subscription.vin'),
      description: t('subscription.vin'),
      flex: 1,
      hide: !visibilityColumns.carVin,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'carFastChargeTime',
      headerName: t('subscription.fastChargeTime'),
      description: t('subscription.fastChargeTime'),
      flex: 1,
      hide: !visibilityColumns.carFastChargeTime,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'price',
      headerName: t('subscription.price'),
      description: t('subscription.price'),
      flex: 1,
      hide: !visibilityColumns.price,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'duration',
      headerName: t('subscription.duration'),
      description: t('subscription.duration'),
      flex: 1,
      hide: !visibilityColumns.duration,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'startDate',
      headerName: t('subscription.startDate'),
      description: t('subscription.startDate'),
      flex: 1,
      hide: !visibilityColumns.startDate,
      sortable: true,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: t('subscription.endDate'),
      flex: 1,
      hide: !visibilityColumns.endDate,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'deliveryAddress',
      headerName: t('subscription.startAddress'),
      description: t('subscription.startAddress'),
      flex: 1,
      hide: !visibilityColumns.deliveryAddress,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'returnAddress',
      headerName: t('subscription.endAddress'),
      description: t('subscription.endAddress'),
      flex: 1,
      hide: !visibilityColumns.returnAddress,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'status',
      headerName: t('subscription.status.title'),
      description: t('subscription.status.title'),
      flex: 1,
      hide: !visibilityColumns.status,
      sortable: false,
      valueFormatter: (params: GridValueFormatterParams): string => {
        return columnFormatSubEventStatus(params.value as string, t)
      },
      filterOperators: equalSelectFilterOperators,
      valueOptions: getSubEventStatusOptions(t),
    },
    {
      field: 'parentId',
      headerName: t('subscription.parentId'),
      description: t('subscription.parentId'),
      flex: 1,
      hide: !visibilityColumns.parentId,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'isExtendedSubscription',
      headerName: t('subscription.isExtendedSubscription'),
      description: t('subscription.isExtendedSubscription'),
      flex: 1,
      hide: !visibilityColumns.isExtendedSubscription,
      filterable: true,
      sortable: false,
      disableColumnMenu: true,
      filterOperators: equalSelectFilterOperators,
      valueOptions: getIsParentOptions(t),
    },
    {
      field: 'voucherId',
      headerName: t('subscription.voucherId'),
      description: t('subscription.voucherId'),
      flex: 1,
      hide: !visibilityColumns.voucherId,
      filterable: true,
      sortable: false,
      filterOperators: equalOperators,
      valueFormatter: columnFormatText,
    },
    {
      field: 'createdDate',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      flex: 1,
      hide: !visibilityColumns.createdDate,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'updatedDate',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      flex: 1,
      hide: !visibilityColumns.updatedDate,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'paymentStatus',
      headerName: t('subscription.payment.status'),
      description: t('subscription.payment.status'),
      flex: 1,
      hide: !visibilityColumns.paymentStatus,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'failureMessage',
      headerName: t('subscription.payment.failureMessage'),
      description: t('subscription.payment.failureMessage'),
      flex: 1,
      hide: !visibilityColumns.failureMessage,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'paymentCreateDate',
      headerName: t('subscription.payment.updatedDate'),
      description: t('subscription.payment.updatedDate'),
      flex: 1,
      hide: !visibilityColumns.paymentCreateDate,
      filterable: false,
      sortable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'deliverDate',
      headerName: t('subscription.deliveryDate'),
      description: t('subscription.deliveryDate'),
      flex: 1,
      hide: !visibilityColumns.deliverDate,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'returnDate',
      headerName: t('subscription.returnDate'),
      description: t('subscription.returnDate'),
      flex: 1,
      hide: !visibilityColumns.returnDate,
      filterable: true,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setSubscriptionFilter({ ...subscriptionFilter, size: params.pageSize, page: 1 })
    setPageSize(params.pageSize)
    setCurrentPageIndex(0)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    const _defaultFilter: SubscriptionListQuery = {
      size: pageSize,
      page: currentPageIndex + 1,
      statusList: [],
    } as SubscriptionListQuery

    setSubscriptionFilter({
      ...params.items.reduce((filter, { columnField, value }: GridFilterItem) => {
        if (columnField) {
          if (columnField === 'status') {
            filter = { ..._defaultFilter, statusList: [value] }
          } else {
            filter = { ..._defaultFilter, [columnField]: value }
          }
        }
        return filter
      }, {} as SubscriptionListQuery),
    })

    // reset page
    setCurrentPageIndex(0)
  }

  const handleRowClick = (data: GridRowData) => {
    setUpdateDialogOpen(true)
    setSelectedSubscription(data.row)
  }

  const handleFetchPage = (pageNumber: number) => {
    setSubscriptionFilter({ ...subscriptionFilter, page: pageNumber + 1 })
    setCurrentPageIndex(pageNumber)
  }

  return (
    <Page>
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
          onColumnVisibilityChange={onColumnVisibilityChange}
          onRowClick={handleRowClick}
          filterMode="server"
          checkboxSelection
          onFilterModelChange={handleFilterChange}
          loading={isFetching}
          customToolbar={customToolbar}
          onFetchNextPage={() => handleFetchPage(currentPageIndex + 1)}
          onFetchPreviousPage={() => handleFetchPage(currentPageIndex - 1)}
        />
      </Card>

      <UpdateDialog
        open={isUpdateDialogOpen}
        onClose={(needRefetch) => {
          if (needRefetch) {
            refetch()
          }
          setUpdateDialogOpen(false)
        }}
        subscription={selectedSubscription}
      />
    </Page>
  )
}
