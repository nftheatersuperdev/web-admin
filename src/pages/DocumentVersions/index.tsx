/* eslint-disable react/forbid-component-props */
import dayjs from 'dayjs'
import styled from 'styled-components'
import { Fragment, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, Link as RouterLink, useParams } from 'react-router-dom'
import { Button, Breadcrumbs, Card, IconButton, Link, Typography, Toolbar } from '@material-ui/core'
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridColDef,
  GridCellParams,
  GridPageChangeParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { Edit as EditIcon, Search as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Page } from 'layout/LayoutRoute'
import { getDetail, getVersionList } from 'services/web-bff/document'
import DataGridLocale from 'components/DataGridLocale'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

interface DocumentVersionsParams {
  documentCode: string
}

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const CardWrapper = styled(Card)`
  padding: 20px;
  margin: 20px 0;
`
const ToolbarWrapper = styled(Toolbar)`
  padding: 0;
`
const TableWrapper = styled.div`
  background-color: #fff;
`
const UiOverviewWrapper = styled.ul`
  list-style: none;
`
const UiLiOverviewWrapper = styled.li`
  width: 100%;
  display: inline-block;
`
const DivOverviewTitle = styled.div`
  width: 220px;
  float: left;
  font-weight: bold;
`
const DivOverviewValue = styled.div`
  float: left;
`

const formatDate = (date: string): string => dayjs(date).format(DEFAULT_DATETIME_FORMAT)
const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
  </GridToolbarContainer>
)

export default function DocumentVersions(): JSX.Element {
  const { documentCode } = useParams<DocumentVersionsParams>()
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const isThaiLanguage = i18n.language === 'th'

  const { data: documentDetail } = useQuery('document-detail', () =>
    getDetail({ code: documentCode })
  )
  const {
    data: documents,
    isFetching,
    refetch: refetchDocuments,
  } = useQuery('documents', () => getVersionList({ code: documentCode, page: page + 1, size }))

  const visibilityColumns = getVisibilityColumns()

  useEffect(() => {
    refetchDocuments()
  }, [refetchDocuments, page, size])

  const startNo = page * size
  const rowCount = documents?.pagination.totalRecords || 0
  const rows =
    documents?.versions?.map((document, key) => {
      const isDisableToEdit = document.status !== 'Scheduled'

      return {
        no: startNo + (key + 1),
        ...document,
        isDisableToEdit,
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'no',
      headerName: t('documents.versions.no'),
      description: t('documents.versions.no'),
      hide: !visibilityColumns.no,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'version',
      headerName: t('documents.versions.version'),
      description: t('documents.versions.version'),
      hide: !visibilityColumns.version,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'status',
      headerName: t('documents.versions.status'),
      description: t('documents.versions.status'),
      hide: !visibilityColumns.status,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'effectiveDate',
      headerName: t('documents.versions.effectiveDate'),
      description: t('documents.versions.effectiveDate'),
      hide: !visibilityColumns.effectiveDate,
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: ({ row }: GridValueFormatterParams): string => formatDate(row.effectiveDate),
    },
    {
      field: 'remark',
      headerName: t('documents.versions.revisionSummary'),
      description: t('documents.versions.revisionSummary'),
      hide: !visibilityColumns.remark,
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: ({ value }: GridValueFormatterParams): string => {
        return String(value !== null ? value : '-')
      },
    },
    {
      field: 'createdDate',
      headerName: t('documents.versions.createdDate'),
      description: t('documents.versions.createdDate'),
      hide: !visibilityColumns.createdDate,
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: ({ row }: GridValueFormatterParams): string => formatDate(row.createdDate),
    },
    {
      field: 'createdBy',
      headerName: t('documents.versions.createdBy'),
      description: t('documents.versions.createdBy'),
      hide: !visibilityColumns.createdBy,
      flex: 1,
      sortable: false,
      filterable: false,
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
            onClick={() => history.push(`/documents/${documentCode}/versions/${row.version}`)}
          >
            <SearchIcon />
          </IconButton>
          <IconButton
            disabled={row.isDisableToEdit}
            onClick={() => history.push(`/documents/${documentCode}/versions/${row.version}/edit`)}
          >
            <EditIcon />
          </IconButton>
        </Fragment>
      ),
    },
  ]

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPage(0)
    setSize(params.pageSize)
  }

  const handleFetchPage = (pageNumber: number) => {
    setPage(pageNumber)
  }

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
        {t('documents.overviewAndVersions')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Link underline="hover" color="inherit" component={RouterLink} to="/documents">
          {t('documents.header')}
        </Link>
        <Typography color="textPrimary">
          {isThaiLanguage ? documentDetail?.nameTh : documentDetail?.nameEn}
        </Typography>
      </BreadcrumbsWrapper>

      <Typography variant="h6" color="inherit" component="h2">
        {t('documents.overview.title')}
      </Typography>
      <CardWrapper>
        <UiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.id')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.id}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.nameEN')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.nameEn}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.nameTH')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.nameTh}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.activeVersion')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.version}</DivOverviewValue>
          </UiLiOverviewWrapper>
        </UiOverviewWrapper>
      </CardWrapper>

      <ToolbarWrapper>
        <Typography variant="h6" color="inherit" component="h2" style={{ flex: 1 }}>
          {t('documents.versions.title')}
        </Typography>
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => history.push(`/documents/${documentCode}/versions/add/edit`)}
          >
            {t('documents.versions.buttons.addNewVersion')}
          </Button>
        </div>
      </ToolbarWrapper>
      <TableWrapper>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={size}
          page={page}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          filterMode="client"
          onColumnVisibilityChange={onColumnVisibilityChange}
          loading={isFetching}
          customToolbar={customToolbar}
          onFetchNextPage={() => handleFetchPage(page + 1)}
          onFetchPreviousPage={() => handleFetchPage(page - 1)}
        />
      </TableWrapper>
    </Page>
  )
}
