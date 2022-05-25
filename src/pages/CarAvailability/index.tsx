import { useState, useEffect, Fragment } from 'react'
import {
  GridColDef,
  GridPageChangeParams,
  GridFilterModel,
  GridFilterItem,
  GridSortModel,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_FORMAT_BFF,
  getStringFilterOperators,
  getEqualFilterOperators,
  FieldComparisons,
  FieldKeyOparators,
} from 'utils'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { Box, Button, Card } from '@material-ui/core'
import { useQuery } from 'react-query'
import { getAvailableListBFF } from 'services/web-bff/car'
import { CarAvailableListFilterRequest } from 'services/web-bff/car.type'
import DatePicker from 'components/DatePicker'
import PageToolbar from 'layout/PageToolbar'
import { SortDirection, SubOrder } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const initSelectedFromDate = dayjs().tz(config.timezone).startOf('day').toDate()
const initSelectedToDate = dayjs().tz(config.timezone).endOf('day').toDate()

export default function Car(): JSX.Element {
  const { t } = useTranslation()
  const [selectedFromDate, setSelectedFromDate] = useState(initSelectedFromDate)
  const [selectedToDate, setSelectedToDate] = useState(initSelectedToDate)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)

  const generateFilterDates = () => {
    return {
      startDate: dayjs(selectedFromDate).startOf('day').format(DEFAULT_DATE_FORMAT_BFF),
      endDate: dayjs(selectedToDate).endOf('day').format(DEFAULT_DATE_FORMAT_BFF),
    }
  }

  const [sort, setSort] = useState<SubOrder>({})
  const [filter, setFilter] = useState<CarAvailableListFilterRequest>(generateFilterDates())

  const {
    data: carData,
    refetch,
    isFetching,
  } = useQuery('availability-cars', () =>
    getAvailableListBFF({
      filter,
      sort,
      page,
      size: pageSize,
    })
  )

  useEffect(() => {
    refetch()
  }, [filter, page, pageSize, refetch])

  const equalFilterOperators = getEqualFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const visibilityColumns = getVisibilityColumns()

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setFilter(
      params.items.reduce((filterItem, { columnField, operatorValue, value }: GridFilterItem) => {
        const isId = columnField === 'id'

        let keyOfValue = ''
        if (value) {
          if (isId) {
            keyOfValue = 'carId'
          } else {
            switch (operatorValue) {
              case FieldComparisons.equals:
                keyOfValue = `${columnField}${FieldKeyOparators.equals}`
                break
              case FieldComparisons.contains:
                keyOfValue = `${columnField}${FieldKeyOparators.contains}`
                break
            }
          }
          filterItem = { [keyOfValue]: value }
        }
        filterItem = {
          ...filterItem,
          ...generateFilterDates(),
        }
        return filterItem
      }, {} as CarAvailableListFilterRequest)
    )
    setPage(0)
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
    setFilter({
      ...filter,
      ...generateFilterDates(),
    })
  }

  const rowCount = carData?.data?.pagination?.totalRecords ?? 0
  const rows =
    carData?.data.records.map(({ car, availabilityStatus: status, subscriptions }) => {
      return {
        id: car.id,
        vin: car.vin,
        plateNumber: car.plateNumber,
        model: car.carSku?.carModel.name || '-',
        brand: car.carSku?.carModel.brand.name || '-',
        color: car.carSku?.color || '-',
        status,
        subscriptionId:
          subscriptions.length < 1 ? '-' : subscriptions.map((subscription) => subscription.id),
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('car.id'),
      description: t('car.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterOperators: equalFilterOperators,
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
      field: 'model',
      headerName: t('car.model'),
      description: t('car.model'),
      hide: !visibilityColumns.model,
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
          page={page}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setPage}
          rows={rows}
          columns={columns}
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
