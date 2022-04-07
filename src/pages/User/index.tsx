import { useState, useEffect } from 'react'
import { Card, Button, IconButton } from '@material-ui/core'
import PageviewIcon from '@material-ui/icons/Pageview'
import qs from 'qs'
import { useLocation } from 'react-router-dom'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridValueFormatterParams,
  GridCellParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  getEqualFilterOperators,
  getContainFilterOperators,
  FieldComparisons,
  FieldKeyOparators,
  /*dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,*/
} from 'utils'
import config from 'config'
import { useQuery } from 'react-query'
import { UserInputRequest } from 'services/web-bff/user.type'
import { UserFilter, User as UserType } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { search } from 'services/web-bff/user'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import DetailDialog from './DetailDialog'

const defaultFilter = {
  role: {
    eq: 'user',
  },
}

export default function User(): JSX.Element {
  const query = qs.parse(useLocation().search, { ignoreQueryPrefix: true })
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [userFilter] = useState<UserFilter>({
    ...defaultFilter,
    ...query,
  })
  const [userFilter2, setUserFilter2] = useState<UserInputRequest>()
  const [userDetail, setUserDetail] = useState<UserType>()
  const [openUserDetailDialog, setOpenUserDetailDialog] = useState<boolean>(false)

  /* const {
     data: userData,
     refetch,
     isFetching,
   } = useUsersFilterAndSort(userFilter, userSort, currentPageIndex, pageSize)*/

  const {
    data: userData,
    refetch,
    isFetching,
  } = useQuery('user-list', () =>
    search({
      data: userFilter2,
      page: currentPageIndex + 1,
      limit: pageSize,
    })
  )

  const equalOperators = getEqualFilterOperators(t)
  const containOperators = getContainFilterOperators(t)
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

  useEffect(() => {
    refetch()
  }, [userFilter, refetch])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('user.id'),
      description: t('user.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: equalOperators,
    },
    {
      field: 'firstName',
      headerName: t('user.firstName'),
      description: t('user.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      filterOperators: containOperators,
    },
    {
      field: 'lastName',
      headerName: t('user.lastName'),
      description: t('user.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      filterOperators: containOperators,
    },
    {
      field: 'email',
      headerName: t('user.email'),
      description: t('user.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      filterOperators: containOperators,
    },
    {
      field: 'phoneNumber',
      headerName: t('user.phone'),
      description: t('user.phone'),
      hide: !visibilityColumns.phoneNumber,
      flex: 1,
      filterOperators: containOperators,
    },
    {
      field: 'kycStatus',
      headerName: t('user.kyc.status'),
      description: t('user.kyc.status'),
      hide: !visibilityColumns.kycStatus,
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams): string => {
        switch (params.value) {
          case 'pending':
            return t('user.kyc.pending')
          case 'verified':
            return t('user.kyc.verified')
          case 'rejected':
            return t('user.kyc.rejected')
          default:
            return '-'
        }
      },
      filterOperators: equalOperators,
      valueOptions: [
        {
          label: t('user.kyc.pending'),
          value: 'pending',
        },
        {
          label: t('user.kyc.verified'),
          value: 'verified',
        },
        {
          label: t('user.kyc.rejected'),
          value: 'rejected',
        },
      ],
    },
    {
      field: 'verifyDate',
      headerName: t('user.verifyDate'),
      description: t('user.verifyDate'),
      hide: !visibilityColumns.verifyDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'note',
      headerName: t('user.note'),
      description: t('user.note'),
      hide: !visibilityColumns.note,
      flex: 1,
      filterable: false,
    },
    {
      field: 'kycRejectReason',
      headerName: t('user.rejectedReason'),
      description: t('user.rejectedReason'),
      hide: !visibilityColumns.kycRejectReason,
      flex: 1,
      filterable: false,
    },
    {
      field: 'userGroups',
      headerName: t('user.userGroups'),
      description: t('user.userGroups'),
      hide: !visibilityColumns.userGroups,
      flex: 1,
      filterOperators: containOperators,
    },
    {
      field: 'createdAt',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      hide: !visibilityColumns.createdAt,
      valueFormatter: columnFormatDate,
      filterOperators: equalOperators,
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      hide: !visibilityColumns.updatedAt,
      valueFormatter: columnFormatDate,
      filterOperators: equalOperators,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: t('car.actions'),
      description: t('car.actions'),
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridCellParams) => (
        <IconButton
          onClick={() => {
            const userDetail: UserType = {
              id: params.row.id,
              firebaseId: params.row.firebaseId,
              firstName: params.row.firstName,
              lastName: params.row.lastName,
              role: params.row.role,
              subscriptions: params.row.subscriptions,
              disabled: params.row.disabled,
              phoneNumber: params.row.phoneNumber,
              email: params.row.email,
              omiseId: params.row.omiseId,
              carTrackId: params.row.carTrackId,
              defaultAddress: params.row.defaultAddress,
              favoriteChargingLocations: params.row.favoriteChargingLocations,
              kycStatus: params.row.kycStatus,
              kycRejectReason: params.row.kycRejectReason,
              createdAt: params.row.createdAt,
              updatedAt: params.row.updatedAt,
              creditCard: params.row.creditCard,
              tokenKyc: params.row.tokenKyc,
              subscriptionsAggregate: params.row.subscriptionsAggregate,
              favoriteChargingLocationsAggregate: params.row.favoriteChargingLocationsAggregate,
              userGroups: params.row.userGroups,
            }
            setUserDetail(userDetail)
            setOpenUserDetailDialog(true)
          }}
        >
          <PageviewIcon />
        </IconButton>
      ),
    },
  ]

  const handleFilterChange = (params: GridFilterModel) => {
    let keyValue = ''
    setUserFilter2({
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
      }, {} as UserInputRequest),
    })
    // reset page
    setCurrentPageIndex(0)
  }

  // setUserDetail

  const users =
    userData?.data.users.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // these fields not support from backend
        verifyDate: null,
        note: '',
        kycRejectReason: user.kycRejectReason,
        userGroups: user.userGroups,
      }
    }) || []

  return (
    <Page>
      <PageToolbar>
        <a href="https://api.sumsub.com/" target="_blank" rel="noreferrer">
          <Button color="primary" variant="contained">
            SumSub
          </Button>
        </a>
      </PageToolbar>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={userData?.data.users.length}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          rows={users}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
          sortingMode="server"
          loading={isFetching}
        />
      </Card>

      <DetailDialog
        open={openUserDetailDialog}
        user={userDetail}
        onClose={() => setOpenUserDetailDialog(false)}
      />
    </Page>
  )
}
