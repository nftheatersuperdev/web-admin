import { useState, useEffect } from 'react'
import { Card, Button } from '@material-ui/core'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridValueFormatterParams,
  GridSortModel,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  getIdFilterOperators,
  getStringFilterOperators,
  getDateFilterOperators,
  getSelectFilterOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,
} from 'utils'
import config from 'config'
import { useUsers } from 'services/evme'
import { UserFilter, SortDirection, UserSortFields, UserSort } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'

const defaultFilter = {
  role: {
    eq: 'user',
  },
}

export default function User(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [userSort, setUserSort] = useState<UserSort>({
    field: UserSortFields.CreatedAt,
    direction: SortDirection.Asc,
  })

  const [userFilter, setUserFilter] = useState<UserFilter>({
    ...defaultFilter,
  })

  const { data, refetch, fetchNextPage, fetchPreviousPage, isFetching } = useUsers(
    pageSize,
    userFilter,
    [userSort]
  )

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setUserFilter({
      ...defaultFilter,
      ...params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        let filterValue = value

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

  const handleSortChange = (params: GridSortModel) => {
    if (params?.length > 0 && !isFetching) {
      const { field: refField, sort } = params[0]
      const direction = sort?.toLocaleLowerCase() === 'asc' ? SortDirection.Asc : SortDirection.Desc
      let field

      switch (refField) {
        case 'firstName':
          field = UserSortFields.FirstName
          break
        case 'lastName':
          field = UserSortFields.LastName
          break
        case 'email':
          field = UserSortFields.Email
          break
        case 'phoneNumber':
          field = UserSortFields.PhoneNumber
          break
        case 'kycStatus':
          field = UserSortFields.KycStatus
          break
        case 'updatedAt':
          field = UserSortFields.UpdatedAt
          break
        default:
          field = UserSortFields.CreatedAt
          break
      }

      setUserSort({
        field,
        direction,
      })
      refetch()
    }
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
      field: 'createdAt',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
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
      field: 'kycStatus',
      headerName: t('user.kyc.status'),
      description: t('user.kyc.status'),
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
      filterOperators: selectFilterOperators,
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
      field: 'updatedAt',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'verifyDate',
      headerName: t('user.verifyDate'),
      description: t('user.verifyDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'note',
      headerName: t('user.note'),
      description: t('user.note'),
      flex: 1,
      hide: true,
      filterable: false,
    },
    {
      field: 'rejectedReason',
      headerName: t('user.rejectedReason'),
      description: t('user.rejectedReason'),
      flex: 1,
      hide: true,
      filterable: false,
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
        kycStatus: node.kycStatus,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        // these fields not support from backend
        verifyDate: null,
        note: '',
        rejectedReason: '',
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
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          sortingMode="server"
          onSortModelChange={handleSortChange}
          loading={isFetching}
        />
      </Card>
    </Page>
  )
}
