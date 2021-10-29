import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { Card, Button, IconButton, Typography, Breadcrumbs } from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import {
  GridColDef,
  GridPageChangeParams,
  GridCellParams,
  GridRowData,
} from '@material-ui/data-grid'
import { getIdFilterOperators, getStringFilterOperators } from 'utils'
import config from 'config'
import { useUserGroupUsers, useUserGroup, useRemoveUserGroupsFromUser } from 'services/evme'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import InviteDialog from './InviteDialog'

interface UserGroupUsersParams {
  ugid: string
}

const MarginBottom = styled.div`
  margin-bottom: 20px;
`

export default function UserGroupUsers(): JSX.Element {
  const { ugid } = useParams<UserGroupUsersParams>()
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [openInviteDialog, setOpenInviteDialog] = useState<boolean>(false)

  const {
    data: userGroupUsersData,
    refetch,
    isFetching,
  } = useUserGroupUsers(ugid, currentPageIndex, pageSize)

  const { data: userGroup } = useUserGroup(ugid)
  const removeUserGroupsFromUser = useRemoveUserGroupsFromUser()

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
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

  const handleDeleteRow = (rowData: GridRowData) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(t('userGroups.dialog.delete.confirmationMessage'))
    if (confirmed) {
      toast.promise(
        removeUserGroupsFromUser.mutateAsync({
          id: rowData.id,
          relationIds: [ugid],
        }),
        {
          loading: t('toast.loading'),
          success: t('userGroups.dialog.delete.success'),
          error: t('userGroups.dialog.delete.error'),
        }
      )
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('user.id'),
      description: t('user.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      sortable: false,
      filterOperators: idFilterOperators,
    },
    {
      field: 'firstName',
      headerName: t('user.firstName'),
      description: t('user.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'lastName',
      headerName: t('user.lastName'),
      description: t('user.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'email',
      headerName: t('user.email'),
      description: t('user.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'phoneNumber',
      headerName: t('user.phone'),
      description: t('user.phone'),
      hide: !visibilityColumns.phoneNumber,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
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
          <IconButton aria-label="delete" onClick={() => handleDeleteRow(params.row)}>
            <DeleteIcon />
          </IconButton>
        )
      },
    },
  ]

  const userGroupUsers =
    userGroupUsersData?.data.map((userGroupUser) => {
      return {
        id: userGroupUser.id,
        firstName: userGroupUser.firstName,
        lastName: userGroupUser.lastName,
        email: userGroupUser.email,
        phoneNumber: userGroupUser.phoneNumber,
      }
    }) || []

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setOpenInviteDialog(true)}>
          {t('userGroups.dialog.invitation.button')}
        </Button>
      </PageToolbar>

      <MarginBottom>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Link color="textPrimary" to="/user-groups">
            {t('userGroups.title')}
          </Link>
          <Typography>{userGroup?.name}</Typography>
        </Breadcrumbs>
      </MarginBottom>

      <Card>
        <DataGridLocale
          className="sticky-header"
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={userGroupUsersData?.totalData}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          rows={userGroupUsers}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onColumnVisibilityChange={onColumnVisibilityChange}
          loading={isFetching}
        />
      </Card>

      <InviteDialog
        userGroupId={ugid}
        open={openInviteDialog}
        onClose={() => {
          setOpenInviteDialog(false)
          refetch()
        }}
      />
    </Page>
  )
}
