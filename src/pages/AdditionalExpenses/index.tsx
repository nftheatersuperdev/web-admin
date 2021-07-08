import { useState, useMemo, Fragment } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  GridColDef,
  GridCellParams,
  GridRowData,
  GridRowParams,
  GridPageChangeParams,
} from '@material-ui/data-grid'
import toast from 'react-hot-toast'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { formatDates, formatMoney } from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import {
  useAdditionalExpenses,
  useAdditionalExpenseById,
  useUpdateAdditionalExpense,
} from 'services/evme'
import DataGridLocale from 'components/DataGridLocale'
import ConfirmDialog from 'components/ConfirmDialog'
import CreateDialog from './AdditionalExpenseCreateDialog'
import UpdateDialog from './AdditionalExpenseUpdateDialog'

export default function AdditionalExpenses(): JSX.Element {
  const { t } = useTranslation()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState<GridRowData>()
  const [currentExpenseId, setCurrentExpenseId] = useState<string>('')

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const { data, fetchNextPage, fetchPreviousPage } = useAdditionalExpenses(pageSize)

  const { data: currentExpenseData, isLoading } = useAdditionalExpenseById(currentExpenseId, {
    enabled: !!currentExpenseId,
    onError: () => {
      console.error(`${t('additionalExpense.findByIdError')}: ${currentExpenseId}`)
    },
  })

  const updateAdditionalExpense = useUpdateAdditionalExpense()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const rows = useMemo(
    () =>
      data?.pages[currentPageIndex]?.edges?.map(({ node }) => {
        const { userId, user } = node.subscription || {}
        const userFullName = `${user?.firstName || ''} ${user?.lastName || ''}`
        return {
          id: node?.id,
          subscriptionId: node?.subscriptionId,
          userId,
          userFullName,
          noticeDate: node?.noticeDate,
          type: node?.type,
          price: node?.price,
          status: node?.status,
          note: node?.note,
          createdAt: node?.createdAt,
          updatedAt: node?.updatedAt,
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
      flex: 1,
      hide: true,
    },
    {
      field: 'subscriptionId',
      headerName: t('additionalExpense.subscriptionId'),
      description: t('additionalExpense.subscriptionId'),
      flex: 1,
    },
    {
      field: 'userId',
      headerName: t('additionalExpense.userId'),
      description: t('additionalExpense.userId'),
      flex: 1,
      hide: true,
    },
    {
      field: 'userFullName',
      headerName: t('additionalExpense.userFullName'),
      description: t('additionalExpense.userFullName'),
      flex: 1,
    },
    {
      field: 'noticeDate',
      headerName: t('additionalExpense.noticeDate'),
      description: t('additionalExpense.noticeDate'),
      valueFormatter: formatDates,
      flex: 1,
    },
    {
      field: 'type',
      headerName: t('additionalExpense.type'),
      description: t('additionalExpense.type'),
      flex: 1,
    },
    {
      field: 'price',
      headerName: t('additionalExpense.price'),
      description: t('additionalExpense.price'),
      valueFormatter: formatMoney,
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('additionalExpense.status'),
      description: t('additionalExpense.status'),
      flex: 1,
    },
    {
      field: 'note',
      headerName: t('additionalExpense.note'),
      description: t('additionalExpense.note'),
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t('additionalExpense.createdDate'),
      description: t('additionalExpense.createdDate'),
      valueFormatter: formatDates,
      flex: 1,
      hide: true,
    },
    {
      field: 'updatedAt',
      headerName: t('additionalExpense.updatedDate'),
      description: t('additionalExpense.updatedDate'),
      valueFormatter: formatDates,
      flex: 1,
      hide: true,
    },
    {
      field: 'actions',
      headerName: t('additionalExpense.actions'),
      description: t('additionalExpense.actions'),
      sortable: false,
      disableClickEventBubbling: true,
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
