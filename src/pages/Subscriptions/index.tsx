/* eslint-disable @typescript-eslint/no-explicit-any */
import config from 'config'
import { Button, Card } from '@material-ui/core'
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
} from '@material-ui/data-grid'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import {
  columnFormatDate,
  columnFormatText,
  convertMoneyFormat,
  DEFAULT_DATETIME_FORMAT,
  firstCapitalize,
  geEqualtDateOperators,
  getEqualFilterOperators,
  getSelectEqualFilterOperators,
} from 'utils'
import { Link, useLocation, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { ROUTE_PATHS } from 'routes'
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
  BookingCarActivity,
} from 'services/web-bff/subscription.type'

const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <GridToolbarFilterButton />
  </GridToolbarContainer>
)

const ExportButton = styled.div`
  display: block;
  width: 100%;
  margin: 10px 0;

  a {
    text-decoration: none;
    color: #fff;
  }
`

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
  } = useQuery('subscriptions', () => getList({ query, filters }), {
    refetchOnWindowFocus: false,
  })

  const rowCount = response?.data?.pagination?.totalRecords || 0
  const rows =
    response?.data.bookingDetails && response?.data.bookingDetails.length > 0
      ? response?.data.bookingDetails.map((subscription) => {
          const subscriptionPrice =
            subscription.rentDetail.chargePrice !== null
              ? convertMoneyFormat(subscription.rentDetail.chargePrice)
              : '-'
          const subscriptionPriceFullFormat = `${subscriptionPrice} ${t('pricing.currency.thb')}`

          const replacement = subscription.carActivities.length >= 1 ? 'Y' : 'N'

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
              replacement,
              parentId: subscription.bookingId,
              isExtend: Boolean(subscription.isExtend),
              customerId: subscription.customerId || '-',
              cleaningDate: subscription.endDate,
              payments: subscription?.payments || [],
              isSelfPickup: subscription.isSelfPickUp,
            } ?? {}
          )
        })
      : []

  const csvHeaders = [
    { label: t('subscription.bookingDetailId'), key: 'bookingDetailId' },
    { label: t('subscription.customerId'), key: 'customerId' },
    { label: t('subscription.firstName'), key: 'firstName' },
    { label: t('subscription.lastName'), key: 'lastName' },
    { label: t('subscription.email'), key: 'email' },
    { label: t('subscription.phone'), key: 'phoneNumber' },
    { label: t('subscription.carId'), key: 'carId' },
    { label: t('subscription.model'), key: 'carModel' },
    { label: t('subscription.brand'), key: 'carBrand' },
    { label: t('subscription.seats'), key: 'carSeats' },
    { label: t('subscription.topSpeed'), key: 'carTopSpeed' },
    { label: t('subscription.plateNumber'), key: 'plateNumber' },
    { label: t('subscription.vin'), key: 'vin' },
    { label: t('subscription.fastChargeTime'), key: 'carFastChargeTime' },
    { label: t('subscription.price'), key: 'price' },
    { label: t('subscription.duration'), key: 'duration' },
    { label: t('subscription.startDate'), key: 'startDate' },
    { label: t('subscription.endDate'), key: 'endDate' },
    { label: t('booking.carReplacement.deliveryAddress'), key: 'deliveryAddress' },
    { label: t('subscription.deliveryDate'), key: 'deliveryDate' },
    { label: t('booking.carReplacement.returnAddress'), key: 'returnAddress' },
    { label: t('subscription.returnDate'), key: 'returnDate' },
    { label: t('subscription.status.title'), key: 'status' },
    { label: t('subscription.parentId'), key: 'parentId' },
    { label: t('subscription.isExtendedSubscription'), key: 'isExtend' },
    { label: t('subscription.voucherId'), key: 'voucherId' },
    { label: t('subscription.voucherCode'), key: 'voucherCode' },
    { label: t('subscription.createdDate'), key: 'createdDate' },
    { label: t('subscription.updatedDate'), key: 'updatedDate' },
    { label: t('subscription.payment.status'), key: 'paymentStatus' },
    { label: t('subscription.payment.failureMessage'), key: 'paymentFailureMessage' },
    { label: t('subscription.payment.updatedDate'), key: 'paymentUpdatedDate' },
    { label: t('subscription.replacement'), key: 'replacement' },
    { label: t('subscription.isSelfPickup'), key: 'isSelfPickUp' },
  ]
  const csvData: any = []
  response?.data?.bookingDetails?.forEach((booking) => {
    const {
      id,
      bookingId,
      customerId,
      customer,
      car,
      rentDetail,
      displayStatus,
      startDate,
      endDate,
      carActivities,
      payments,
      isExtend,
      isSelfPickUp,
    } = booking
    const defaultValue = {
      true: 'Y',
      false: 'N',
      noData: '-',
    }
    const dateFormat = (date?: string) => {
      if (!date) {
        return defaultValue.noData
      }
      return dayjs(date).format(DEFAULT_DATETIME_FORMAT)
    }
    const makeData = (carActivity?: BookingCarActivity) => ({
      bookingDetailId: id,
      customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      carId: carActivity ? carActivity?.carDetail?.id : car.id,
      carBrand: carActivity
        ? carActivity?.carDetail?.carSku?.carModel?.brand.name
        : car.carSku?.carModel?.brand.name || defaultValue.noData,
      carModel: carActivity
        ? carActivity?.carDetail?.carSku?.carModel?.name
        : car.carSku?.carModel?.name || defaultValue.noData,
      carSeats: carActivity
        ? carActivity?.carDetail?.carSku?.carModel?.seats
        : car.carSku?.carModel?.seats || defaultValue.noData,
      carTopSpeed: carActivity
        ? carActivity?.carDetail?.carSku?.carModel?.topSpeed
        : car.carSku?.carModel?.topSpeed || defaultValue.noData,
      carFastChargeTime: carActivity
        ? carActivity?.carDetail?.carSku?.carModel?.fastChargeTime
        : car.carSku?.carModel?.fastChargeTime || defaultValue.noData,
      plateNumber: carActivity ? carActivity?.carDetail?.plateNumber : car.plateNumber,
      vin: carActivity ? carActivity?.carDetail?.vin : car.vin,
      price: rentDetail.chargePrice,
      duration: convertToDuration(rentDetail.durationDay, t),
      startDate,
      endDate,
      deliveryAddress: carActivity?.deliveryTask?.fullAddress || defaultValue.noData,
      deliveryDate: dateFormat(carActivity?.deliveryTask?.date),
      returnAddress: carActivity?.returnTask?.fullAddress || defaultValue.noData,
      returnDate: dateFormat(carActivity?.returnTask?.date),
      status: displayStatus || defaultValue.noData,
      replacement: carActivity ? defaultValue.true : defaultValue.false,
      parentId: bookingId,
      isExtend: Boolean(isExtend),
      paymentStatus: firstCapitalize(payments[0]?.status) || defaultValue.noData,
      paymentFailureMessage: payments[0]?.statusMessage || defaultValue.noData,
      paymentUpdatedDate: dateFormat(payments[0]?.updatedDate) || defaultValue.noData,
      voucherId: rentDetail.voucherId || defaultValue.noData,
      voucherCode: rentDetail.voucherCode || defaultValue.noData,
      createdDate: dateFormat(rentDetail.createdDate),
      updatedDate: dateFormat(rentDetail.updatedDate),
      isSelfPickUp: isSelfPickUp ? defaultValue.true : defaultValue.false,
    })
    if (carActivities.length >= 1) {
      carActivities.forEach((carActivity) => csvData.push(makeData(carActivity)))
    }
    csvData.push(makeData())
  })

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
      field: 'replacement',
      headerName: 'Replacement',
      description: 'Replacement',
      flex: 1,
      hide: !visibilityColumns.replacement,
      sortable: false,
      filterable: false,
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
      link: ROUTE_PATHS.ROOT,
    },
    {
      text: t('sidebar.subscriptions'),
      link: ROUTE_PATHS.SUBSCRIPTION,
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
      <ExportButton>
        <Button variant="contained" color="primary" disabled={isFetching}>
          <CSVLink data={csvData} headers={csvHeaders} filename="subscription.csv">
            {t('subscription.downloadCSV')}
          </CSVLink>
        </Button>
      </ExportButton>
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
          checkboxSelection={false}
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
