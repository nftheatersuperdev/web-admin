import { useState } from 'react'
import { Button, Card, IconButton } from '@material-ui/core'
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridCellParams,
  GridRowData,
} from '@material-ui/data-grid'
import DeleteIcon from '@material-ui/icons/Delete'
import toast from 'react-hot-toast'
import { formatDates, formatMoney } from 'utils'
import dayjs from 'dayjs'
import PageToolbar from 'layout/PageToolbar'
import { Page } from 'layout/LayoutRoute'
import {
  useAdditionalExpenses,
  useCreateAdditionalExpense,
  useUpdateAdditionalExpense,
} from 'services/evme'
import AdditionalExpenseCreateDialog from 'pages/AdditionalExpenseCreateDialog'
import ConfirmDialog from 'components/ConfirmDialog'
import { AdditionalExpenseInput } from 'services/evme.types'

export default function AdditionalExpenses(): JSX.Element {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRowData, setCurrentRowData] = useState({} as GridRowData)
  const { data } = useAdditionalExpenses()
  const createAdditionalExpense = useCreateAdditionalExpense()
  const updateAdditionalExpense = useUpdateAdditionalExpense()

  // Transform response into table format
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

  const onCloseDialog = async (data: AdditionalExpenseInput | null) => {
    if (!data) {
      setIsCreateDialogOpen(false)
      return
    }

    const { subscriptionId, price, type, status, noticeDate, note } = data

    await toast.promise(
      createAdditionalExpense.mutateAsync({
        subscriptionId,
        price,
        type,
        status,
        noticeDate: dayjs(noticeDate).toISOString(),
        note,
      }),
      {
        loading: 'Loading',
        success: 'Created additional expense successfully!',
        error: 'Failed to create additional expense!',
      }
    )

    setIsCreateDialogOpen(false)
  }

  const handleDeleteIconClick = (rowData: GridRowData) => {
    setCurrentRowData(rowData)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async (rowData: GridRowData) => {
    if (!rowData) {
      setIsDeleteDialogOpen(false)
      return
    }

    const { id, subscriptionId, price, type, noticeDate, note } = rowData

    await toast.promise(
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
        <IconButton aria-label="delete" onClick={() => handleDeleteIconClick(params.row)}>
          <DeleteIcon />
        </IconButton>
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
            components={{
              Toolbar: GridToolbar,
            }}
          />
        </Card>
      ) : null}
      <AdditionalExpenseCreateDialog
        open={isCreateDialogOpen}
        onClose={(data: AdditionalExpenseInput | null) => onCloseDialog(data)}
      />
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Additional Expense"
        message={`Are you sure that you want to delete this ID: ${currentRowData.id} ?`}
        onConfirm={() => handleConfirmDelete(currentRowData)}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Page>
  )
}
