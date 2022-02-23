import { Card } from '@material-ui/core'
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@material-ui/data-grid'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'auth/AuthContext'
import { getList } from 'services/web-bff/subscription'
import { Page } from 'layout/LayoutRoute'
import {
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
} from 'pages/Subscriptions/utils'
import type { SubscriptionListQuery } from 'services/web-bff/subscription.type'

const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
)

export default function Subscription(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const { t } = useTranslation()
  const visibilityColumns = getVisibilityColumns()
  const [query] = useState<SubscriptionListQuery>()
  const { data: response } = useQuery('subscriptions', () => getList(accessToken, query))

  const subscriptions =
    response?.data.subscriptions.map((subscription) => ({
      id: subscription.id,
      userFirstName: subscription.user.firstName,
      userLastName: subscription.user.lastName,
      userEmail: subscription.user.email,
      userPhoneNumber: subscription.user.phoneNumber,
      carId: subscription.car.id,
      carName: subscription.car.name,
      carBrand: subscription.car.brand,
      carPlateNumber: subscription.car.plateNumber,
      carVin: subscription.car.vin,
      carSeats: subscription.car.seats,
      carTopSpeed: subscription.car.topSpeed,
      carFastChargeTime: subscription.car.fastChargeTime,
      price: subscription.price,
      duration: subscription.duration,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      deliveryAddress: subscription.deliveryAddress,
      returnAddress: subscription.returnAddress,
      status: subscription.status,
      voucherCode: subscription.voucherCode,
      paymentVersion: subscription.paymentVersion,
      createdDate: subscription.createdDate,
      updatedDate: subscription.updatedDate,
    })) ?? []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('subscription.id'),
      description: t('subscription.id'),
      hide: !visibilityColumns.id,
      flex: 1,
    },
    {
      field: 'userFirstName',
      headerName: t('subscription.firstName'),
      description: t('subscription.firstName'),
      flex: 1,
      hide: !visibilityColumns.userFirstName,
      sortable: false,
    },
    {
      field: 'userLastName',
      headerName: t('subscription.lastName'),
      description: t('subscription.lastName'),
      flex: 1,
      hide: !visibilityColumns.userLastName,
      sortable: false,
    },
    {
      field: 'userEmail',
      headerName: t('subscription.email'),
      description: t('subscription.email'),
      flex: 1,
      hide: !visibilityColumns.userEmail,
      sortable: false,
    },
    {
      field: 'userPhoneNumber',
      headerName: t('subscription.phone'),
      description: t('subscription.phone'),
      flex: 1,
      hide: !visibilityColumns.userPhoneNumber,
      sortable: false,
    },
    {
      field: 'carId',
      headerName: t('subscription.modelId'),
      description: t('subscription.modelId'),
      flex: 1,
      hide: !visibilityColumns.carId,
      sortable: false,
    },
    {
      field: 'carName',
      headerName: t('subscription.model'),
      description: t('subscription.model'),
      flex: 1,
      hide: !visibilityColumns.carName,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carBrand',
      headerName: t('subscription.brand'),
      description: t('subscription.brand'),
      flex: 1,
      hide: !visibilityColumns.carBrand,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carSeats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 1,
      hide: !visibilityColumns.carSeats,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carTopSpeed',
      headerName: t('subscription.topSpeed'),
      description: t('subscription.topSpeed'),
      flex: 1,
      hide: !visibilityColumns.carTopSpeed,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carPlateNumber',
      headerName: t('subscription.plateNumber'),
      description: t('subscription.plateNumber'),
      flex: 1,
      hide: !visibilityColumns.carPlateNumber,
      sortable: false,
    },
    {
      field: 'carVin',
      headerName: t('subscription.vin'),
      description: t('subscription.vin'),
      flex: 1,
      hide: !visibilityColumns.carVin,
      sortable: false,
    },
    {
      field: 'carFastChargeTime',
      headerName: t('subscription.fastChargeTime'),
      description: t('subscription.fastChargeTime'),
      flex: 1,
      hide: !visibilityColumns.carFastChargeTime,
      filterable: false,
      sortable: false,
    },
    {
      field: 'price',
      headerName: t('subscription.price'),
      description: t('subscription.price'),
      flex: 1,
      hide: !visibilityColumns.price,
      sortable: false,
    },
    {
      field: 'duration',
      headerName: t('subscription.duration'),
      description: t('subscription.duration'),
      flex: 1,
      hide: !visibilityColumns.duration,
      sortable: false,
    },
    {
      field: 'startDate',
      headerName: t('subscription.startDate'),
      description: t('subscription.startDate'),
      flex: 1,
      hide: !visibilityColumns.startDate,
      sortable: true,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: t('subscription.endDate'),
      flex: 1,
      hide: !visibilityColumns.endDate,
      sortable: true,
    },
    {
      field: 'deliveryAddress',
      headerName: t('subscription.startAddress'),
      description: t('subscription.startAddress'),
      flex: 1,
      hide: !visibilityColumns.deliveryAddress,
      filterable: false,
      sortable: false,
    },
    {
      field: 'returnAddress',
      headerName: t('subscription.endAddress'),
      description: t('subscription.endAddress'),
      flex: 1,
      hide: !visibilityColumns.returnAddress,
      filterable: false,
      sortable: false,
    },
    {
      field: 'status',
      headerName: t('subscription.status.title'),
      description: t('subscription.status.title'),
      flex: 1,
      hide: !visibilityColumns.status,
      sortable: false,
    },
    {
      field: 'voucherCode',
      headerName: t('subscription.voucherCode'),
      description: t('subscription.voucherCode'),
      flex: 1,
      hide: !visibilityColumns.voucherCode,
      filterable: true,
      sortable: false,
    },
    {
      field: 'paymentVersion',
      headerName: t('subscription.paymentVersion'),
      description: t('subscription.paymentVersion'),
      flex: 1,
      hide: !visibilityColumns.paymentVersion,
      filterable: true,
      sortable: false,
    },
    {
      field: 'createdDate',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      flex: 1,
      hide: !visibilityColumns.createdDate,
      filterable: false,
      sortable: true,
    },
    {
      field: 'updatedDate',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      flex: 1,
      hide: !visibilityColumns.updatedDate,
      filterable: false,
      sortable: true,
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

  return (
    <Page>
      <Card>
        <DataGrid
          autoHeight
          components={{
            Toolbar: customToolbar,
          }}
          columns={columns}
          onColumnVisibilityChange={onColumnVisibilityChange}
          rows={subscriptions}
        />
      </Card>
    </Page>
  )
}
