import config from 'config'
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  GridColDef,
  GridPageChangeParams,
  GridCellParams,
  GridRowData,
  GridFilterModel,
  GridFilterItem,
} from '@material-ui/data-grid'
import { getIdFilterOperators, getStringFilterOperators, stringToFilterContains } from 'utils'
import { IconButton } from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'
import { useQuery } from 'react-query'
import { useRemoveUserGroupsFromUser } from 'services/evme'
import DataGridLocale from 'components/DataGridLocale'
import { UserFilter } from 'services/evme.types'
import { UserMeProps } from 'services/web-bff/user.type'
import { searchUserInUserGroup } from 'services/web-bff/user'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

interface UserGroupUsersTabProps {
  ugid: string
  refetchData: boolean
  setRefetchData: (status: boolean) => void
}

export default function UsersTab({
  ugid,
  refetchData,
  setRefetchData,
}: UserGroupUsersTabProps): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [userFilter, setUserFilter] = useState<UserFilter>()

  /* {
    data: userGroupUsersData,
    refetch,
    isFetching,
  } = useUserGroupUsers(ugid, currentPageIndex, pageSize, userFilter)*/
  const {
    data: userGroupUsersData,
    refetch,
    isFetching,
  } = useQuery('user-list', () =>
    searchUserInUserGroup({
      id: ugid,
      data: userFilter,
      page: currentPageIndex,
      size: pageSize,
    } as UserMeProps)
  )

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

  const handleFilterChange = (params: GridFilterModel) => {
    setUserFilter({
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (operatorValue === 'iLike' && value) {
          filterValue = stringToFilterContains(value)
        }

        if (filterValue) {
          /* @ts-expect-error TODO */
          filter[columnField] = {
            [operatorValue as string]: filterValue,
          }
        }

        return filter
      }, {} as UserFilter),
    })
    // reset page
    setCurrentPageIndex(0)
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

  useEffect(() => {
    refetch()
  }, [userFilter, refetch])

  useEffect(() => {
    if (refetchData) {
      refetch()
      setRefetchData(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetchData])

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
    userGroupUsersData?.data.userGroup.users.map((userGroupUser) => {
      return {
        id: userGroupUser.id,
        firstName: userGroupUser.firstName,
        lastName: userGroupUser.lastName,
        email: userGroupUser.email,
        phoneNumber: userGroupUser.phoneNumber,
      }
    }) || []

  const pagination = userGroupUsersData?.data.pagination || null

  return (
    <DataGridLocale
      className="sticky-header"
      autoHeight
      pagination
      pageSize={pageSize}
      page={currentPageIndex}
      rowCount={pagination?.totalRecords}
      paginationMode="server"
      onPageSizeChange={handlePageSizeChange}
      onPageChange={setCurrentPageIndex}
      rows={userGroupUsers}
      columns={columns}
      checkboxSelection
      disableSelectionOnClick
      onColumnVisibilityChange={onColumnVisibilityChange}
      filterMode="server"
      onFilterModelChange={handleFilterChange}
      loading={isFetching}
    />
  )
}
