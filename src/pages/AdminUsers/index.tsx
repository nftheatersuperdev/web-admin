import { useState, useEffect } from 'react'
import { Card, Chip, IconButton } from '@material-ui/core'
import {
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridPageChangeParams,
  GridRowParams,
  GridValueFormatterParams,
  GridFilterItem,
} from '@material-ui/data-grid'
import { Check as EnabledIcon, Close as DisabledIcon, Search as ViewIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  getIdFilterOperators,
  getStringFilterOperators,
  getDateFilterOperators,
  getSelectFilterOperators,
  getBooleanFilterOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,
} from 'utils'
import config from 'config'
import { useAuth } from 'auth/AuthContext'
import { ROLES } from 'auth/roles'
import { useUsers } from 'services/evme'
import { User, UserFilter } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import AdminUserDetailDialog from './AdminUserDetailDialog'

export default function AdminUsers(): JSX.Element {
  const { t } = useTranslation()
  const { firebaseUser } = useAuth()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({})

  const defaultFilter = {
    role: {
      in: [ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
    },
    firebaseId: { neq: firebaseUser?.uid },
  }

  const [userFilter, setUserFilter] = useState<UserFilter>({ ...defaultFilter })

  const { data, refetch, fetchNextPage, fetchPreviousPage } = useUsers(pageSize, userFilter)

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)
  const booleanFilterOperators = getBooleanFilterOperators(t)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setUserFilter({
      ...defaultFilter,
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

        if (columnField === 'disabled' && value) {
          filterValue = value === 'true' ? false : true
        }

        if ((columnField === 'createdAt' || columnField === 'updatedAt') && value) {
          filterValue =
            operatorValue === 'between' ? dateToFilterOnDay(value) : dateToFilterNotOnDay(value)
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

        return filter
      }, {} as UserFilter),
    })
    // reset page
    setCurrentPageIndex(0)
  }

  useEffect(() => {
    refetch()
  }, [userFilter, refetch])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('user.id'),
      description: t('user.id'),
      flex: 1,
      hide: true,
      filterOperators: idFilterOperators,
    },
    {
      field: 'firstName',
      headerName: t('user.firstName'),
      description: t('user.firstName'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'lastName',
      headerName: t('user.lastName'),
      description: t('user.lastName'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'email',
      headerName: t('user.email'),
      description: t('user.email'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'phoneNumber',
      headerName: t('user.phone'),
      description: t('user.phone'),
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'role',
      headerName: t('user.role'),
      description: t('user.role'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams): string => {
        switch (params.value) {
          case ROLES.SUPER_ADMIN:
            return t('role.superAdmin')
          case ROLES.ADMIN:
            return t('role.admin')
          case ROLES.CUSTOMER_SUPPORT:
            return t('role.customerSupport')
          case ROLES.OPERATION:
            return t('role.operation')
          default:
            return '-'
        }
      },
      filterOperators: selectFilterOperators,
      valueOptions: [
        {
          label: t('role.admin'),
          value: ROLES.ADMIN,
        },
        {
          label: t('role.customerSupport'),
          value: ROLES.CUSTOMER_SUPPORT,
        },
        {
          label: t('role.operation'),
          value: ROLES.OPERATION,
        },
      ],
    },
    {
      field: 'disabled',
      headerName: t('user.status'),
      description: t('user.status'),
      filterOperators: booleanFilterOperators,
      flex: 1,
      renderCell: (params: GridCellParams) =>
        params.value ? (
          <Chip
            variant="outlined"
            size="small"
            icon={<DisabledIcon />}
            label={t('user.disabled')}
            color="secondary"
          />
        ) : (
          <Chip
            variant="outlined"
            size="small"
            icon={<EnabledIcon />}
            label={t('user.enabled')}
            color="primary"
          />
        ),
    },
    {
      field: 'createdAt',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: t('user.actions'),
      description: t('user.actions'),
      sortable: false,
      filterable: false,
      width: 140,
      renderCell: (params: GridCellParams) => (
        <IconButton
          aria-label="edit"
          onClick={() => {
            setSelectedUser({ ...params.row })
            setIsDetailDialogOpen(true)
          }}
        >
          <ViewIcon />
        </IconButton>
      ),
    },
  ]

  const rows =
    data?.pages[currentPageIndex]?.edges?.map(({ node }) => {
      return {
        id: node.id,
        firstName: node.firstName,
        lastName: node.lastName,
        email: node.email,
        phoneNumber: node.phoneNumber,
        role: node.role,
        disabled: node.disabled,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      }
    }) || []

  return (
    <Page>
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
            setSelectedUser({ ...params.row })
            setIsDetailDialogOpen(true)
          }}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
        />
      </Card>

      <AdminUserDetailDialog
        open={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        user={selectedUser}
      />
    </Page>
  )
}
