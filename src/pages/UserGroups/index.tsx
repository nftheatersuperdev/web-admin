import { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Card, Button, IconButton, Breadcrumbs, Typography, Tooltip } from '@material-ui/core'
import {
  Delete as DeleteIcon,
  GroupAdd as GroupAddIcon,
  Edit as EditIcon,
} from '@material-ui/icons'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridRowData,
  GridCellParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  getEqualFilterOperators,
  getContainFilterOperators,
  FieldComparisons,
  FieldKeyOparators,
  columnFormatDate,
  geEqualtDateTimeOperators,
} from 'utils'
import config from 'config'
import { useQuery } from 'react-query'
import { searchCustomerGroup } from 'services/web-bff/customer'
import { useDeleteUserGroup } from 'services/evme'
import { UserGroup as UserGroupType } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { UserGroupInputRequest } from 'services/web-bff/user.type'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import CreateUpdateDialog from './CreateUpdateDialog'

const MarginBottom = styled.div`
  margin-bottom: 20px;
`
const defaultFilter: UserGroupInputRequest = {} as UserGroupInputRequest

export default function UserGroup(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [userGroupFilter, setUserGroupFilter] = useState<UserGroupInputRequest>({
    ...defaultFilter,
  })
  const [userGroupSelected, setUserGroupSelected] = useState<UserGroupType | null>()
  const [openCreateUpdateDialog, setOpenCreateUpdateDialog] = useState<boolean>(false)
  const {
    data: userGroupData,
    refetch,
    isFetching,
  } = useQuery('user-group-list', () =>
    searchCustomerGroup({
      data: userGroupFilter,
      page: currentPageIndex + 1,
      size: pageSize,
    })
  )

  const deleteUserGroup = useDeleteUserGroup()
  const equalOperators = getEqualFilterOperators(t)
  const containOperators = getContainFilterOperators(t)
  const dateEqualOperators = geEqualtDateTimeOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setCurrentPageIndex(0)
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    let keyValue = ''
    setUserGroupFilter({
      ...params.items.reduce((filter, { columnField, value, operatorValue }: GridFilterItem) => {
        if (value) {
          switch (operatorValue) {
            case FieldComparisons.equals:
              keyValue = `${columnField}${FieldKeyOparators.equals}`
              break
            case FieldComparisons.contains:
              keyValue = `${columnField}${FieldKeyOparators.contains}`
              break
          }
          filter = { [keyValue]: value }
        }
        return filter
      }, {} as UserGroupInputRequest),
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

  const removeUserGroup = async (refId: string) => {
    await toast.promise(
      deleteUserGroup.mutateAsync({
        id: refId,
      }),
      {
        loading: t('toast.loading'),
        success: t('userGroups.alert.changeName.success'),
        error: t('userGroups.alert.changeName.error'),
      }
    )
    refetch()
  }

  const handleDeleteRow = (rowData: GridRowData) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(t('userGroups.dialog.delete.confirmationMessage'))
    if (confirmed) {
      removeUserGroup(rowData.id)
    }
  }

  const handleOpenUpdateDialog = (rowData: GridRowData) => {
    const updateObject: UserGroupType = {
      id: rowData.id,
      name: rowData.name,
      createdDate: rowData.createdDate,
      updatedDate: rowData.updatedDate,
    }
    setUserGroupSelected(updateObject)
    setOpenCreateUpdateDialog(true)
  }

  useEffect(() => {
    refetch()
  }, [userGroupFilter, refetch, currentPageIndex])

  useEffect(() => {
    refetch()
  }, [refetch, pageSize])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('userGroups.id'),
      description: t('userGroups.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      sortable: false,
      filterOperators: equalOperators,
    },
    {
      field: 'name',
      headerName: t('userGroups.name'),
      description: t('userGroups.name'),
      hide: !visibilityColumns.name,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
      editable: false,
    },
    {
      field: 'createdDate',
      headerName: t('userGroups.createdDate'),
      description: t('userGroups.createdDate'),
      hide: !visibilityColumns.createdDate,
      flex: 1,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'updatedDate',
      headerName: t('userGroups.updatedDate'),
      description: t('userGroups.updatedDate'),
      hide: !visibilityColumns.updatedDate,
      flex: 1,
      sortable: false,
      filterOperators: dateEqualOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'actions',
      headerName: t('car.actions'),
      description: t('car.actions'),
      flex: 1,
      sortable: false,
      filterable: false,
      width: 140,
      renderCell: (params: GridCellParams) => {
        const { name } = params.row
        return (
          <Fragment>
            <IconButton onClick={() => handleOpenUpdateDialog(params.row)}>
              <EditIcon />
            </IconButton>
            <Tooltip title={t('userGroups.button.addUser.tooltip', { name })} arrow>
              <IconButton disabled onClick={() => history.push(`/user-groups/${params.id}/users`)}>
                <GroupAddIcon />
              </IconButton>
            </Tooltip>
            <IconButton aria-label="delete" disabled onClick={() => handleDeleteRow(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        )
      },
    },
  ]

  const userGroups =
    userGroupData?.data.customerGroups.map((userGroup) => {
      return {
        id: userGroup.id,
        name: userGroup.name,
        createdDate: userGroup.createdDate,
        updatedDate: userGroup.updatedDate,
      }
    }) || []
  const pagination = userGroupData?.data.pagination || null

  const handleFetchPage = (pageNumber: number) => {
    setCurrentPageIndex(pageNumber)
  }
  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setOpenCreateUpdateDialog(true)}>
          {t('userGroups.button.createNew')}
        </Button>
      </PageToolbar>

      <MarginBottom>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Typography>{t('userGroups.title')}</Typography>
        </Breadcrumbs>
      </MarginBottom>

      <Card>
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
          rows={userGroups}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
          loading={isFetching}
          onFetchNextPage={() => handleFetchPage(currentPageIndex + 1)}
          onFetchPreviousPage={() => handleFetchPage(currentPageIndex - 1)}
        />
      </Card>

      <CreateUpdateDialog
        open={openCreateUpdateDialog}
        userGroup={userGroupSelected}
        onClose={() => {
          setOpenCreateUpdateDialog(false)
          setUserGroupSelected(null)
          refetch()
        }}
      />
    </Page>
  )
}
