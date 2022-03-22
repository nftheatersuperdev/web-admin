import toast from 'react-hot-toast'
import { useHistory } from 'react-router-dom'
import { useState, useEffect, Fragment } from 'react'
import { Card, Button, IconButton, Chip, Tooltip } from '@material-ui/core'
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
  GridSortModel,
  GridRowData,
  GridCellParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  getIdFilterOperators,
  getNumericFilterOperators,
  getStringFilterOperators,
  getDateFilterMoreOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  dateToFilterGreaterOrLess,
  stringToFilterContains,
  columnFormatDate,
} from 'utils'
import config from 'config'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { getList, deleteById } from 'services/web-bff/voucher'
import { VoucherListQuery } from 'services/web-bff/voucher.type'
import { SortDirection, SubOrder, Voucher as VoucherType } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import CreateUpdateDialog from './CreateUpdateDialog'
import PackagePriceDialog from './PackagePriceDialog'

export default function Voucher(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const history = useHistory()
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [voucherQuery, setVoucherQuery] = useState<VoucherListQuery>({})
  const [voucherSort, setVoucherSort] = useState<SubOrder>({})
  const [createUpdateDialogOpen, setCreateUpdateDialogOpen] = useState<boolean>(false)
  const [packagePriceDialogOpen, setPackagePriceDialogOpen] = useState<boolean>(false)
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>()

  const {
    data: voucherData,
    refetch,
    isFetching,
  } = useQuery('voucher-list', () =>
    getList({
      accessToken,
      sort: voucherSort,
      query: voucherQuery,
      page: currentPageIndex + 1,
      limit: pageSize,
    })
  )

  const idFilterOperators = getIdFilterOperators(t)
  const numericFilterOperators = getNumericFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterMoreOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setVoucherQuery({
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (
          (columnField === 'createdAt' ||
            columnField === 'updatedAt' ||
            columnField === 'startAt' ||
            columnField === 'endAt') &&
          value
        ) {
          const comparingValue = operatorValue as string
          const comparingOperations = ['gt', 'lt', 'gte', 'lte']
          const isUsingOperators = comparingOperations.includes(comparingValue)
          const isGreaterThanOrLessThanEqual = ['gt', 'lte'].includes(comparingValue)

          if (operatorValue === 'between') {
            filterValue = dateToFilterOnDay(value)
          } else if (operatorValue === 'notBetween') {
            filterValue = dateToFilterNotOnDay(value)
          } else if (isUsingOperators) {
            filterValue = dateToFilterGreaterOrLess(value, isGreaterThanOrLessThanEqual)
          }
        }

        if (operatorValue === 'iLike' && value) {
          filterValue = stringToFilterContains(value)
        }

        if (filterValue) {
          /* @ts-expect-error TODO */
          filter[columnField] = {
            [operatorValue as string]: filterValue,
          }
        }

        if (
          (columnField === 'amount' ||
            columnField === 'percentDiscount' ||
            columnField === 'limitPerUser') &&
          value
        ) {
          /* @ts-expect-error TODO */
          filter[columnField] = {
            [operatorValue as string]: +filterValue,
          }
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

  const handleSortChange = (params: GridSortModel) => {
    if (params?.length > 0 && !isFetching) {
      const { field: refField, sort } = params[0]

      const order: SubOrder = {
        [refField]: sort?.toLocaleLowerCase() === 'asc' ? SortDirection.Asc : SortDirection.Desc,
      }

      setVoucherSort(order)
      refetch()
    }
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
  }, [voucherQuery, refetch])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('voucher.id'),
      description: t('voucher.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      sortable: true,
      filterOperators: idFilterOperators,
    },
    {
      field: 'code',
      headerName: t('voucher.code'),
      description: t('voucher.code'),
      hide: !visibilityColumns.code,
      flex: 1,
      sortable: true,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'descriptionEn',
      headerName: t('voucher.description.en'),
      description: t('voucher.description.en'),
      hide: !visibilityColumns.descriptionEn,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
      valueFormatter: (params: GridValueFormatterParams) => params.value ?? '-',
    },
    {
      field: 'descriptionTh',
      headerName: t('voucher.description.th'),
      description: t('voucher.description.th'),
      hide: !visibilityColumns.descriptionTh,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
      valueFormatter: (params: GridValueFormatterParams) => params.value ?? '-',
    },
    {
      field: 'percentDiscount',
      headerName: t('voucher.percentDiscount'),
      description: t('voucher.percentDiscount'),
      hide: !visibilityColumns.percentDiscount,
      flex: 1,
      sortable: true,
      filterOperators: numericFilterOperators,
    },
    {
      field: 'amount',
      headerName: t('voucher.amount'),
      description: t('voucher.amount'),
      hide: !visibilityColumns.amount,
      flex: 1,
      sortable: true,
      filterOperators: numericFilterOperators,
    },
    {
      field: 'limitPerUser',
      headerName: t('voucher.limitPerUser'),
      description: t('voucher.limitPerUser'),
      hide: !visibilityColumns.limitPerUser,
      flex: 1,
      sortable: true,
      filterOperators: numericFilterOperators,
    },
    {
      field: 'startDate',
      headerName: t('voucher.startAt'),
      description: t('voucher.startAt'),
      hide: !visibilityColumns.startAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'endDate',
      headerName: t('voucher.endAt'),
      description: t('voucher.endAt'),
      hide: !visibilityColumns.endAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'isAllPackages',
      headerName: 'ALL Packages',
      description: 'ALL Packages',
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
      hide: !visibilityColumns.createdAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'updatedDate',
      headerName: t('voucher.updatedAt'),
      description: t('voucher.updatedAt'),
      hide: !visibilityColumns.updatedAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'status',
      headerName: t('voucher.status'),
      description: t('voucher.status'),
      hide: !visibilityColumns.status,
      flex: 0,
      sortable: false,
      filterable: false,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
      renderCell: (params: GridCellParams) => {
        const currentDateTime = new Date()
        const startAtDateTime = new Date(params.row.startAt)
        const endAtDateTime = new Date(params.row.endAt)

        const isActive = currentDateTime >= startAtDateTime && currentDateTime <= endAtDateTime
        const isInactive = currentDateTime > endAtDateTime
        const isPending = currentDateTime < startAtDateTime

        if (isActive) {
          return <Chip label={t('voucher.statuses.active')} color="primary" />
        } else if (isInactive) {
          return <Chip label={t('voucher.statuses.inactive')} color="secondary" />
        } else if (isPending) {
          return <Chip label={t('voucher.statuses.pending')} color="default" />
        }
        return '-'
      },
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
          <Fragment>
            <IconButton size="small" onClick={() => history.push(`/vouchers/${params.id}/edit`)}>
              <EditIcon />
            </IconButton>
            <Tooltip title={t('voucherEvents.tooltip.title')} arrow>
              <IconButton
                size="small"
                onClick={() =>
                  history.push(`/vouchers/${params.id}/events?code=${params.row.code}`)
                }
              >
                <NoteIcon />
              </IconButton>
            </Tooltip>
            <IconButton
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
        percentDiscount: voucher.percentDiscount,
        amount: voucher.amount,
        limitPerUser: voucher.limitPerUser,
        isAllPackages: voucher.isAllPackages,
        userGroups: voucher.userGroups,
        packagePrices: voucher.packagePrices,
        startDate: voucher.startDate,
        endDate: voucher.endDate,
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
          sortingMode="server"
          onSortModelChange={handleSortChange}
          loading={isFetching}
        />

        <CreateUpdateDialog
          open={createUpdateDialogOpen}
          voucher={selectedVoucher}
          onClose={() => {
            setCreateUpdateDialogOpen(false)
            setSelectedVoucher(null)
            refetch()
          }}
        />

        <PackagePriceDialog
          open={packagePriceDialogOpen}
          voucher={selectedVoucher}
          onClose={() => {
            setPackagePriceDialogOpen(false)
            setSelectedVoucher(null)
            refetch()
          }}
        />
      </Card>
    </Page>
  )
}
