import { useState, useEffect } from 'react'
import { Card, Button } from '@material-ui/core'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridSortModel,
  GridRowData,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  getIdFilterOperators,
  getNumericFilterOperators,
  getStringFilterOperators,
  getDateFilterOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,
  columnFormatDate,
} from 'utils'
import config from 'config'
import { useVouchersFilterAndSort } from 'services/evme'
import { VoucherFilter, SortDirection, SubOrder, Voucher as VoucherType } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import CreateUpdateDialog from './CreateUpdateDialog'

export default function Voucher(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [voucherFilter, setVoucherFilter] = useState<VoucherFilter>({})
  const [voucherSort, setVoucherSort] = useState<SubOrder>({})
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [dialogMethod, setDialogMethod] = useState<string>('create')
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>()

  const {
    data: voucherData,
    refetch,
    isFetching,
  } = useVouchersFilterAndSort(voucherFilter, voucherSort, currentPageIndex, pageSize)

  const idFilterOperators = getIdFilterOperators(t)
  const numericFilterOperators = getNumericFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setVoucherFilter({
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (
          (columnField === 'createdAt' ||
            columnField === 'updatedAt' ||
            columnField === 'startAt' ||
            columnField === 'endAt') &&
          value
        ) {
          filterValue =
            operatorValue === 'between' ? dateToFilterOnDay(value) : dateToFilterNotOnDay(value)
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
      }, {} as VoucherFilter),
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

  const handleRowClick = (data: GridRowData) => {
    setDialogMethod('update')
    setDialogOpen(true)
    setSelectedVoucher(data.row)
  }

  useEffect(() => {
    refetch()
  }, [voucherFilter, refetch])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('voucher.id'),
      description: t('voucher.id'),
      hide: !visibilityColumns.id,
      flex: 0,
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
      field: 'description',
      headerName: t('voucher.description'),
      description: t('voucher.description'),
      hide: !visibilityColumns.description,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
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
      field: 'startAt',
      headerName: t('voucher.startAt'),
      description: t('voucher.startAt'),
      hide: !visibilityColumns.startAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'endAt',
      headerName: t('voucher.endAt'),
      description: t('voucher.endAt'),
      hide: !visibilityColumns.endAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'createdAt',
      headerName: t('voucher.createdAt'),
      description: t('voucher.createdAt'),
      hide: !visibilityColumns.createdAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'updatedAt',
      headerName: t('voucher.updatedAt'),
      description: t('voucher.updatedAt'),
      hide: !visibilityColumns.updatedAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
  ]

  const vouchers =
    voucherData?.data.map((voucher) => {
      return {
        id: voucher.id,
        code: voucher.code,
        description: voucher.description,
        percentDiscount: voucher.percentDiscount,
        amount: voucher.amount,
        limitPerUser: voucher.limitPerUser,
        startAt: voucher.startAt,
        endAt: voucher.endAt,
        createdAt: voucher.createdAt,
        updatedAt: voucher.updatedAt,
      }
    }) || []

  return (
    <Page>
      <PageToolbar>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            setDialogOpen(true)
            setDialogMethod('create')
          }}
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
          rowCount={voucherData?.totalData}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          rows={vouchers}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleRowClick}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
          sortingMode="server"
          onSortModelChange={handleSortChange}
          loading={isFetching}
        />

        <CreateUpdateDialog
          open={dialogOpen}
          method={dialogMethod}
          voucher={selectedVoucher}
          onClose={() => {
            setDialogOpen(false)
            setDialogMethod('create')
            setSelectedVoucher(null)
          }}
        />
      </Card>
    </Page>
  )
}
