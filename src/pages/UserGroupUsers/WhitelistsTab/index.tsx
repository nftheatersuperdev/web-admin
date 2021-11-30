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
import { useUserGroupUsersWhitelist, useDeleteWhitelistFromUserGroup } from 'services/evme'
import DataGridLocale from 'components/DataGridLocale'
import { UserFilter } from 'services/evme.types'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

interface UserGroupUsersTabProps {
  ugid: string
  refetchData: boolean
  setRefetchData: (status: boolean) => void
}

export default function WhitelistsTab({
  ugid,
  refetchData,
  setRefetchData,
}: UserGroupUsersTabProps): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [userFilter, setUserFilter] = useState<UserFilter>()

  const {
    data: userGroupUsersWhitelistData,
    refetch,
    isFetching,
  } = useUserGroupUsersWhitelist(ugid, currentPageIndex, pageSize, userFilter)
  const deleteWhitelistFromUserGroup = useDeleteWhitelistFromUserGroup()
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
        deleteWhitelistFromUserGroup.mutateAsync({
          whitelistId: rowData.id,
          userGroupId: ugid,
        }),
        {
          loading: t('toast.loading'),
          success: () => {
            refetch()
            return t('userGroups.dialog.delete.success')
          },
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
      field: 'value',
      headerName: t('whitelist.value'),
      description: t('whitelist.value'),
      hide: !visibilityColumns.value,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'type',
      headerName: t('whitelist.type'),
      description: t('whitelist.type'),
      hide: !visibilityColumns.type,
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

  const userGroupWhitelistUsers =
    userGroupUsersWhitelistData?.data.map((userGroupwhitelist) => {
      return {
        id: userGroupwhitelist.id,
        value: userGroupwhitelist.value,
        type: userGroupwhitelist.type,
      }
    }) || []

  return (
    <DataGridLocale
      className="sticky-header"
      autoHeight
      pagination
      pageSize={pageSize}
      page={currentPageIndex}
      rowCount={userGroupUsersWhitelistData?.totalData}
      paginationMode="server"
      onPageSizeChange={handlePageSizeChange}
      onPageChange={setCurrentPageIndex}
      rows={userGroupWhitelistUsers}
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
