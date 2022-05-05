import { useState, useEffect } from 'react'
import { Button, Card, Chip, IconButton } from '@material-ui/core'
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
import { useQuery } from 'react-query'
import PageToolbar from 'layout/PageToolbar'
import { User, UserFilter } from 'services/evme.types'
import { getAdminUsers } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import AdminUserDetailDialog from './AdminUserDetailDialog'
import AdminUserCreateDialog from './AdminUserCreateDialog'

export default function AdminUsers(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const { t } = useTranslation()
  const { firebaseUser } = useAuth()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({})

  const { data: adminUsersData, refetch } = useQuery('cars', () => getAdminUsers())

  const defaultFilter = {
    role: {
      in: [ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
    },
    firebaseId: { neq: firebaseUser?.uid },
  }

  const [userFilter, setUserFilter] = useState<UserFilter>({ ...defaultFilter })

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
      field: 'firebaseUId',
      headerName: 'Firebase UID',
      description: 'Firebase UID',
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
      field: 'role',
      headerName: t('user.role'),
      description: t('user.role'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams): string => {
        const role = String(params.value).toLocaleLowerCase()
        switch (role) {
          case ROLES.SUPER_ADMIN:
            return t('role.superAdmin')
          case ROLES.ADMIN:
            return t('role.admin')
          case ROLES.CUSTOMER_SUPPORT:
            return t('role.customerSupport')
          case ROLES.OPERATION:
            return t('role.operation')
          case ROLES.MARKETING:
            return t('role.marketing')
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
      field: 'isActive',
      headerName: t('user.status'),
      description: t('user.status'),
      filterOperators: booleanFilterOperators,
      flex: 1,
      renderCell: (params: GridCellParams) =>
        !params.value ? (
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
      field: 'createdDate',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'updatedDate',
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

  const rowCount = adminUsersData?.data.adminUsers?.length ?? 0
  const rows = adminUsersData?.data.adminUsers ?? []

  return (
    <Page>
      <PageToolbar>
        <Button color="primary" variant="contained" onClick={() => setIsCreateDialogOpen(true)}>
          Create new
        </Button>
      </PageToolbar>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          // onFetchNextPage={fetchNextPage}
          // onFetchPreviousPage={fetchPreviousPage}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
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

      <AdminUserCreateDialog
        accessToken={accessToken}
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Page>
  )
}
