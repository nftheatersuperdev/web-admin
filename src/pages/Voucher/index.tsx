import toast from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import { useState, useEffect, Fragment } from 'react'
import { Card, Button, IconButton, Tooltip } from '@material-ui/core'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Note as NoteIcon,
  Check as CheckIcon,
  NotInterested as NotInterestedIcon,
} from '@material-ui/icons'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridRowData,
  GridCellParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  getEqualFilterOperators,
  getContainFilterOperators,
  geEqualtDateOperators,
  FieldComparisons,
  FieldKeyOparators,
} from 'utils'
import config from 'config'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { getList, deleteById } from 'services/web-bff/voucher'
import { VoucherListQuery } from 'services/web-bff/voucher.type'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

export default function Voucher(): JSX.Element {
  const defaultFilter: VoucherListQuery = {} as VoucherListQuery
  const accessToken = useAuth().getToken() ?? ''
  const history = useHistory()
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [voucherQuery, setVoucherQuery] = useState<VoucherListQuery>({ ...defaultFilter })

  const {
    data: voucherData,
    refetch,
    isFetching,
  } = useQuery('voucher-list', () =>
    getList({
      data: voucherQuery,
      page: currentPageIndex + 1,
      size: pageSize,
    })
  )

  const equalOperators = getEqualFilterOperators(t)
  const containOperators = getContainFilterOperators(t)
  const dateEqualOperators = geEqualtDateOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setCurrentPageIndex(0)
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    let keyValue = ''
    setVoucherQuery({
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        if (value) {
          switch (operatorValue) {
            case FieldComparisons.equals:
              keyValue = `${columnField}${FieldKeyOparators.equals}`
              break
            case FieldComparisons.contains:
              keyValue = `${columnField}${FieldKeyOparators.contains}`
              break
          }
          filter = { [keyValue]: value }
        }
        return filter
      }, {} as VoucherListQuery),
    })
    // reset page
    setCurrentPageIndex(0)
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

  const handleDeleteRow = (data: GridRowData) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(t('voucher.dialog.delete.confirmationMessage'))
    if (confirmed) {
      const { id } = data
      toast.promise(deleteById({ accessToken, id }), {
        loading: t('toast.loading'),
        success: () => {
          return t('voucher.dialog.delete.success')
        },
        error: () => {
          return t('voucher.dialog.delete.error')
        },
      })
    }
  }

  useEffect(() => {
    refetch()
  }, [voucherQuery, refetch, currentPageIndex])

  useEffect(() => {
    refetch()
  }, [pageSize, refetch])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('voucher.id'),
      description: t('voucher.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      sortable: false,
      filterOperators: equalOperators,
    },
    {
      field: 'code',
      headerName: t('voucher.code'),
      description: t('voucher.code'),
      hide: !visibilityColumns.code,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
    },
    {
      field: 'descriptionEn',
      headerName: t('voucher.description.en'),
      description: t('voucher.description.en'),
      hide: !visibilityColumns.descriptionEn,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
      valueFormatter: (params: GridValueFormatterParams) => params.value ?? '-',
    },
    {
      field: 'descriptionTh',
      headerName: t('voucher.description.th'),
      description: t('voucher.description.th'),
      hide: !visibilityColumns.descriptionTh,
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: (params: GridValueFormatterParams) => params.value ?? '-',
    },
    {
      field: 'discountPercent',
      headerName: t('voucher.discountPercent'),
      description: t('voucher.discountPercent'),
      hide: !visibilityColumns.discountPercent,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'quantity',
      headerName: t('voucher.quantity'),
      description: t('voucher.quantity'),
      hide: !visibilityColumns.quantity,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'limitPerUser',
      headerName: t('voucher.limitPerUser'),
      description: t('voucher.limitPerUser'),
      hide: !visibilityColumns.limitPerUser,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'startAt',
      headerName: t('voucher.startAt'),
      description: t('voucher.startAt'),
      hide: !visibilityColumns.startAt,
      flex: 1,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'endAt',
      headerName: t('voucher.endAt'),
      description: t('voucher.endAt'),
      hide: !visibilityColumns.endAt,
      flex: 1,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'isAllPackages',
      headerName: t('voucher.isAllPackages'),
      description: t('voucher.isAllPackages'),
      hide: !visibilityColumns.isAllPackages,
      flex: 1,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: GridCellParams) =>
        row.isAllPackages ? <CheckIcon fontSize="small" /> : <NotInterestedIcon fontSize="small" />,
    },
    {
      field: 'createdDate',
      headerName: t('voucher.createdAt'),
      description: t('voucher.createdAt'),
      hide: !visibilityColumns.createdDate,
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'updatedDate',
      headerName: t('voucher.updatedAt'),
      description: t('voucher.updatedAt'),
      hide: !visibilityColumns.updatedDate,
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatDate,
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
        const code = params.row.code
        return (
          <Fragment>
            <IconButton size="small" onClick={() => history.push(`/vouchers/${code}/edit`)}>
              <EditIcon />
            </IconButton>
            <Tooltip title={t('voucherEvents.tooltip.title')} arrow>
              <IconButton
                disabled
                size="small"
                onClick={() => history.push(`/vouchers/${params.id}/events?code=${code}`)}
              >
                <NoteIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              disabled
              size="small"
              aria-label="delete"
              onClick={() => handleDeleteRow(params.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Fragment>
        )
      },
    },
  ]

  const rowCount = voucherData?.data.pagination.totalRecords
  const rows =
    voucherData?.data.vouchers.map((voucher) => {
      return {
        id: voucher.id,
        code: voucher.code,
        descriptionEn: voucher.descriptionEn,
        descriptionTh: voucher.descriptionTh,
        discountPercent: voucher.discountPercent,
        quantity: voucher.quantity,
        limitPerUser: voucher.limitPerUser,
        isAllPackages: voucher.isAllPackages,
        userGroups: voucher.userGroups,
        packagePrices: voucher.packagePrices,
        startAt: voucher.startAt,
        endAt: voucher.endAt,
        createdDate: voucher.createdDate,
        updatedDate: voucher.updatedDate,
      }
    }) || []

  return (
    <Page>
      <PageToolbar>
        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push('/vouchers/create')}
        >
          {t('voucher.button.createNew')}
        </Button>
      </PageToolbar>

      <Card>
        <DataGridLocale
          className="sticky-header"
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
          checkboxSelection
          disableSelectionOnClick
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
          loading={isFetching}
        />
      </Card>
    </Page>
  )
}
