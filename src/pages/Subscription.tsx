import { useState } from 'react'
import { Card, Button } from '@material-ui/core'
import { GridColDef, GridPageChangeParams } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { formatDates, formatMoney, renderEmailLink } from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import DataGridLocale from 'components/DataGridLocale'
import { useSubscriptions } from 'services/evme'
import { Page } from 'layout/LayoutRoute'

export default function Subscription(): JSX.Element {
  const { t } = useTranslation()

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const { data, fetchNextPage, fetchPreviousPage } = useSubscriptions(pageSize)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handlePageChange = (params: GridPageChangeParams) => {
    if (params.page > currentPageIndex) {
      fetchNextPage()
    } else {
      fetchPreviousPage()
    }
    setCurrentPageIndex(params.page)
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
      createdAt: node?.createdAt,
      updatedAt: node?.updatedAt,
      email: node?.user?.email,
      phoneNumber: node?.user?.phoneNumber,
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
      field: 'seats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 1,
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
      valueFormatter: formatMoney,
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
      valueFormatter: formatDates,
      flex: 1,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: 'End Date',
      valueFormatter: formatDates,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      valueFormatter: formatDates,
      flex: 1,
      hide: true,
    },
    {
      field: 'updatedAt',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      valueFormatter: formatDates,
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
          onPageChange={handlePageChange}
          rows={rows}
          columns={columns}
          checkboxSelection
        />
      </Card>
    </Page>
  )
}
