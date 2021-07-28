import { useState, useMemo, useEffect, Fragment } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  GridColDef,
  GridCellParams,
  GridRowData,
  GridRowParams,
  GridPageChangeParams,
  GridFilterModel,
  GridFilterItem,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import toast from 'react-hot-toast'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  columnFormatMoney,
  getIdFilterOperators,
  getNumericFilterOperators,
  getDateFilterOperators,
  getSelectFilterOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,
} from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import {
  useAdditionalExpenses,
  useAdditionalExpenseById,
  useUpdateAdditionalExpense,
} from 'services/evme'
import { AdditionalExpenseFilter } from 'services/evme.types'
import DataGridLocale from 'components/DataGridLocale'
import ConfirmDialog from 'components/ConfirmDialog'
import CreateDialog from './AdditionalExpenseCreateDialog'
import UpdateDialog from './AdditionalExpenseUpdateDialog'
import { getExpenseTypeOptions, getExpenseStatusOptions } from './utils'

export default function AdditionalExpenses(): JSX.Element {
  const { t } = useTranslation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState<GridRowData>()
  const [currentExpenseId, setCurrentExpenseId] = useState<string>('')
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [expenseFilter, setExpenseFilter] = useState<AdditionalExpenseFilter>({})

  const { data, refetch, fetchNextPage, fetchPreviousPage } = useAdditionalExpenses(pageSize)

  const { data: currentExpenseData, isLoading } = useAdditionalExpenseById(currentExpenseId, {
    enabled: !!currentExpenseId,
    onError: () => {
      console.error(`${t('additionalExpense.findByIdError')}: ${currentExpenseId}`)
    },
  })

  const updateAdditionalExpense = useUpdateAdditionalExpense()

  const idFilterOperators = getIdFilterOperators(t)
  const numericFilterOperators = getNumericFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)
  const expenseTypeOptions = getExpenseTypeOptions(t)
  const expenseStatusOptions = getExpenseStatusOptions(t)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setExpenseFilter(
      params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (columnField === 'noticeDate' && value) {
          filterValue =
            operatorValue === 'between' ? dateToFilterOnDay(value) : dateToFilterNotOnDay(value)
        }

        if (operatorValue === 'iLike' && value) {
          filterValue = stringToFilterContains(value)
        }

        if (columnField === 'price' && value) {
          filterValue = +value
        }

        if (filterValue) {
          /* @ts-expect-error TODO */
          filter[columnField] = {
            [operatorValue as string]: filterValue,
          }
        }

        return filter
      }, {} as AdditionalExpenseFilter)
    )
    // reset page
    setCurrentPageIndex(0)
  }

  useEffect(() => {
    refetch()
  }, [expenseFilter, refetch])

  const rows = useMemo(
    () =>
      data?.pages[currentPageIndex]?.edges?.map(({ node }) => {
        const { userId, user } = node.subscription || {}
        const userFullName = `${user?.firstName || ''} ${user?.lastName || ''}`
        return {
          id: node.id,
          subscriptionId: node.subscriptionId,
          userId,
          userFullName,
          noticeDate: node.noticeDate,
          type: node.type,
          price: node.price,
          status: node.status,
          note: node.note,
          createdAt: node.createdAt,
          updatedAt: node.updatedAt,
        }
      }) || [],
    [data, currentPageIndex]
  )

  const handleSubmitDelete = (rowData?: GridRowData) => {
    if (!rowData) {
      setIsDeleteDialogOpen(false)
      return
    }

    const { id, subscriptionId, price, type, noticeDate, note } = rowData

    toast.promise(
      updateAdditionalExpense.mutateAsync({
        id,
        update: {
          subscriptionId,
          price,
          type,
          noticeDate,
          note,
          status: 'cancelled',
        },
      }),
      {
        loading: t('toast.loading'),
        success: t('additionalExpense.deleteDialog.success'),
        error: t('additionalExpense.deleteDialog.error'),
      }
    )

    setIsDeleteDialogOpen(false)
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('additionalExpense.id'),
      description: t('additionalExpense.id'),
      filterOperators: idFilterOperators,
      flex: 1,
      hide: true,
    },
    {
      field: 'subscriptionId',
      headerName: t('additionalExpense.subscriptionId'),
      description: t('additionalExpense.subscriptionId'),
      filterOperators: idFilterOperators,
      flex: 1,
    },
    {
      field: 'userId',
      headerName: t('additionalExpense.userId'),
      description: t('additionalExpense.userId'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'userFullName',
      headerName: t('additionalExpense.userFullName'),
      description: t('additionalExpense.userFullName'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'noticeDate',
      headerName: t('additionalExpense.noticeDate'),
      description: t('additionalExpense.noticeDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'type',
      headerName: t('additionalExpense.type.title'),
      description: t('additionalExpense.type.title'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams): string => {
        switch (params.value) {
          case 'maintenance':
            return t('additionalExpense.type.maintenance')
          case 'insurance':
            return t('additionalExpense.type.insurance')
          case 'service':
            return t('additionalExpense.type.service')
          case 'repair':
            return t('additionalExpense.type.repair')
          case 'replacement':
            return t('additionalExpense.type.replacement')
          default:
            return '-'
        }
      },
      filterOperators: selectFilterOperators,
      valueOptions: expenseTypeOptions,
    },
    {
      field: 'price',
      headerName: t('additionalExpense.price'),
      description: t('additionalExpense.price'),
      valueFormatter: columnFormatMoney,
      filterOperators: numericFilterOperators,
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('additionalExpense.status.title'),
      description: t('additionalExpense.status.title'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams): string => {
        switch (params.value) {
          case 'created':
            return t('additionalExpense.status.created')
          case 'informed':
            return t('additionalExpense.status.informed')
          case 'pending':
            return t('additionalExpense.status.pending')
          case 'paid':
            return t('additionalExpense.status.paid')
          case 'cancelled':
            return t('additionalExpense.status.cancelled')
          default:
            return '-'
        }
      },
      filterOperators: selectFilterOperators,
      valueOptions: expenseStatusOptions,
    },
    {
      field: 'note',
      headerName: t('additionalExpense.note'),
      description: t('additionalExpense.note'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdAt',
      headerName: t('additionalExpense.createdDate'),
      description: t('additionalExpense.createdDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'updatedAt',
      headerName: t('additionalExpense.updatedDate'),
      description: t('additionalExpense.updatedDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'actions',
      headerName: t('additionalExpense.actions'),
      description: t('additionalExpense.actions'),
      sortable: false,
      filterable: false,
      width: 140,
      renderCell: (params: GridCellParams) => (
        <Fragment>
          <IconButton
            aria-label="edit"
            onClick={() => {
              setCurrentExpenseId(params.row.id)
              setIsUpdateDialogOpen(true)
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => {
              setCurrentRowData(params.row)
              setIsDeleteDialogOpen(true)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Fragment>
      ),
    },
  ]

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          {t('additionalExpense.createButton')}
        </Button>
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
          onFetchNextPage={fetchNextPage}
          onFetchPreviousPage={fetchPreviousPage}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={(params: GridRowParams) => {
            setCurrentExpenseId(params.row.id)
            setIsUpdateDialogOpen(true)
          }}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
        />
      </Card>

      <CreateDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

      <UpdateDialog
        open={isUpdateDialogOpen && !isLoading}
        onClose={() => setIsUpdateDialogOpen(false)}
        initialData={currentExpenseData}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title={t('additionalExpense.deleteDialog.title')}
        message={`t('additionalExpense.deleteDialog.message'): ${currentRowData?.id} ?`}
        onConfirm={() => handleSubmitDelete(currentRowData)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Page>
  )
}
