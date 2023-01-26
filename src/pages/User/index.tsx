import { useState, useEffect } from 'react'
import { Card, Button, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
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
  geEqualtDateTimeOperators,
  getSelectEqualFilterOperators,
  FieldComparisons,
  // FieldKeyOparators,
  /*dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,*/
} from 'utils'
import config from 'config'
import { useQuery } from 'react-query'
import { useLocation } from 'react-router-dom'
import { User as UserType, UserInputRequest } from 'services/web-bff/user.type'
import { CustomerInputRequest, CustomerMeProps } from 'services/web-bff/customer.type'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { searchCustomer } from 'services/web-bff/customer'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import DetailDialog from './DetailDialog'

export default function User(): JSX.Element {
  const { t } = useTranslation()
  const searchParams = useLocation().search
  const queryString = new URLSearchParams(searchParams)
  const kycStatus = queryString.get('kycStatus')

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const defaultFilter: UserInputRequest = {
    kycStatusEqual: kycStatus || null,
  } as UserInputRequest
  const [userFilter, setUserFilter] = useState<UserInputRequest>({ ...defaultFilter })
  const [userDetail, setUserDetail] = useState<UserType>()
  const [openUserDetailDialog, setOpenUserDetailDialog] = useState<boolean>(false)

  const {
    data: userData,
    refetch,
    isFetching,
  } = useQuery('customer-list', () =>
    searchCustomer({
      data: userFilter,
      page: currentPageIndex + 1,
      size: pageSize,
    } as CustomerMeProps)
  )

  const equalOperators = getEqualFilterOperators(t)
  const containOperators = getContainFilterOperators(t)
  const dateEqualOperators = geEqualtDateTimeOperators(t)
  const visibilityColumns = getVisibilityColumns()
  const equalSelectFilterOperators = getSelectEqualFilterOperators(t)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setCurrentPageIndex(0)
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
  }, [userFilter, refetch, currentPageIndex])

  useEffect(() => {
    refetch()
  }, [refetch, pageSize])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('user.id'),
      description: t('user.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      sortable: false,
      filterOperators: equalOperators,
    },
    {
      field: 'firstName',
      headerName: t('user.firstName'),
      description: t('user.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
    },
    {
      field: 'lastname',
      headerName: t('user.lastName'),
      description: t('user.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
    },
    {
      field: 'email',
      headerName: t('user.email'),
      description: t('user.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
    },
    {
      field: 'phoneNumber',
      headerName: t('user.phone'),
      description: t('user.phone'),
      hide: !visibilityColumns.phoneNumber,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
    },
    {
      field: 'isActive',
      headerName: t('user.status'),
      description: t('user.status'),
      hide: !visibilityColumns.isActive,
      flex: 1,
      sortable: false,
      filterOperators: equalSelectFilterOperators,
      valueOptions: [
        {
          label: t('user.statuses.active'),
          value: 'active',
        },
        {
          label: t('user.statuses.deleted'),
          value: 'deleted',
        },
      ],
      valueFormatter: (params: GridValueFormatterParams): string => {
        switch (params.value) {
          case true:
            return t('user.statuses.active')
          case false:
            return t('user.statuses.deleted')
          default:
            return '-'
        }
      },
    },
    {
      field: 'kycStatus',
      headerName: t('user.kyc.status'),
      description: t('user.kyc.status'),
      hide: !visibilityColumns.kycStatus,
      flex: 1,
      sortable: false,
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
      filterOperators: equalSelectFilterOperators,
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
      sortable: false,
      filterable: false,
    },
    {
      field: 'note',
      headerName: t('user.note'),
      description: t('user.note'),
      hide: !visibilityColumns.note,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'kycReason',
      headerName: t('user.rejectedReason'),
      description: t('user.rejectedReason'),
      hide: !visibilityColumns.kycReason,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'userGroups',
      headerName: t('user.userGroups'),
      description: t('user.userGroups'),
      hide: !visibilityColumns.userGroups,
      flex: 1,
      sortable: false,
      filterOperators: containOperators,
    },
    {
      field: 'createdDate',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      hide: !visibilityColumns.createdDate,
      valueFormatter: columnFormatDate,
      filterOperators: dateEqualOperators,
      flex: 1,
      sortable: false,
    },
    {
      field: 'updatedDate',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      hide: !visibilityColumns.updatedDate,
      valueFormatter: columnFormatDate,
      filterOperators: dateEqualOperators,
      flex: 1,
      sortable: false,
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
              disabled: params.row.disabled,
              phoneNumber: params.row.phoneNumber,
              email: params.row.email,
              omiseId: params.row.omiseId,
              carTrackId: params.row.carTrackId,
              defaultAddress: params.row.defaultAddress,
              kycStatus: params.row.kycStatus,
              kycReason: params.row.kycReason,
              isActive: params.row.isActive,
              createdDate: params.row.createdDate,
              updatedDate: params.row.updatedDate,
              creditCard: params.row.creditCard,
              userGroups: params.row.userGroups,
              locale: params.row.locale,
            }
            setUserDetail(userDetail)
            setOpenUserDetailDialog(true)
          }}
        >
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ]

  const handleFilterChange = (params: GridFilterModel) => {
    let keyValue = ''
    setUserFilter({
      ...params.items.reduce((filter, { columnField, value, operatorValue }: GridFilterItem) => {
        if (columnField === 'isActive' && !value) {
          filter = {}
          return filter
        } else if (columnField === 'isActive') {
          filter = { isActive: value === 'active' }
          return filter
        }
        if (columnField === 'userGroups') {
          filter = { customerGroupName: value }
          return filter
        }
        if (value) {
          switch (operatorValue) {
            case FieldComparisons.equals:
              // keyValue = `${columnField}${FieldKeyOparators.equals}`
              keyValue = `${columnField}`
              break
            case FieldComparisons.contains:
              // keyValue = `${columnField}${FieldKeyOparators.contains}`
              keyValue = `${columnField}`
              break
          }
          filter = { [keyValue]: value }
        }
        return filter
      }, {} as CustomerInputRequest),
    })
    // reset page
    setCurrentPageIndex(0)
  }

  const users =
    userData?.data.customers.map((customer) => {
      return {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        kycStatus: customer.kycStatus,
        isActive: customer.isActive,
        createdDate: customer.createdDate,
        updatedDate: customer.updatedDate,
        // these fields not support from backend
        verifyDate: null,
        note: '',
        kycReason: customer.kycReason,
        userGroups: customer.customerGroups,
      }
    }) || []

  const handleFetchPage = (pageNumber: number) => {
    setCurrentPageIndex(pageNumber)
  }

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
          rowCount={userData?.data.pagination?.totalRecords}
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
          loading={isFetching}
          onFetchNextPage={() => handleFetchPage(currentPageIndex + 1)}
          onFetchPreviousPage={() => handleFetchPage(currentPageIndex - 1)}
        />
      </Card>

      <DetailDialog
        open={openUserDetailDialog}
        user={userDetail}
        onClose={(needRefetch) => {
          if (needRefetch) {
            refetch()
          }
          setOpenUserDetailDialog(false)
        }}
      />
    </Page>
  )
}
