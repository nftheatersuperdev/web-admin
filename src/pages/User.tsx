import { useState } from 'react'
import { Card } from '@material-ui/core'
import { GridColDef, GridPageChangeParams } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { formatDates } from 'utils'
import config from 'config'
import { useUsers } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'

export default function User(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { data, fetchNextPage, fetchPreviousPage } = useUsers(pageSize)

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('user.id'), description: t('user.id'), flex: 1, hide: true },
    { field: 'email', headerName: t('user.email'), description: t('user.email'), flex: 1 },
    { field: 'phoneNumber', headerName: t('user.phone'), description: t('user.phone'), flex: 1 },
    { field: 'role', headerName: t('user.role'), description: t('user.role'), flex: 1 },
    { field: 'disabled', headerName: t('user.disabled'), description: t('user.disabled'), flex: 1 },
    {
      field: 'createdAt',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      valueFormatter: formatDates,
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      valueFormatter: formatDates,
      flex: 1,
    },
  ]

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handlePageChange = (params: GridPageChangeParams) => {
    // If we navigate FORWARD in our pages, i.e. the new page number is higher than current page
    if (params.page > currentPageIndex) {
      fetchNextPage()
    }
    // If we navigate BACKWARD in our pages, i.e. the new page number is lower than current page
    else {
      fetchPreviousPage()
    }
    setCurrentPageIndex(params.page)
  }

  const rows = data?.pages[currentPageIndex]?.edges?.map(({ node }) => node) || []

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
          onPageChange={handlePageChange}
          rows={rows}
          columns={columns}
          checkboxSelection
        />
      </Card>
    </Page>
  )
}
