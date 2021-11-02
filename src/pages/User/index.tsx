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
import { useUsersFilterAndSort } from 'services/evme'
import { UserFilter, SortDirection, SubOrder } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import PageToolbar from 'layout/PageToolbar'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

const defaultFilter = {
  role: {
    eq: 'user',
  },
}

export default function User(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [userFilter, setUserFilter] = useState<UserFilter>({
    ...defaultFilter,
  })
  const [userSort, setUserSort] = useState<SubOrder>({})

  const {
    data: userData,
    refetch,
    isFetching,
  } = useUsersFilterAndSort(userFilter, userSort, currentPageIndex, pageSize)

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

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

      setUserSort(order)
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
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: idFilterOperators,
    },
    {
      field: 'firstName',
      headerName: t('user.firstName'),
      description: t('user.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'lastName',
      headerName: t('user.lastName'),
      description: t('user.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'email',
      headerName: t('user.email'),
      description: t('user.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'phoneNumber',
      headerName: t('user.phone'),
      description: t('user.phone'),
      hide: !visibilityColumns.phoneNumber,
      flex: 1,
      filterOperators: stringFilterOperators,
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
      field: 'rejectedReason',
      headerName: t('user.rejectedReason'),
      description: t('user.rejectedReason'),
      hide: !visibilityColumns.rejectedReason,
      flex: 1,
      filterable: false,
    },
    {
      field: 'userGroups',
      headerName: t('user.userGroups'),
      description: t('user.userGroups'),
      hide: !visibilityColumns.userGroups,
      flex: 1,
      filterOperators: stringFilterOperators,
    },
    {
      field: 'createdAt',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      hide: !visibilityColumns.createdAt,
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
    {
      field: 'updatedAt',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      hide: !visibilityColumns.updatedAt,
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
    },
  ]

  const users =
    userData?.data.map((user) => {
      const userGroups =
        user.userGroups.length > 0
          ? user.userGroups.map((userGroup) => userGroup.name).join(',')
          : '-'

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
        rejectedReason: '',
        userGroups,
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
          rowCount={userData?.totalData}
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
          onSortModelChange={handleSortChange}
          loading={isFetching}
        />
      </Card>
    </Page>
  )
}
