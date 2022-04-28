import styled from 'styled-components'
import config from 'config'
import { useMemo, useState } from 'react'
import { Breadcrumbs, Button, Card, CardContent, Typography } from '@material-ui/core'
import {
  GridColDef,
  GridPageChangeParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridCellParams,
  GridRowParams,
  GridRowId,
} from '@material-ui/data-grid'
import {
  Compare as CompareIcon,
  Check as CheckIcon,
  NotInterested as NotInterestedIcon,
} from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { columnFormatDate } from 'utils'
import { useVoucherEventsByVoucherId } from 'services/evme'
import { VoucherEvents as VoucherEventsType } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'
import ChangesDialog from './ChangesDialog'
import DetailDialog from './DetailDialog'

interface VoucherEventsParams {
  voucherId: string
}

const MarginBottom = styled.div`
  margin-bottom: 20px;
`

export default function VoucherEvents(): JSX.Element {
  const queryString = new URLSearchParams(window.location.search)
  const { voucherId } = useParams<VoucherEventsParams>()
  const { t } = useTranslation()
  const { data } = useVoucherEventsByVoucherId(voucherId)
  const visibilityColumns = getVisibilityColumns()

  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [changesDialogOpen, setChangesDialogOpen] = useState<boolean>(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState<boolean>(false)
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0)
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([])
  const [firstCompareObject, setFirstCompareObject] = useState<VoucherEventsType>()
  const [secondCompareObject, setSecondCompareObject] = useState<VoucherEventsType>()
  const [dataDetails, setDataDetails] = useState<VoucherEventsType>()
  const voucherEvents = useMemo(
    () => data?.pages[currentPageIndex]?.edges?.map(({ node }) => node) || [],
    [data, currentPageIndex]
  )

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

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('voucherEvents.id'),
      description: t('voucherEvents.id'),
      hide: !visibilityColumns.eventId,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'voucherId',
      headerName: t('voucher.id'),
      description: t('voucher.id'),
      hide: !visibilityColumns.voucherId,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridCellParams) => row.voucher.id,
    },
    {
      field: 'userId',
      headerName: t('voucherEvents.userId'),
      description: t('voucherEvents.userId'),
      hide: !visibilityColumns.userId,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridCellParams) => row.user.id,
    },
    {
      field: 'userDetail',
      headerName: t('voucherEvents.userDetail'),
      description: t('voucherEvents.userDetail'),
      hide: !visibilityColumns.userDetail,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridCellParams) =>
        `${row.user.firstName} ${row.user.lastName} (${row.user.email})`,
    },
    {
      field: 'event',
      headerName: t('voucherEvents.title'),
      description: t('voucherEvents.title'),
      hide: !visibilityColumns.event,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params: GridCellParams) => {
        const { value } = params
        const valueString = String(value)
        return valueString.charAt(0).toUpperCase() + valueString.slice(1)
      },
    },
    {
      field: 'code',
      headerName: t('voucher.code'),
      description: t('voucher.code'),
      hide: !visibilityColumns.code,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'descriptionEn',
      headerName: t('voucher.description.en'),
      description: t('voucher.description.en'),
      hide: !visibilityColumns.descriptionEn,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'descriptionTh',
      headerName: t('voucher.description.th'),
      description: t('voucher.description.th'),
      hide: !visibilityColumns.descriptionTh,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'discountPercent',
      headerName: t('voucher.discountPercent'),
      description: t('voucher.discountPercent'),
      hide: !visibilityColumns.discountPercent,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'quantity',
      headerName: t('voucher.quantity'),
      description: t('voucher.quantity'),
      hide: !visibilityColumns.quantity,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'limitPerUser',
      headerName: t('voucher.limitPerUser'),
      description: t('voucher.limitPerUser'),
      hide: !visibilityColumns.limitPerUser,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'startAt',
      headerName: t('voucher.startAt'),
      description: t('voucher.startAt'),
      valueFormatter: columnFormatDate,
      hide: !visibilityColumns.startAt,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'endAt',
      headerName: t('voucher.endAt'),
      description: t('voucher.endAt'),
      valueFormatter: columnFormatDate,
      hide: !visibilityColumns.endAt,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'isAllPackages',
      headerName: 'ALL Packages',
      description: 'ALL Packages',
      hide: !visibilityColumns.isAllPackages,
      flex: 1,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row }: GridCellParams) =>
        row.isAllPackages ? <CheckIcon fontSize="small" /> : <NotInterestedIcon fontSize="small" />,
    },
    {
      field: 'createdAt',
      headerName: t('additionalExpense.createdDate'),
      description: t('additionalExpense.createdDate'),
      valueFormatter: columnFormatDate,
      hide: !visibilityColumns.endAt,
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'updatedAt',
      headerName: t('additionalExpense.updatedDate'),
      description: t('additionalExpense.updatedDate'),
      valueFormatter: columnFormatDate,
      hide: !visibilityColumns.updatedAt,
      flex: 1,
      sortable: false,
      filterable: false,
    },
  ]

  const handleRowClick = ({ row }: GridRowParams) => {
    const event: VoucherEventsType = {
      id: row.id,
      code: row.code,
      event: row.event,
      quantity: row.quantity,
      amount: row.amount,
      limitPerUser: row.limitPerUser,
      discountPercent: row.discountPercent,
      percentDiscount: row.percentDiscount,
      descriptionEn: row.descriptionEn,
      descriptionTh: row.descriptionTh,
      startAt: row.startAt,
      endAt: row.endAt,
      isAllPackages: row.isAllPackages,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      user: row.user,
      voucher: row.voucher,
    }
    setDataDetails(event)
    setDetailDialogOpen(true)
  }

  const handleOnCompareChanges = () => {
    const [firstId, secondId] = selectionModel
    const first = voucherEvents.find((object) => object.id === firstId)
    const second = voucherEvents.find((object) => object.id === secondId)

    if (first && second) {
      setFirstCompareObject(first)
      setSecondCompareObject(second)
      setChangesDialogOpen(true)
    }
  }

  const customToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <Button
        disabled={selectionModel.length !== 2}
        color="primary"
        variant="text"
        size="small"
        startIcon={<CompareIcon />}
        onClick={handleOnCompareChanges}
      >
        Compare Changes
      </Button>
    </GridToolbarContainer>
  )

  const renderChangesDialog =
    firstCompareObject && secondCompareObject ? (
      <ChangesDialog
        open={changesDialogOpen}
        onClose={() => setChangesDialogOpen(false)}
        firstCompareObject={firstCompareObject}
        secondCompareObject={secondCompareObject}
      />
    ) : (
      ''
    )

  const renderDetailDialog =
    detailDialogOpen && dataDetails ? (
      <DetailDialog
        open={detailDialogOpen}
        data={dataDetails}
        onClose={() => setDetailDialogOpen(false)}
      />
    ) : (
      ''
    )

  return (
    <Page>
      <MarginBottom>
        <Breadcrumbs aria-label="breadcrumb" separator="›">
          <Link color="textPrimary" to="/vouchers">
            {t('voucherEvents.title')}
          </Link>
          <Typography>{queryString.get('code')}</Typography>
        </Breadcrumbs>
      </MarginBottom>
      <Card>
        <CardContent>
          <DataGridLocale
            className="sticky-header"
            autoHeight
            pagination
            pageSize={pageSize}
            page={currentPageIndex}
            rowCount={data?.pages[currentPageIndex]?.totalCount}
            paginationMode="server"
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setCurrentPageIndex}
            rows={voucherEvents}
            columns={columns}
            checkboxSelection
            disableSelectionOnClick
            onColumnVisibilityChange={onColumnVisibilityChange}
            customToolbar={customToolbar}
            onRowClick={handleRowClick}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel)
            }}
          />
        </CardContent>
      </Card>

      {renderChangesDialog}
      {renderDetailDialog}
    </Page>
  )
}
