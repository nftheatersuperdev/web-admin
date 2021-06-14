import { useState, Fragment } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCellParams,
  GridRowData,
  GridRowParams,
} from '@material-ui/data-grid'
import toast from 'react-hot-toast'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import { formatDates, formatMoney } from 'utils'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import {
  useAdditionalExpenses,
  useAdditionalExpenseById,
  useUpdateAdditionalExpense,
} from 'services/evme'
import CreateDialog from 'pages/AdditionalExpenses/CreateDialog'
import ConfirmDialog from 'components/ConfirmDialog'
import UpdateDialog from './UpdateDialog'

export default function AdditionalExpenses(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState<GridRowData>()
  const [currentExpenseId, setCurrentExpenseId] = useState<string>('')

  const { data } = useAdditionalExpenses()

  const { data: currentExpenseData, isLoading } = useAdditionalExpenseById(currentExpenseId, {
    enabled: !!currentExpenseId,
    onError: () => {
      console.error(`Unable to retrieve additional expense by id: ${currentExpenseId}`)
    },
  })

  const updateAdditionalExpense = useUpdateAdditionalExpense()

  const rows = data?.edges?.map(({ node }) => ({
    id: node?.id,
    subscriptionId: node?.subscriptionId,
    createdAt: node?.createdAt,
    updatedAt: node?.updatedAt,
    noticeDate: node?.noticeDate,
    type: node?.type,
    status: node?.status,
    note: node?.note,
    price: node?.price,
  }))

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
        loading: 'Loading',
        success: 'Deleted additional expense successfully!',
        error: 'Failed to delete additional expense!',
      }
    )

    setIsDeleteDialogOpen(false)
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', description: 'ID', flex: 1 },
    {
      field: 'subscriptionId',
      headerName: 'Subscription ID',
      description: 'Subscription ID',
      flex: 1,
    },
    { field: 'note', headerName: 'Notes', description: 'Notes', flex: 1 },
    {
      field: 'noticeDate',
      headerName: 'Date of expense notice',
      description: 'Date of expense notice',
      valueFormatter: formatDates,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: 'Date Created',
      description: 'Date Created',
      valueFormatter: formatDates,
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: 'Dated Updated',
      description: 'Date Updated',
      valueFormatter: formatDates,
      flex: 1,
    },
    { field: 'type', headerName: 'Type', description: 'Type of Expense', flex: 1 },
    { field: 'status', headerName: 'Status', description: 'Status', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      description: 'Price',
      valueFormatter: formatMoney,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      description: 'Record actions',
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
          Create Additional Expense
        </Button>
      </PageToolbar>

      {rows ? (
        <Card>
          <DataGrid
            autoHeight
            autoPageSize
            rows={rows}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            onRowClick={(params: GridRowParams) => {
              setCurrentExpenseId(params.row.id)
              setIsUpdateDialogOpen(true)
            }}
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Card>
      ) : null}

      <CreateDialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} />

      <UpdateDialog
        open={isUpdateDialogOpen && !isLoading}
        onClose={() => setIsUpdateDialogOpen(false)}
        initialData={currentExpenseData}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Additional Expense"
        message={`Are you sure that you want to delete this ID: ${currentRowData?.id} ?`}
        onConfirm={() => handleSubmitDelete(currentRowData)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Page>
  )
}
