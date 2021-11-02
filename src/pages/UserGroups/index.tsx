import { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Card, Button, IconButton, Breadcrumbs, Typography } from '@material-ui/core'
import { Delete as DeleteIcon, People as UserIcon, Edit as EditIcon } from '@material-ui/icons'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridSortModel,
  GridRowData,
  GridCellParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  getIdFilterOperators,
  getStringFilterOperators,
  getDateFilterMoreOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  dateToFilterGreaterOrLess,
  stringToFilterContains,
  columnFormatDate,
} from 'utils'
import config from 'config'
import { useUserGroupsFilterAndSort, useDeleteUserGroup } from 'services/evme'
import {
  UserGroupFilter,
  SortDirection,
  SubOrder,
  UserGroup as UserGroupType,
} from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import CreateUpdateDialog from './CreateUpdateDialog'

const MarginBottom = styled.div`
  margin-bottom: 20px;
`

export default function UserGroup(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [userGroupFilter, setUserGroupFilter] = useState<UserGroupFilter>({})
  const [userGroupSort, setUserGroupSort] = useState<SubOrder>({})
  const [userGroupSelected, setUserGroupSelected] = useState<UserGroupType | null>()
  const [openCreateUpdateDialog, setOpenCreateUpdateDialog] = useState<boolean>(false)

  const {
    data: userGroupData,
    refetch,
    isFetching,
  } = useUserGroupsFilterAndSort(userGroupFilter, userGroupSort, currentPageIndex, pageSize)

  const deleteUserGroup = useDeleteUserGroup()

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterMoreOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setUserGroupFilter({
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (
          (columnField === 'createdAt' ||
            columnField === 'updatedAt' ||
            columnField === 'startAt' ||
            columnField === 'endAt') &&
          value
        ) {
          const comparingValue = operatorValue as string
          const comparingOperations = ['gt', 'lt', 'gte', 'lte']
          const isUsingOperators = comparingOperations.includes(comparingValue)
          const isGreaterThanOrLessThanEqual = ['gt', 'lte'].includes(comparingValue)

          if (operatorValue === 'between') {
            filterValue = dateToFilterOnDay(value)
          } else if (operatorValue === 'notBetween') {
            filterValue = dateToFilterNotOnDay(value)
          } else if (isUsingOperators) {
            filterValue = dateToFilterGreaterOrLess(value, isGreaterThanOrLessThanEqual)
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
      }, {} as UserGroupFilter),
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

      setUserGroupSort(order)
      refetch()
    }
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
      createdAt: rowData.createdAt,
      updatedAt: rowData.updatedAt,
    }
    setUserGroupSelected(updateObject)
    setOpenCreateUpdateDialog(true)
  }

  useEffect(() => {
    refetch()
  }, [userGroupFilter, refetch])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('userGroups.id'),
      description: t('userGroups.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      sortable: false,
      filterOperators: idFilterOperators,
    },
    {
      field: 'name',
      headerName: t('userGroups.name'),
      description: t('userGroups.name'),
      hide: !visibilityColumns.name,
      flex: 1,
      sortable: false,
      filterOperators: stringFilterOperators,
      editable: false,
    },
    {
      field: 'createdAt',
      headerName: t('userGroups.createdAt'),
      description: t('userGroups.createdAt'),
      hide: !visibilityColumns.createdAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'updatedAt',
      headerName: t('userGroups.updatedAt'),
      description: t('userGroups.updatedAt'),
      hide: !visibilityColumns.updatedAt,
      flex: 1,
      sortable: true,
      filterOperators: dateFilterOperators,
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
        return (
          <Fragment>
            <IconButton onClick={() => handleOpenUpdateDialog(params.row)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => history.push(`/user-groups/${params.id}/users`)}>
              <UserIcon />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => handleDeleteRow(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Fragment>
        )
      },
    },
  ]

  const userGroups =
    userGroupData?.data.map((userGroup) => {
      return {
        id: userGroup.id,
        name: userGroup.name,
        createdAt: userGroup.createdAt,
        updatedAt: userGroup.updatedAt,
      }
    }) || []

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
          rowCount={userGroupData?.totalData}
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
          sortingMode="server"
          onSortModelChange={handleSortChange}
          loading={isFetching}
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
