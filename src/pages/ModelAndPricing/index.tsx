import { useHistory } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { Card, IconButton } from '@material-ui/core'
import { GridCellParams, GridColDef, GridPageChangeParams } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { columnFormatDate, getIdFilterOperators } from 'utils'
import config from 'config'
import { Edit as EditIcon } from '@material-ui/icons'
import { useCarModels } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'

export default function ModelAndPricing(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { data, refetch, fetchNextPage, fetchPreviousPage } = useCarModels(pageSize)

  const idFilterOperators = getIdFilterOperators(t)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  const rows = useMemo(
    () =>
      data?.pages[currentPageIndex]?.edges?.map(({ node }) => ({
        id: node?.id,
        brand: node?.brand,
        model: node?.model,
        createdAt: node?.createdAt,
        updatedAt: node?.updatedAt,
      })) || [],
    [data, currentPageIndex]
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
      field: 'model',
      headerName: t('pricing.model'),
      description: t('pricing.model'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdAt',
      headerName: t('pricing.createdDate'),
      description: t('pricing.createdDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'updatedAt',
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
      renderCell: (params: GridCellParams) => {
        return (
          <IconButton
            size="small"
            onClick={() => history.push(`/model-and-pricing/${params.id}/edit`)}
          >
            <EditIcon />
          </IconButton>
        )
      },
    },
  ]

  return (
    <Page>
      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={data?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          onFetchNextPage={fetchNextPage}
          onFetchPreviousPage={fetchPreviousPage}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          filterMode="server"
        />
      </Card>
    </Page>
  )
}
