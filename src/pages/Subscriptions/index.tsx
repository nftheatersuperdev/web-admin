import { useState } from 'react'
import { Card, Button } from '@material-ui/core'
import { GridColDef, GridPageChangeParams, GridRowData } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { columnFormatDate, columnFormatMoney, renderEmailLink } from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import DataGridLocale from 'components/DataGridLocale'
import { useSubscriptions } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import UpdateDialog from './UpdateDialog'

export default function Subscription(): JSX.Element {
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState()

  const { t } = useTranslation()
  const { data, fetchNextPage, fetchPreviousPage } = useSubscriptions(pageSize)

  const handleRowClick = (data: GridRowData) => {
    setUpdateDialogOpen(true)
    setSelectedSubscription(data.row)
  }

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const rows =
    data?.pages[currentPageIndex]?.edges?.map(({ node }) => ({
      id: node?.id,
      vin: node?.car?.vin,
      plateNumber: node?.car?.plateNumber,
      brand: node?.car?.carModel?.brand,
      model: node?.car?.carModel?.model,
      price: node?.packagePrice?.price,
      duration: node?.packagePrice?.duration,
      seats: node?.car?.carModel?.seats,
      topSpeed: node?.car?.carModel?.topSpeed,
      fastChargeTime: node?.car?.carModel?.fastChargeTime,
      startDate: node?.startDate,
      endDate: node?.endDate,
      startAddress: node?.startAddress?.full,
      startLat: node?.startAddress?.latitude,
      startLng: node?.startAddress?.longitude,
      endAddress: node?.endAddress?.full,
      endLat: node?.endAddress?.latitude,
      endLng: node?.endAddress?.longitude,
      createdAt: node?.createdAt,
      updatedAt: node?.updatedAt,
      email: node?.user?.email,
      phoneNumber: node?.user?.phoneNumber,
      firstName: node?.user?.firstName,
      lastName: node?.user?.lastName,
      // not shown in table
      color: node?.car?.color,
      modelId: node?.car?.carModel?.id,
    })) || []

  const columns: GridColDef[] = [
    {
      field: 'brand',
      headerName: t('subscription.brand'),
      description: t('subscription.brand'),
      flex: 1,
    },
    {
      field: 'model',
      headerName: t('subscription.model'),
      description: t('subscription.model'),
      flex: 1,
    },
    {
      field: 'modelId',
      headerName: t('subscription.modelId'),
      description: t('subscription.modelId'),
      flex: 1,
    },
    {
      field: 'seats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 1,
      hide: true,
    },
    {
      field: 'topSpeed',
      headerName: t('subscription.topSpeed'),
      description: t('subscription.topSpeed'),
      flex: 1,
      hide: true,
    },
    {
      field: 'plateNumber',
      headerName: t('subscription.plateNumber'),
      description: t('subscription.plateNumber'),
      flex: 1,
      hide: true,
    },
    {
      field: 'vin',
      headerName: t('subscription.vin'),
      description: t('subscription.vin'),
      flex: 1,
      hide: true,
    },
    {
      field: 'price',
      headerName: t('subscription.price'),
      description: t('subscription.price'),
      valueFormatter: columnFormatMoney,
      flex: 1,
    },
    {
      field: 'duration',
      headerName: t('subscription.duration'),
      description: t('subscription.duration'),
      flex: 1,
    },
    {
      field: 'fastChargeTime',
      headerName: t('subscription.fastChargeTime'),
      description: t('subscription.fastChargeTime'),
      flex: 1,
      hide: true,
    },
    {
      field: 'startDate',
      headerName: t('subscription.startDate'),
      description: t('subscription.startDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: t('subscription.endDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
    },
    {
      field: 'startAddress',
      headerName: t('subscription.startAddress'),
      description: t('subscription.startAddress'),
      flex: 1,
      hide: true,
    },
    {
      field: 'endAddress',
      headerName: t('subscription.endAddress'),
      description: t('subscription.endAddress'),
      flex: 1,
      hide: true,
    },
    {
      field: 'createdAt',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
    },
    {
      field: 'updatedAt',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
    },
    {
      field: 'email',
      headerName: t('subscription.email'),
      description: t('subscription.email'),
      renderCell: renderEmailLink,
      flex: 1,
    },
    {
      field: 'phoneNumber',
      headerName: t('subscription.phone'),
      description: t('subscription.phone'),
      flex: 1,
    },
    {
      field: 'firstName',
      headerName: t('subscription.firstName'),
      description: t('subscription.firstName'),
      flex: 1,
    },
    {
      field: 'lastName',
      headerName: t('subscription.lastName'),
      description: t('subscription.lastName'),
      flex: 1,
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
          onRowClick={handleRowClick}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
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
