/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Card, Grid, Typography, TextField, Autocomplete, Button } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  GridColDef,
  GridPageChangeParams,
  GridFilterModel,
  GridFilterItem,
  GridSortModel,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import {
  columnFormatDate,
  getSelectEqualFilterOperators,
  getEqualAndContainFilterOperators,
  FieldComparisons,
  FieldKeyOparators,
} from 'utils'
import config from 'config'
import { SortDirection, SubOrder } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import { getList } from 'services/web-bff/car'
import { CarListFilterRequest } from 'services/web-bff/car.type'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import {
  getCarStatusOnlyUsedInBackendOptions,
  columnFormatCarStatus,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
  CarStatus,
  SelectOption,
} from './utils'

const useStyles = makeStyles(() => ({
  typo: {
    marginBottom: '0px',
  },
  gridTitle: {
    padding: '20px',
    paddingBottom: 0,
  },
  gridSearch: {
    padding: '20px',
  },
  gridExport: {
    textAlign: 'right',
  },
  exportButton: {
    background: '#333c4d',
    color: '#fff',
    height: '56px',
  },
  table: {
    border: 0,
  },
  pagination: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  paginationForm: {
    display: 'inline-flex',
  },
  chipBgGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
    height: '24px',
  },
  chipBgPrimary: {
    backgroundColor: '#4584FF',
    color: 'white',
    height: '24px',
  },
  wrapText: {
    lineHeight: '1.5em',
    height: '3em',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  csvlink: {
    color: '#fff',
    textDecoration: 'none',
  },
}))

