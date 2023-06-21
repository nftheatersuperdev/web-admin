import styled from 'styled-components'
import { Button, Card, Grid, TableCell, TableRow, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DEFAULT_DATE_FORMAT_BFF, validatePrivileges } from 'utils'
import { CSVLink } from 'react-csv'
import AddIcon from '@mui/icons-material/ControlPoint'
import { Link, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from 'auth/AuthContext'
import { ROUTE_PATHS } from 'routes'
import { Page } from 'layout/LayoutRoute'
import Paginate from 'components/Paginate'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import MultipleSearchField, { SearchField } from 'components/MultipleSearchField'
import TableContainer, { TableColmun } from 'components/TableContainer'
import TableRowNoData from 'components/TableRowNoData'
import { getList } from 'services/web-bff/voucher'
import { Voucher, VoucherCSV } from 'services/web-bff/voucher.type'

const SearchWrapper = styled.div`
  padding: 20px;
`
const SearchInputWrapper = styled.div`
  margin-top: 20px;
`
const AlignRight = styled.div`
  text-align: right;
`
const ActionButton = styled(Button)`
  margin-top: 20px !important;
  margin-left: 5px !important;
  background-color: #333c4d !important;
  height: 51px;

  &:hover {
    background-color: #1e3b80 !important;
  }
  &:disabled {
    background-color: #dddddd !important;
  }
`
const RowOverflow = styled.div`
  width: 185px;
  overflow-wrap: break-word;
  overflow: hidden;
  textoverflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  padding: 0 18px;
`
const CSVLinkText = styled(CSVLink)`
  color: #fff;
  text-decoration: none;
`

const formatDate = (date: string): string => dayjs(date).format('DD MMM YYYY')
const formatTime = (date: string): string => dayjs(date).format('HH:mm')

export default function VoucherListPage(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const { getPrivileges } = useAuth()
  const userPrivileges = getPrivileges()

  const useStyles = makeStyles({
    noTextDecoration: {
      textDecoration: 'none',
    },
  })
  const classes = useStyles()
  const pageTitle = t('voucherManagement.voucher.title')

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [filters, setFilters] = useState({})

  const { data, isFetching, refetch } = useQuery(
    'voucher-list',
    () =>
      getList({
        data: filters,
        page,
        size: pageSize,
      }),
    {
      refetchOnWindowFocus: false,
    }
  )

  useEffect(() => {
    refetch()
  }, [filters, page, pageSize, refetch])

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('voucherManagement.title'),
      link: ROUTE_PATHS.ROOT,
    },
    {
      text: t('voucherManagement.voucher.breadcrumb'),
      link: ROUTE_PATHS.VOUCHER,
    },
  ]

  const searchFields: SearchField[] = [
    {
      type: 'textbox',
      optionId: 'idEqual',
      optionLabel: t('voucherManagement.voucher.detail.id'),
      placeholder: t('voucherManagement.voucher.detail.idPlaceholder'),
    },
    {
      type: 'textbox',
      optionId: 'codeContain',
      optionLabel: t('voucherManagement.voucher.detail.code'),
      placeholder: t('voucherManagement.voucher.detail.codePlaceholder'),
    },
    {
      type: 'textbox',
      optionId: 'descriptionEnContain',
      optionLabel: t('voucherManagement.voucher.detail.description'),
      placeholder: t('voucherManagement.voucher.detail.descriptionPlaceholder'),
    },
    {
      type: 'datepicker',
      optionId: 'startAtEqual',
      optionLabel: t('voucherManagement.voucher.detail.startAt'),
    },
    {
      type: 'datepicker',
      optionId: 'endAtEqual',
      optionLabel: t('voucherManagement.voucher.detail.endAt'),
    },
  ]

  const csvData: VoucherCSV[] = []
  const csvHeaders = [
    { label: t('voucherManagement.voucher.detail.id'), key: 'id' },
    { label: t('voucherManagement.voucher.detail.code'), key: 'code' },
    { label: t('voucherManagement.voucher.detail.discountPercent'), key: 'discountPercent' },
    { label: t('voucherManagement.voucher.detail.quantity'), key: 'quantity' },
    { label: t('voucherManagement.voucher.detail.limitPerUser'), key: 'limitPerUser' },
    { label: t('voucherManagement.voucher.detail.startAt'), key: 'startDate' },
    { label: t('voucherManagement.voucher.detail.endAt'), key: 'endDate' },
    { label: t('voucherManagement.voucher.detail.createdDate'), key: 'createdDate' },
    { label: t('voucherManagement.voucher.detail.updatedDate'), key: 'updatedDate' },
  ]

  const voucherCode = t('voucherManagement.voucher.detail.code')
  const voucherDiscountPercent = t('voucherManagement.voucher.detail.discountPercent')
  const voucherQuantity = t('voucherManagement.voucher.detail.quantity')
  const voucherLimitPerUser = t('voucherManagement.voucher.detail.limitPerUser')
  const voucherStartAt = t('voucherManagement.voucher.detail.startAt')
  const voucherEndAt = t('voucherManagement.voucher.detail.endAt')
  const voucherCreatedDate = t('voucherManagement.voucher.detail.createdDate')
  const voucherUpdatedDate = t('voucherManagement.voucher.detail.updatedDate')

  const tableColmuns: TableColmun[] = [
    {
      key: 'voucher_detail_code',
      name: voucherCode,
      hidden: false,
    },
    {
      key: 'voucher_detail_discountPercent',
      name: voucherDiscountPercent,
      hidden: false,
    },
    {
      key: 'voucher_detail_quantity',
      name: voucherQuantity,
      hidden: false,
    },
    {
      key: 'voucher_detail_limitPerUser',
      name: voucherLimitPerUser,
      hidden: false,
    },
    {
      key: 'voucher_detail_startAt',
      name: voucherStartAt,
      hidden: false,
    },
    {
      key: 'voucher_detail_endAt',
      name: voucherEndAt,
      hidden: false,
    },
    {
      key: 'voucher_detail_createdDate',
      name: voucherCreatedDate,
      hidden: false,
    },
    {
      key: 'voucher_detail_updatedDate',
      name: voucherUpdatedDate,
      hidden: false,
    },
  ]

  const rowData = (data?.data.vouchers &&
    data?.data.vouchers.length >= 1 &&
    data?.data.vouchers.map((voucher: Voucher) => {
      const { id, code } = voucher

      csvData.push({
        id,
        code,
        discountPercent: voucher.discountPercent,
        quantity: voucher.quantity,
        limitPerUser: voucher.limitPerUser,
        startDate: voucher.startAt,
        endDate: voucher.endAt,
        createdDate: voucher.createdDate,
        updatedDate: voucher.updatedDate,
      })
      return (
        <TableRow
          key={`table_row_${id}`}
          component={Link}
          to={
            validatePrivileges(userPrivileges, 'PERM_VOUCHER_EDIT') ? `/vouchers/${code}/edit` : '#'
          }
          className={classes.noTextDecoration}
        >
          <TableCell key={`table_cell_code_${id}`}>
            <RowOverflow>{voucher.code}</RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_discountPercent_${id}`}>
            <RowOverflow>{voucher.discountPercent}</RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_quantity_${id}`}>
            <RowOverflow>{voucher.quantity}</RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_limitPerUser_${id}`}>
            <RowOverflow>{voucher.limitPerUser}</RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_startDate_${id}`}>
            <RowOverflow>
              {formatDate(voucher.startAt)}
              <br />
              {formatTime(voucher.startAt)}
            </RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_endDate_${id}`}>
            <RowOverflow>
              {formatDate(voucher.endAt)}
              <br />
              {formatTime(voucher.endAt)}
            </RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_createdDate_${id}`}>
            <RowOverflow>
              {formatDate(voucher.createdDate)}
              <br />
              {formatTime(voucher.createdDate)}
            </RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_updatedDate_${id}`}>
            <RowOverflow>
              {formatDate(voucher.updatedDate)}
              <br />
              {formatTime(voucher.updatedDate)}
            </RowOverflow>
          </TableCell>
        </TableRow>
      )
    })) || <TableRowNoData colSpan={tableColmuns.length} />

  return (
    <Page>
      <PageTitle title={pageTitle} breadcrumbs={breadcrumbs} />
      <Card>
        <SearchWrapper>
          <Typography id="voucher_title_table" variant="h6">
            <strong>{pageTitle}</strong>
          </Typography>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={6}>
              <SearchInputWrapper>
                <MultipleSearchField
                  id="voucher"
                  spacing={1}
                  fields={searchFields}
                  dateFormat={DEFAULT_DATE_FORMAT_BFF}
                  onClear={() => setFilters({})}
                  onSubmit={(id, value) => {
                    if (id && value) {
                      setFilters({
                        [id]: value,
                      })
                    }
                  }}
                />
              </SearchInputWrapper>
            </Grid>
            <Grid item xs={12} sm={6} md={3} />
            <Grid item xs={12} sm={6} md={3}>
              <AlignRight>
                <ActionButton
                  id="voucher_csv_button"
                  variant="contained"
                  size="large"
                  disabled={!validatePrivileges(userPrivileges, 'PERM_VOUCHER_VIEW')}
                >
                  <CSVLinkText data={csvData} headers={csvHeaders} filename="voucher.csv">
                    {t('button.export').toUpperCase()}
                  </CSVLinkText>
                </ActionButton>
                <ActionButton
                  id="voucher_create_button"
                  variant="contained"
                  size="large"
                  endIcon={<AddIcon />}
                  disabled={!validatePrivileges(userPrivileges, 'PERM_VOUCHER_CREATE')}
                  onClick={() => history.push('/vouchers/create')}
                >
                  {t('button.create').toUpperCase()}
                </ActionButton>
              </AlignRight>
            </Grid>
          </Grid>
        </SearchWrapper>
        <TableContainer columns={tableColmuns} isFetching={isFetching} data={rowData} />
      </Card>

      <Paginate
        pagination={data?.data.pagination}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        refetch={refetch}
      />
    </Page>
  )
}
