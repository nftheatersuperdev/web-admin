import config from 'config'
import { Button, Card } from '@material-ui/core'
import {
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  // GridToolbarExport,
  GridToolbarDensitySelector,
  GridPageChangeParams,
  GridRowData,
  GridFilterModel,
  GridFilterItem,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  columnFormatText,
  convertMoneyFormat,
  firstCapitalize,
  geEqualtDateOperators,
  getEqualFilterOperators,
  getSelectEqualFilterOperators,
} from 'utils'
import { Link, useLocation, useHistory } from 'react-router-dom'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getList } from 'services/web-bff/subscription'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import {
  columnFormatSubEventStatus,
  convertToDuration,
  getIsParentOptions,
  getListFromQueryParam,
  getSubEventStatusOptions,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
} from 'pages/Subscriptions/utils'
import {
  SubscriptionBookingListQuery,
  SubscriptionBookingListFilters,
} from 'services/web-bff/subscription.type'
// import FilterBar from 'pages/Subscriptions/FilterBar'

const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <GridToolbarFilterButton />
    {/* <GridToolbarExport csvOptions={{ allColumns: true }} /> */}
  </GridToolbarContainer>
)

export default function Subscription(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const searchParams = useLocation().search
  const queryString = new URLSearchParams(searchParams)
  const statusList: string[] = getListFromQueryParam(queryString, 'status')
  const bookingDetailId: string = getListFromQueryParam(queryString, 'bookingDetailId')[0]
  const deliveryDate = queryString.get('deliveryDate')
  const returnDate = queryString.get('returnDate')

  const visibilityColumns = getVisibilityColumns()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const defaultQuery: SubscriptionBookingListQuery = {
    page: currentPageIndex + 1,
    size: pageSize,
  }
  const defaultFilters: SubscriptionBookingListFilters = {
    bookingDetailId: bookingDetailId || null,
    deliveryDate: deliveryDate || null,
    returnDate: returnDate || null,
    statusList: statusList || [],
  }

  const equalOperators = getEqualFilterOperators(t)
  const equalSelectFilterOperators = getSelectEqualFilterOperators(t)
  const dateEqualOperators = geEqualtDateOperators(t)

  const [query, setQuery] = useState<SubscriptionBookingListQuery>(defaultQuery)
  const [filters, setFilters] = useState<SubscriptionBookingListFilters>(defaultFilters)

  const {
    data: response,
    isFetching,
    refetch,
  } = useQuery('subscriptions', () => getList({ query, filters }))

  const rowCount = response?.data?.pagination?.totalRecords || 0
  const rows =
    response?.data.bookingDetails && response?.data.bookingDetails.length > 0
      ? response?.data.bookingDetails.map((subscription) => {
          const subscriptionPrice =
            subscription.rentDetail.chargePrice !== null
              ? convertMoneyFormat(subscription.rentDetail.chargePrice)
              : '-'
          const subscriptionPriceFullFormat = `${subscriptionPrice} ${t('pricing.currency.thb')}`

          return (
            {
              ...subscription,
              bookingDetailId: subscription.id,
              userFirstName: subscription.customer.firstName,
              userLastName: subscription.customer.lastName,
              userEmail: subscription.customer.email,
              userPhoneNumber: subscription.customer.phoneNumber,
              carId: subscription.carId,
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
              duration: convertToDuration(subscription.rentDetail.durationDay, t),
              startDate: subscription.startDate,
              endDate: subscription.endDate,
              status: subscription.displayStatus,
              voucherId: subscription.rentDetail.voucherId || '',
              voucherCode: subscription.rentDetail.voucherCode || '',
              createdDate: subscription.rentDetail.createdDate,
              updatedDate: subscription.rentDetail.updatedDate,
              paymentStatus: firstCapitalize(subscription?.payments[0]?.status) || '-',
              failureMessage: subscription?.payments[0]?.statusMessage || '-',
              paymentCreateDate: subscription?.payments[0]?.createdDate || '-',
              parentId: subscription.bookingId,
              isExtend: Boolean(subscription.isExtend),
              customerId: subscription.customerId || '-',
              cleaningDate: subscription.endDate,
              payments: subscription?.payments || [],
            } ?? {}
          )
        })
      : []

  useEffect(() => {
    refetch()
  }, [filters, refetch])

  useEffect(() => {
    refetch()
  }, [refetch, pageSize])

  const columns: GridColDef[] = [
    {
      field: 'bookingDetailId',
      headerName: t('subscription.bookingDetailId'),
      description: t('subscription.bookingDetailId'),
      hide: !visibilityColumns.bookingDetailId,
      flex: 1,
      filterOperators: equalOperators,
      valueFormatter: columnFormatText,
    },
    {
      field: 'customerId',
      headerName: t('subscription.customerId'),
      description: t('subscription.customerId'),
      hide: !visibilityColumns.customerId,
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
      filterable: true,
      filterOperators: equalOperators,
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
      headerName: t('subscription.carId'),
      description: t('subscription.carId'),
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
      filterable: true,
      filterOperators: equalOperators,
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
      field: 'isExtend',
      headerName: t('subscription.isExtendedSubscription'),
      description: t('subscription.isExtendedSubscription'),
      flex: 1,
      hide: !visibilityColumns.isExtend,
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
      field: 'voucherCode',
      headerName: t('subscription.voucherCode'),
      description: t('subscription.voucherCode'),
      flex: 1,
      hide: !visibilityColumns.voucherCode,
      filterable: false,
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
    setQuery({ size: params.pageSize, page: 1 })
    setFilters({ ...filters })
    setPageSize(params.pageSize)
    setCurrentPageIndex(0)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setFilters({
      ...params.items.reduce((filter, { columnField, value }: GridFilterItem) => {
        if (columnField) {
          if (columnField === 'status') {
            filter = { statusList: [value] }
          } else if (columnField === 'userEmail') {
            filter = { email: value }
          } else if (columnField === 'carPlateNumber') {
            filter = { plateNumber: value }
          } else {
            filter = { [columnField]: value }
          }
        }
        return filter
      }, {} as SubscriptionBookingListFilters),
    })

    // reset page
    setCurrentPageIndex(0)
  }

  const handleRowClick = (data: GridRowData) => {
    // setUpdateDialogOpen(true)
    // setSelectedSubscription(data.row)
    return history.push(`/subscription/${data.row.id}`)
  }

  const handleFetchPage = (pageNumber: number) => {
    setQuery({ page: pageNumber + 1 })
    setFilters({ ...filters })
    setCurrentPageIndex(pageNumber)
  }

  const handleOnClearFilterId = () => {
    setFilters(defaultFilters)
  }

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.dashboard'),
      link: '/',
    },
    {
      text: t('sidebar.subscriptions'),
      link: '/subscription',
    },
  ]

  return (
    <Page>
      <PageTitle title="Subscription" breadcrumbs={breadcrumbs} />
      <PageToolbar>
        {bookingDetailId && (
          <Link to="/subscription">
            <Button color="primary" variant="contained" onClick={() => handleOnClearFilterId()}>
              {t('subscription.clearFilterId')}
            </Button>
          </Link>
        )}
      </PageToolbar>
      {/* <FilterBar /> */}
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
    </Page>
  )
}
