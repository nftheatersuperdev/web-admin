import { useState, useEffect } from 'react'
import { Card, Button } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import toast from 'react-hot-toast'
import {
  GridColDef,
  GridFilterItem,
  GridFilterModel,
  GridPageChangeParams,
  GridRowData,
  GridValueFormatterParams,
  GridSortModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import {
  columnFormatDate,
  columnFormatMoney,
  renderEmailLink,
  getIdFilterOperators,
  getStringFilterOperators,
  getNumericFilterOperators,
  getDateFilterOperators,
  getSelectFilterOperators,
  dateToFilterOnDay,
  dateToFilterNotOnDay,
  stringToFilterContains,
} from 'utils'
import config from 'config'
import PageToolbar from 'layout/PageToolbar'
import DataGridLocale from 'components/DataGridLocale'
import { useSendDataViaEmail, useSubscriptionsFilterAndSort } from 'services/evme'
import { SubFilter, SubOrder, SortDirection } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import { columnFormatDuration, getDurationOptions } from 'pages/Pricing/utils'
import UpdateDialog from './UpdateDialog'
import SendDataDialog from './SendDataDialog'
import {
  columnFormatSubEventStatus,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
  getSubEventStatusOptions,
} from './utils'

export default function Subscription(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [isUpdateDialogOpen, setUpdateDialogOpen] = useState(false)
  const [isSendDataDialogOpen, setSendDataDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState()
  const [subFilter, setSubFilter] = useState<SubFilter>({})
  const [subSort, setSubSort] = useState<SubOrder>({})
  const sendDataViaEmail = useSendDataViaEmail()

  const {
    data: subscriptionsData,
    refetch,
    isFetching,
  } = useSubscriptionsFilterAndSort(subFilter, subSort, currentPageIndex, pageSize)

  const idFilterOperators = getIdFilterOperators(t)
  const stringFilterOperators = getStringFilterOperators(t)
  const numericFilterOperators = getNumericFilterOperators(t)
  const dateFilterOperators = getDateFilterOperators(t)
  const selectFilterOperators = getSelectFilterOperators(t)
  const durationOptions = getDurationOptions(t)
  const statusOptions = getSubEventStatusOptions(t)
  const visibilityColumns = getVisibilityColumns()

  const customToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
    </GridToolbarContainer>
  )

  const handleRowClick = (data: GridRowData) => {
    setUpdateDialogOpen(true)
    setSelectedSubscription(data.row)
  }

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleFilterChange = (params: GridFilterModel) => {
    setSubFilter(
      params.items.reduce((filter, { columnField, operatorValue, value }: GridFilterItem) => {
        if (
          (columnField === 'carModelId' ||
            columnField === 'plateNumber' ||
            columnField === 'vin') &&
          value
        ) {
          filter.car = {
            [columnField]: {
              [operatorValue as string]:
                operatorValue === 'iLike' ? stringToFilterContains(value) : value,
            },
          }
        }

        if ((columnField === 'price' || columnField === 'duration') && value) {
          filter.packagePrice = {
            [columnField]: {
              [operatorValue as string]: columnField === 'price' ? +value : value,
            },
          }
        }

        if (
          (columnField === 'email' ||
            columnField === 'phoneNumber' ||
            columnField === 'firstName' ||
            columnField === 'lastName') &&
          value
        ) {
          filter.user = {
            [columnField]: {
              [operatorValue as string]:
                operatorValue === 'iLike' ? stringToFilterContains(value) : value,
            },
          }
        }

        if (columnField === 'status' && value) {
          filter.events = {
            [columnField]: {
              [operatorValue as string]: value,
            },
          }
        }

        if ((columnField === 'startDate' || columnField === 'endDate') && value) {
          filter[columnField] = {
            [operatorValue as string]:
              operatorValue === 'between' ? dateToFilterOnDay(value) : dateToFilterNotOnDay(value),
          }
        }

        return filter
      }, {} as SubFilter)
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

      setSubSort(order)
      refetch()
    }
  }

  const handleOnSubmitSend = async (emails: string[]) => {
    const exportColumns = Object.keys(visibilityColumns).filter((key) => visibilityColumns[key])

    if (emails?.length > 0) {
      await toast.promise(
        sendDataViaEmail.mutateAsync({
          emails,
          columns: exportColumns,
        }),
        {
          loading: t('toast.loading'),
          success: t('subscription.sendAllData.success'),
          error: t('subscription.sendAllData.error'),
        }
      )
    }
    setSendDataDialogOpen(false)
  }

  useEffect(() => {
    refetch()
  }, [subFilter, refetch])

  const subscriptions =
    subscriptionsData?.data.map((subscription) => {
      const status =
        subscription.events?.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]?.status || '-'

      return {
        id: subscription.id,
        vin: subscription.car?.vin,
        plateNumber: subscription.car?.plateNumber,
        brand: subscription.car?.carModel?.brand,
        model: subscription.car?.carModel?.model,
        price: subscription.packagePrice?.price,
        duration: subscription.packagePrice?.duration,
        seats: subscription.car?.carModel?.seats,
        topSpeed: subscription.car?.carModel?.topSpeed,
        fastChargeTime: subscription.car?.carModel?.fastChargeTime,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        startAddress: subscription.startAddress?.full,
        startLat: subscription.startAddress?.latitude,
        startLng: subscription.startAddress?.longitude,
        startAddressRemark: subscription.startAddress?.remark,
        endAddress: subscription.endAddress?.full,
        endLat: subscription.endAddress?.latitude,
        endLng: subscription.endAddress?.longitude,
        endAddressRemark: subscription.endAddress?.remark,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
        email: subscription.user.email,
        phoneNumber: subscription.user.phoneNumber,
        firstName: subscription.user.firstName,
        lastName: subscription.user.lastName,
        status,
        // not shown in table
        color: subscription.car?.color,
        carModelId: subscription.car?.carModel?.id,
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('subscription.id'),
      description: t('subscription.id'),
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.id,
      sortable: false,
      filterable: false,
    },
    {
      field: 'firstName',
      headerName: t('subscription.firstName'),
      description: t('subscription.firstName'),
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.firstName,
      sortable: false,
    },
    {
      field: 'lastName',
      headerName: t('subscription.lastName'),
      description: t('subscription.lastName'),
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.lastName,
      sortable: false,
    },
    {
      field: 'email',
      headerName: t('subscription.email'),
      description: t('subscription.email'),
      renderCell: renderEmailLink,
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.email,
      sortable: false,
    },
    {
      field: 'phoneNumber',
      headerName: t('subscription.phone'),
      description: t('subscription.phone'),
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.phoneNumber,
      sortable: false,
    },
    {
      field: 'brand',
      headerName: t('subscription.brand'),
      description: t('subscription.brand'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.brand,
      sortable: false,
    },
    {
      field: 'model',
      headerName: t('subscription.model'),
      description: t('subscription.model'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.model,
      sortable: false,
    },
    {
      field: 'price',
      headerName: t('subscription.price'),
      description: t('subscription.price'),
      valueFormatter: columnFormatMoney,
      flex: 1,
      filterOperators: numericFilterOperators,
      hide: !visibilityColumns.price,
      sortable: false,
    },
    {
      field: 'duration',
      headerName: t('subscription.duration'),
      description: t('subscription.duration'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        columnFormatDuration(params.value as string, t),
      filterOperators: selectFilterOperators,
      valueOptions: durationOptions,
      hide: !visibilityColumns.duration,
      sortable: false,
    },
    {
      field: 'status',
      headerName: t('subscription.status.title'),
      description: t('subscription.status.title'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        columnFormatSubEventStatus(params.value as string, t),
      filterOperators: selectFilterOperators,
      valueOptions: statusOptions,
      hide: !visibilityColumns.status,
      sortable: false,
    },
    {
      field: 'updatedAt',
      headerName: t('subscription.updatedDate'),
      description: t('subscription.updatedDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.updatedAt,
      sortable: true,
    },
    {
      field: 'carModelId',
      headerName: t('subscription.modelId'),
      description: t('subscription.modelId'),
      flex: 1,
      filterOperators: idFilterOperators,
      hide: !visibilityColumns.carModelId,
      sortable: false,
    },
    {
      field: 'seats',
      headerName: t('subscription.seats'),
      description: t('subscription.seats'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.seats,
      sortable: false,
    },
    {
      field: 'topSpeed',
      headerName: t('subscription.topSpeed'),
      description: t('subscription.topSpeed'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.topSpeed,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('subscription.plateNumber'),
      description: t('subscription.plateNumber'),
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.plateNumber,
      sortable: false,
    },
    {
      field: 'vin',
      headerName: t('subscription.vin'),
      description: t('subscription.vin'),
      flex: 1,
      filterOperators: stringFilterOperators,
      hide: !visibilityColumns.vin,
      sortable: false,
    },
    {
      field: 'fastChargeTime',
      headerName: t('subscription.fastChargeTime'),
      description: t('subscription.fastChargeTime'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.fastChargeTime,
      sortable: false,
    },
    {
      field: 'startDate',
      headerName: t('subscription.startDate'),
      description: t('subscription.startDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
      hide: !visibilityColumns.startDate,
      sortable: true,
    },
    {
      field: 'endDate',
      headerName: t('subscription.endDate'),
      description: t('subscription.endDate'),
      valueFormatter: columnFormatDate,
      filterOperators: dateFilterOperators,
      flex: 1,
      hide: !visibilityColumns.endDate,
      sortable: true,
    },
    {
      field: 'startAddress',
      headerName: t('subscription.startAddress'),
      description: t('subscription.startAddress'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.startAddress,
      sortable: false,
    },
    {
      field: 'endAddress',
      headerName: t('subscription.endAddress'),
      description: t('subscription.endAddress'),
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.endAddress,
      sortable: false,
    },
    {
      field: 'createdAt',
      headerName: t('subscription.createdDate'),
      description: t('subscription.createdDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
      hide: !visibilityColumns.createdAt,
      sortable: true,
    },
  ]

  return (
    <Page>
      <PageToolbar>
        <div>
          <Button
            color="primary"
            startIcon={<EmailIcon />}
            onClick={() => setSendDataDialogOpen(true)}
          >
            {t('subscription.sendAllDataViaEmailButton')}
          </Button>
          &nbsp;&nbsp;
          <a href="https://dashboard.omise.co/" target="_blank" rel="noreferrer">
            <Button color="primary" variant="contained">
              {t('subscription.omiseButton')}
            </Button>
          </a>
        </div>
      </PageToolbar>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={subscriptionsData?.totalData}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          rows={subscriptions}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={handleRowClick}
          filterMode="server"
          onFilterModelChange={handleFilterChange}
          onColumnVisibilityChange={onColumnVisibilityChange}
          sortingMode="server"
          onSortModelChange={handleSortChange}
          loading={isFetching}
          customToolbar={customToolbar}
        />
      </Card>

      <UpdateDialog
        open={isUpdateDialogOpen}
        onClose={(needRefetch) => {
          if (needRefetch) {
            refetch()
          }
          setUpdateDialogOpen(false)
        }}
        subscription={selectedSubscription}
      />
      <SendDataDialog
        open={isSendDataDialogOpen}
        onClose={() => setSendDataDialogOpen(false)}
        onSubmitSend={handleOnSubmitSend}
      />
    </Page>
  )
}