export default function Car(): JSX.Element {
  const classes = useStyles()
  const { t } = useTranslation()
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.carManagement.car'),
      link: '/car',
    },
  ]

  const {
    data: carData,
    refetch,
    isFetching,
  } = useQuery('cars', () =>
    getList({
      filter,
      sort,
      page,
      size: pageSize,
    })
  )

  // search
  const searchOptions: SelectOption[] = [
    {
      label: t('car.color'),
      value: 'colorContain',
    },
    {
      label: t('car.vin'),
      value: 'vinContain',
    },
    {
      label: t('car.plateNumber'),
      value: 'plateNumberContain',
    },
    {
      label: t('car.status'),
      value: 'statusEqual',
    },
  ]
  const [searchValue, setSearchValue] = useState<string>()
  const [selectedSearch, setSelectedSearch] = useState<SelectOption | null>()
  const [selectedStatus, setSelectedStatus] = useState<SelectOption | null>()
  const defaultSelect = {
    label: t('all'),
    value: 'all',
  }
  // eslint-disable-next-line
  const onSearchChange = (event: any, value?: string) => {
    const { value: eventVal } = event.target
    const searchText = value ? value : eventVal
    setSearchValue(searchText)
  }

  // export
  const csvHeaders = [
    { label: t('car.carTrackId'), key: 'carTrackId' },
    { label: t('car.brand'), key: 'brand' },
    { label: t('car.model'), key: 'model' },
    { label: t('car.color'), key: 'color' },
    { label: t('car.plateNumber'), key: 'plateNumber' },
    { label: t('car.vin'), key: 'vin' },
    { label: t('car.status'), key: 'status' },
    { label: t('car.createdDate'), key: 'createdDate' },
    { label: t('car.updatedDate'), key: 'updatedDate' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  carData?.data.cars.forEach((car) => {
    const data = {
      carTrackId: car.carTrackId,
      brand: car.carSku.carModel.brand.name,
      model: car.carSku.carModel.name,
      color: car.carSku.color,
      plateNumber: car.plateNumber,
      vin: car.vin,
      status: car.isActive ? CarStatus.PUBLISHED : CarStatus.OUT_OF_SERVICE,
      createdDate: car.createdDate,
      updatedDate: car.updatedDate,
    }
    csvData.push(data)
  })

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<SubOrder>({})
  const [filter, setFilter] = useState<CarListFilterRequest>()

  const equalAndContainOperators = getEqualAndContainFilterOperators(t)
  const selectFilterOperators = getSelectEqualFilterOperators(t)
  const statusOptions = getCarStatusOnlyUsedInBackendOptions(t)
  const visibilityColumns = getVisibilityColumns()

  useEffect(() => {
    refetch()
  }, [page, pageSize, filter, refetch])

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPage(0)
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setFilter(
      params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        const isStatus = columnField === 'status'

        let keyOfValue = ''
        if (value) {
          if (isStatus) {
            keyOfValue = 'isActive'
            value = value === CarStatus.PUBLISHED
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
          filter = { [keyOfValue]: value }
        }
        return filter
      }, {} as CarListFilterRequest)
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
    }
  }

  const rowCount = carData?.data?.pagination?.totalRecords ?? 0
  const rows =
    carData?.data?.cars?.map((car) => {
      const connectorType =
        car?.carSku?.carModel?.chargers?.map((charger) => charger.description) || '-'

      return {
        id: car?.id,
        carTrackId: car?.carTrackId,
        vin: car?.vin,
        plateNumber: car?.plateNumber,
        model: car?.carSku?.carModel.name,
        brand: car?.carSku?.carModel.brand.name,
        color: car?.carSku?.color,
        bodyType: car?.carSku?.carModel.bodyType,
        totalPower: car?.carSku?.carModel.totalPower,
        batteryCapacity: car?.carSku?.carModel.batteryCapacity,
        topSpeed: car?.carSku?.carModel.topSpeed,
        range: car?.carSku?.carModel.range,
        acceleration: car?.carSku?.carModel.acceleration,
        chargeTime: car?.carSku?.carModel.chargeTime,
        fastChargeTime: car?.carSku?.carModel.fastChargeTime,
        connectorType: connectorType.length > 0 ? connectorType : '-',
        status: car?.isActive ? CarStatus.PUBLISHED : CarStatus.OUT_OF_SERVICE,
        createdDate: car?.createdDate,
        updatedDate: car?.updatedDate,
      }
    }) ?? []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('car.id'),
      description: t('car.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterable: false,
    },
    {
      field: 'carTrackId',
      headerName: t('car.carTrackId'),
      description: t('car.carTrackId'),
      hide: !visibilityColumns.carTrackId,
      flex: 1,
      filterable: false,
    },
    {
      field: 'brand',
      headerName: t('car.brand'),
      description: t('car.brand'),
      hide: !visibilityColumns.brand,
      flex: 1,
      filterable: false,
    },
    {
      field: 'model',
      headerName: t('car.model'),
      description: t('car.model'),
      hide: !visibilityColumns.model,
      flex: 1,
      filterable: false,
    },
    {
      field: 'color',
      headerName: t('car.color'),
      description: t('car.color'),
      filterOperators: equalAndContainOperators,
      hide: !visibilityColumns.color,
      flex: 1,
    },
    {
      field: 'vin',
      headerName: t('car.vin'),
      description: t('car.vin'),
      filterOperators: equalAndContainOperators,
      flex: 1,
      hide: !visibilityColumns.vin,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('car.plateNumber'),
      description: t('car.plateNumber'),
      hide: !visibilityColumns.plateNumber,
      flex: 1,
      filterOperators: equalAndContainOperators,
      sortable: false,
    },
    {
      field: 'bodyType',
      headerName: t('car.bodyType'),
      description: t('car.bodyType'),
      hide: !visibilityColumns.bodyType,
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'totalPower',
      headerName: t('car.totalPower'),
      description: t('car.totalPower'),
      hide: !visibilityColumns.totalPower,
      flex: 1,
      filterable: false,
    },
    {
      field: 'batteryCapacity',
      headerName: t('car.batteryCapacity'),
      description: t('car.batteryCapacity'),
      hide: !visibilityColumns.batteryCapacity,
      flex: 1,
      filterable: false,
    },
    {
      field: 'createdDate',
      headerName: t('car.createdDate'),
      description: t('car.createdDate'),
      hide: !visibilityColumns.createdDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'updatedDate',
      headerName: t('car.updatedDate'),
      description: t('car.updatedDate'),
      hide: !visibilityColumns.updatedDate,
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'topSpeed',
      headerName: t('car.topSpeed'),
      description: t('car.topSpeed'),
      hide: !visibilityColumns.topSpeed,
      flex: 1,
      filterable: false,
    },
    {
      field: 'acceleration',
      headerName: t('car.acceleration'),
      description: t('car.acceleration'),
      hide: !visibilityColumns.acceleration,
      flex: 1,
      filterable: false,
    },
    {
      field: 'range',
      headerName: t('car.range'),
      description: t('car.range'),
      hide: !visibilityColumns.range,
      flex: 1,
      filterable: false,
    },
    {
      field: 'connectorType',
      headerName: t('car.connectorType'),
      description: t('car.connectorType'),
      hide: !visibilityColumns.connectorType,
      flex: 1,
      filterable: false,
    },
    {
      field: 'chargeTime',
      headerName: t('car.chargeTime'),
      description: t('car.chargeTime'),
      hide: !visibilityColumns.chargeTime,
      flex: 1,
      filterable: false,
    },
    {
      field: 'fastChargeTime',
      headerName: t('car.fastChargeTime'),
      description: t('car.fastChargeTime'),
      hide: !visibilityColumns.fastChargeTime,
      flex: 1,
      filterable: false,
    },
    {
      field: 'status',
      flex: 1,
      headerName: t('car.status'),
      description: t('car.status'),
      hide: !visibilityColumns.status,
      filterOperators: selectFilterOperators,
      valueFormatter: (params: GridValueFormatterParams) =>
        columnFormatCarStatus(params.value as string, t),
      valueOptions: statusOptions,
      filterable: true,
      sortable: false,
    },
  ]

  return (
    <Page>
      <PageTitle title="Car Management" breadcrumbs={breadcrumbs} />
      <Card>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6" className={classes.typo}>
            <strong>Car List</strong>
          </Typography>
        </Grid>
        <Grid className={classes.gridSearch} container spacing={3}>
          <Grid item xs={9} sm={3}>
            <Autocomplete
              autoHighlight
              id="search-select-list"
              options={searchOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="Select Search"
                    variant="outlined"
                    placeholder={t('all')}
                  />
                )
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === 'all'
              }
              value={selectedSearch || defaultSelect}
              defaultValue={selectedSearch || defaultSelect}
              onChange={(_e, value) => {
                setSelectedSearch(value)
                setSearchValue('')
              }}
            />
          </Grid>
          <Grid item xs={9} sm={3}>
            {selectedSearch?.value === 'statusEqual' ? (
              <Autocomplete
                autoHighlight
                id="status-select-list"
                options={statusOptions}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => {
                  return <TextField {...params} label="Select Status" variant="outlined" />
                }}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value || value.value === ''
                }
                value={selectedStatus || null}
                onChange={(event, item) => {
                  setSelectedStatus(item)
                  onSearchChange(event, item?.value)
                }}
              />
            ) : (
              <TextField
                type="text"
                label="Search"
                variant="outlined"
                fullWidth
                value={searchValue || ''}
                onChange={onSearchChange}
                disabled={
                  !selectedSearch || selectedSearch?.value === 'all' || selectedSearch?.value === ''
                }
              />
            )}
          </Grid>
          <Grid item xs={9} sm={3} />
          <Grid item xs={9} sm={3} className={classes.gridExport}>
            <Button variant="contained" className={classes.exportButton} size="large">
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={t('sidebar.carManagement.car') + '.csv'}
                className={classes.csvlink}
              >
                {t('button.export')}
              </CSVLink>
            </Button>
          </Grid>
        </Grid>

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
