import { useState, useEffect, Fragment } from 'react'
import {
  GridColDef,
  GridPageChangeParams,
  GridFilterModel,
  GridFilterItem,
  GridSortModel,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATE_FORMAT, getStringFilterOperators, stringToFilterContains } from 'utils'
import config from 'config'
import dayjs from 'dayjs'
import { Box, Button, Card } from '@material-ui/core'
import { flow, get, last, sortBy } from 'lodash/fp'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { getList } from 'services/web-bff/car'
import { CarListQuery } from 'services/web-bff/car.type'
import DatePicker from 'components/DatePicker'
import PageToolbar from 'layout/PageToolbar'
import { SortDirection, SubOrder } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import { CarStatus, getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

const initSelectedFromDate = dayjs(new Date()).startOf('day').toDate()
const initSelectedToDate = dayjs(new Date()).endOf('day').toDate()

export default function Car(): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const { t } = useTranslation()
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [selectedToDate, setSelectedToDate] = useState(initSelectedToDate)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const defaultQuery = {
    status: {
      eq: CarStatus.AVAILABLE,
    },
  }

  const [sort, setSort] = useState<SubOrder>({})
  const [query, setQuery] = useState<CarListQuery>({
    ...defaultQuery,
  })

  const {
    data: cars,
    refetch,
    isFetching,
  } = useQuery('availability-cars', () => getList({ accessToken, query, sort }))

  useEffect(() => {
    refetch()
  }, [query, refetch])

  const stringFilterOperators = getStringFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setQuery(
      params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
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

        return { ...filter, ...defaultQuery }
      }, {} as CarListQuery)
    )
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

      setSort(order)
      refetch()
    }
  }

  const handleClickSearchButton = () => {
    setQuery({
      ...query,
      subscription: {
        startDate: dayjs(selectedFromDate).startOf('day').toDate(),
        endDate: dayjs(selectedToDate).endOf('day').toDate(),
      },
    })
  }

  const rowCount = cars?.data.pagination.totalRecords
  const rows =
    cars?.data.cars.map((car) => {
      const isAvailable = car.status === 'available'
      const status = isAvailable ? t('carAvailability.available') : t('carAvailability.inUse')
      const subscriptionId = isAvailable
        ? '-'
        : flow(sortBy('createdAt'), last, get('id'))(car.subscriptions)

      return {
        ...car,
        status,
        subscriptionId,
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('car.id'),
      description: t('car.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('car.plateNumber'),
      description: t('car.plateNumber'),
      hide: !visibilityColumns.plateNumber,
      flex: 1,
      filterOperators: stringFilterOperators,
      sortable: false,
    },
    {
      field: 'vin',
      headerName: t('car.vin'),
      description: t('car.vin'),
      filterable: false,
      flex: 1,
      hide: !visibilityColumns.vin,
      sortable: false,
    },
    {
      field: 'brand',
      headerName: t('car.brand'),
      description: t('car.brand'),
      hide: !visibilityColumns.brand,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'name',
      headerName: t('car.model'),
      description: t('car.model'),
      hide: !visibilityColumns.name,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'color',
      headerName: t('car.color'),
      description: t('car.color'),
      filterable: false,
      sortable: false,
      hide: !visibilityColumns.color,
      flex: 1,
    },
    {
      field: 'status',
      headerName: t('car.status'),
      description: t('car.status'),
      filterable: false,
      hide: false,
      flex: 1,
    },
    {
      field: 'subscriptionId',
      headerName: t('car.subscriptionId'),
      description: t('car.subscriptionId'),
      filterable: false,
      sortable: false,
      hide: false,
      flex: 1,
    },
  ]

  return (
    <Page>
      <PageToolbar>
        <Fragment>
          <DatePicker
            label={t('carAvailability.selectedFromDate')}
            id="selectedFromDate"
            name="selectedFromDate"
            format={DEFAULT_DATE_FORMAT}
            value={selectedFromDate}
            onChange={(date) => {
              date && setSelectedFromDate(date.toDate())
            }}
          />
          <DatePicker
            label={t('carAvailability.selectedToDate')}
            id="selectedToDate"
            name="selectedToDate"
            format={DEFAULT_DATE_FORMAT}
            value={selectedToDate}
            onChange={(date) => {
              date && setSelectedToDate(date.toDate())
            }}
          />
          <Box display="flex" alignItems="center">
            <Button color="primary" variant="contained" onClick={handleClickSearchButton}>
              {t('carAvailability.search')}
            </Button>
          </Box>
        </Fragment>
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
          onPageChange={setCurrentPageIndex}
          rows={rows}
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
