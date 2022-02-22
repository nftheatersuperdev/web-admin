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
      flex: 0,
    },
    {
      field: 'userFirstName',
      headerName: t('subscription.firstName'),
      description: t('subscription.firstName'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'userLastName',
      headerName: t('subscription.lastName'),
      description: t('subscription.lastName'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'userEmail',
      headerName: t('subscription.email'),
      description: t('subscription.email'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'userPhoneNumber',
      headerName: t('subscription.phone'),
      description: t('subscription.phone'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'carId',
      headerName: t('subscription.modelId'),
      description: t('subscription.modelId'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'carName',
      headerName: t('subscription.model'),
      description: t('subscription.model'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carBrand',
      headerName: t('subscription.brand'),
      description: t('subscription.brand'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carSeats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carTopSpeed',
      headerName: t('subscription.topSpeed'),
      description: t('subscription.topSpeed'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'carPlateNumber',
      headerName: t('subscription.plateNumber'),
      description: t('subscription.plateNumber'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'carVin',
      headerName: t('subscription.vin'),
      description: t('subscription.vin'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'carFastChargeTime',
      headerName: t('subscription.fastChargeTime'),
      description: t('subscription.fastChargeTime'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'price',
      headerName: t('subscription.price'),
      description: t('subscription.price'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'duration',
      headerName: t('subscription.duration'),
      description: t('subscription.duration'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'startDate',
      headerName: t('subscription.startDate'),
      description: t('subscription.startDate'),
      flex: 0,
      sortable: true,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: t('subscription.endDate'),
      flex: 0,
      sortable: true,
    },
    {
      field: 'deliveryAddress',
      headerName: t('subscription.startAddress'),
      description: t('subscription.startAddress'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'returnAddress',
      headerName: t('subscription.endAddress'),
      description: t('subscription.endAddress'),
      flex: 0,
      filterable: false,
      sortable: false,
    },
    {
      field: 'status',
      headerName: t('subscription.status.title'),
      description: t('subscription.status.title'),
      flex: 0,
      sortable: false,
    },
    {
      field: 'voucherCode',
      headerName: t('subscription.voucherCode'),
      description: t('subscription.voucherCode'),
      flex: 0,
      filterable: true,
      sortable: false,
    },
    {
      field: 'paymentVersion',
      headerName: t('subscription.paymentVersion'),
      description: t('subscription.paymentVersion'),
      flex: 0,
      filterable: true,
      sortable: false,
    },
    {
      field: 'createdDate',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      flex: 0,
      filterable: false,
      sortable: true,
    },
    {
      field: 'updatedDate',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      flex: 0,
      filterable: false,
      sortable: true,
    },
  ]

  return (
    <Page>
      <Card>
        <DataGrid
          autoHeight
          components={{
            Toolbar: customToolbar,
          }}
          columns={columns}
          rows={subscriptions}
        />
      </Card>
    </Page>
  )
}
