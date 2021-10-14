import { useState, useEffect, Fragment } from 'react'
import { Card, Button, IconButton, Chip } from '@material-ui/core'
import { Edit as EditIcon, Redeem as VoucherIcon } from '@material-ui/icons'
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
import { useVouchersFilterAndSort } from 'services/evme'
import { VoucherFilter, SortDirection, SubOrder, Voucher as VoucherType } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import CreateUpdateDialog from './CreateUpdateDialog'
import PackagePriceDialog from './PackagePriceDialog'

export default function Voucher(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [voucherFilter, setVoucherFilter] = useState<VoucherFilter>({})
  const [voucherSort, setVoucherSort] = useState<SubOrder>({})
  const [createUpdateDialogOpen, setCreateUpdateDialogOpen] = useState<boolean>(false)
  const [packagePriceDialogOpen, setPackagePriceDialogOpen] = useState<boolean>(false)
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherType | null>()

  const {
    data: voucherData,
    refetch,
    isFetching,
  } = useVouchersFilterAndSort(voucherFilter, voucherSort, currentPageIndex, pageSize)

  const idFilterOperators = getIdFilterOperators(t)
  const numericFilterOperators = getNumericFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterMoreOperators(t)
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
          const comparingOperations = ['gt', 'gte', 'lt', 'lte']

          if (operatorValue === 'between') {
            filterValue = dateToFilterOnDay(value)
          } else if (comparingOperations.includes(operatorValue as string)) {
            filterValue = dateToFilterGreaterOrLess(value)
          } else {
            filterValue = dateToFilterNotOnDay(value)
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

  const handleDialogData = (module: string, data: GridRowData) => {
    const object: VoucherType = {
      id: data.id,
      code: data.code,
      descriptionEn: data.descriptionEn,
      descriptionTh: data.descriptionTh,
      percentDiscount: data.percentDiscount,
      amount: data.amount,
      limitPerUser: data.limitPerUser,
      userGroups: data.userGroups,
      packagePrices: data.packagePrices,
      startAt: data.startAt,
      endAt: data.endAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
    setSelectedVoucher(object)

    if (module === 'createUpdate') {
      setCreateUpdateDialogOpen(true)
    } else if (module === 'packagePrice') {
      setPackagePriceDialogOpen(true)
    }
  }

  // const handleDeleteRow = (data: GridRowData) => {
  //   console.log('handleDeleteRow: data ->', data)
  // }

  useEffect(() => {
    refetch()
  }, [voucherFilter, refetch])

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
      sortable: false,
      filterable: false,
      width: 140,
      renderCell: (params: GridCellParams) => {
        return (
          <Fragment>
            <IconButton onClick={() => handleDialogData('createUpdate', params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDialogData('packagePrice', params.row)}>
              <VoucherIcon />
            </IconButton>
            {/* <IconButton aria-label="delete" onClick={() => handleDeleteRow(params.row)}>
              <DeleteIcon />
            </IconButton> */}
          </Fragment>
        )
      },
    },
  ]

  const vouchers =
    voucherData?.data.map((voucher) => {
      return {
        id: voucher.id,
        code: voucher.code,
        descriptionEn: voucher.descriptionEn,
        descriptionTh: voucher.descriptionTh,
        percentDiscount: voucher.percentDiscount,
        amount: voucher.amount,
        limitPerUser: voucher.limitPerUser,
        userGroups: voucher.userGroups,
        packagePrices: voucher.packagePrices,
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
            setCreateUpdateDialogOpen(true)
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
