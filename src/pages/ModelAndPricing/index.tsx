import { useHistory } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Card, IconButton } from '@material-ui/core'
import { GridCellParams, GridColDef, GridPageChangeParams } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { columnFormatDate, getIdFilterOperators } from 'utils'
import config from 'config'
import { Edit as EditIcon } from '@material-ui/icons'
import { useQuery } from 'react-query'
import { getListBFF } from 'services/web-bff/car'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'

export default function ModelAndPricing(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(config.tableRowsDefaultPageSize)

  const {
    data: cars,
    refetch,
    isFetching,
  } = useQuery('model-and-pricing-page', () => getListBFF({ page, size: pageSize }))

  const idFilterOperators = getIdFilterOperators(t)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPage(0)
    setPageSize(params.pageSize)
  }

  useEffect(() => {
    refetch()
  }, [page, pageSize, refetch])

  const rowCount = cars?.data.pagination.totalRecords
  const rows = useMemo(
    () =>
      cars?.data.cars?.map((car) => ({
        id: car?.id || '-',
        modelId: car?.carSku?.carModel?.id || '-',
        brand: car?.carSku?.carModel?.brand?.name || '-',
        name: car?.carSku?.carModel?.name || '-',
        createdDate: car?.createdDate || '-',
        updatedDate: car?.updatedDate || '-',
      })) || [],
    [cars]
  )

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('pricing.id'),
      description: t('pricing.id'),
      flex: 1,
      filterOperators: idFilterOperators,
    },
    {
      field: 'brand',
      headerName: t('pricing.brand'),
      description: t('pricing.brand'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'name',
      headerName: t('pricing.model'),
      description: t('pricing.model'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdDate',
      headerName: t('pricing.createdDate'),
      description: t('pricing.createdDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'updatedDate',
      headerName: t('pricing.updatedDate'),
      description: t('pricing.updatedDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'actions',
      headerName: t('car.actions'),
      description: t('car.actions'),
      flex: 1,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: GridCellParams) => (
        <IconButton
          size="small"
          onClick={() => history.push(`/model-and-pricing/${row.modelId}/edit`)}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ]

  return (
    <Page>
      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={page}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
          rows={rows}
          columns={columns}
          filterMode="server"
          loading={isFetching}
        />
      </Card>
    </Page>
  )
}
