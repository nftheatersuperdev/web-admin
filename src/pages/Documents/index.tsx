import dayjs from 'dayjs'
import styled from 'styled-components'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import { Breadcrumbs, IconButton, Link, Typography } from '@material-ui/core'
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridColDef,
  GridCellParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { Edit as EditIcon, Visibility as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Page } from 'layout/LayoutRoute'
import { getList } from 'services/web-bff/document'
import DataGridLocale from 'components/DataGridLocale'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const TableWrapper = styled.div`
  background-color: #fff;
`

const formatDate = (date: string): string => dayjs(date).format(DEFAULT_DATETIME_FORMAT)
const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
)

export default function Documents(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [page] = useState<number>(1)
  const [size] = useState<number>(10)

  const { data: response, isFetching } = useQuery('documents', () => getList({ page, size }))

  const visibilityColumns = getVisibilityColumns()
  const rowCount = response?.pagination.totalRecords || 0
  const rows = response?.documents?.map((document) => document) || []

  const columns: GridColDef[] = [
    {
      field: 'nameTh',
      headerName: t('documents.overview.nameTH'),
      description: t('documents.overview.nameTH'),
      hide: !visibilityColumns.nameTh,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'nameEn',
      headerName: t('documents.overview.nameEN'),
      description: t('documents.overview.nameEN'),
      hide: !visibilityColumns.nameEn,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'codeName',
      headerName: t('documents.overview.codeName'),
      description: t('documents.overview.codeName'),
      hide: !visibilityColumns.codeName,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'version',
      headerName: t('documents.overview.activeVersion'),
      description: t('documents.overview.activeVersion'),
      hide: !visibilityColumns.version,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'lastUpdated',
      headerName: t('documents.overview.lastUpdated'),
      description: t('documents.overview.lastUpdated'),
      hide: !visibilityColumns.lastUpdated,
      flex: 1,
      sortable: true,
      filterable: false,
      valueFormatter: ({ row }: GridValueFormatterParams): string => formatDate(row.effectiveDate),
    },
    {
      field: 'action',
      headerName: t('documents.overview.action'),
      description: t('documents.overview.action'),
      hide: !visibilityColumns.action,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridCellParams) => (
        <Fragment>
          <IconButton
            onClick={() => history.push(`/documents/${row.codeName}/versions/${row.version}`)}
          >
            <SearchIcon />
          </IconButton>
          <IconButton onClick={() => history.push(`/documents/${row.codeName}/versions`)}>
            <EditIcon />
          </IconButton>
        </Fragment>
      ),
    },
  ]

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
      <Typography variant="h5" color="inherit" component="h1">
        {t('documents.header')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Typography color="textPrimary">{t('documents.header')}</Typography>
      </BreadcrumbsWrapper>
      <TableWrapper>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={size}
          page={page}
          rowCount={rowCount}
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          filterMode="client"
          onColumnVisibilityChange={onColumnVisibilityChange}
          loading={isFetching}
          customToolbar={customToolbar}
        />
      </TableWrapper>
    </Page>
  )
}
