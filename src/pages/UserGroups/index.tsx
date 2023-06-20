import styled from 'styled-components'
import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { DEFAULT_DATETIME_FORMAT_ISO, validatePrivileges } from 'utils'
import { CSVLink } from 'react-csv'
import AddIcon from '@mui/icons-material/ControlPoint'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useAuth } from 'auth/AuthContext'
import { ROUTE_PATHS } from 'routes'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import MultipleSearchField, { SearchField } from 'components/MultipleSearchField'
import { searchCustomerGroup } from 'services/web-bff/customer'
import { CustomerGroup, CustomerGroupCSV } from 'services/web-bff/customer.type'
import Paginate from 'components/Paginate'
import CreateDialog from './CreateDialog'

const SearchWrapper = styled.div`
  padding: 20px;
`
const SearchInputWrapper = styled.div`
  margin-top: 20px;
`
const AlignRight = styled.div`
  text-align: right;
`
const HeaderTableCell = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: 500;
  padding-left: 16px;
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
  width: 200px;
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

export default function UserGroups(): JSX.Element {
  const { t } = useTranslation()
  const { getPrivileges } = useAuth()
  const userPrivileges = getPrivileges()

  const useStyles = makeStyles({
    noTextDecoration: {
      textDecoration: 'none',
    },
  })
  const classes = useStyles()
  const pageTitle = t('voucherManagement.userGroup.title')

  // User Group

  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [filters, setFilters] = useState({})
  const [isOpenCreateDialog, setIsOpenCreateDialog] = useState<boolean>(false)

  const { data, isFetching, refetch } = useQuery(
    'user-group-list',
    () =>
      searchCustomerGroup({
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
      text: pageTitle,
      link: ROUTE_PATHS.USER_GROUPS,
    },
  ]

  const searchFields: SearchField[] = [
    {
      type: 'textbox',
      optionId: 'id',
      optionLabel: t('voucherManagement.userGroup.detail.id'),
      placeholder: t('voucherManagement.userGroup.detail.idPlaceholder'),
    },
    {
      type: 'textbox',
      optionId: 'name',
      optionLabel: t('voucherManagement.userGroup.detail.name'),
      placeholder: t('voucherManagement.userGroup.detail.namePlaceholder'),
    },
    {
      type: 'datepicker',
      optionId: 'createdDate',
      optionLabel: t('voucherManagement.userGroup.detail.createdDate'),
    },
    {
      type: 'datepicker',
      optionId: 'updatedDate',
      optionLabel: t('voucherManagement.userGroup.detail.updatedDate'),
    },
  ]

  const csvData: CustomerGroupCSV[] = []
  const csvHeaders = [
    { label: 'id', key: 'id' },
    { label: 'name', key: 'name' },
    { label: 'createdDate', key: 'createdDate' },
    { label: 'updatedDate', key: 'updatedDate' },
  ]

  const tableHeaders = [
    {
      colName: t('voucherManagement.userGroup.detail.name'),
      hidden: false,
    },
    {
      colName: t('voucherManagement.userGroup.detail.createdDate'),
      hidden: false,
    },
    {
      colName: t('voucherManagement.userGroup.detail.updatedDate'),
      hidden: false,
    },
  ]

  const rowData = (data?.data.customerGroups &&
    data?.data.customerGroups.length >= 1 &&
    data?.data.customerGroups.map((customerGroup: CustomerGroup) => {
      const id = customerGroup.id

      csvData.push({
        id,
        name: customerGroup.name,
        createdDate: customerGroup.createdDate,
        updatedDate: customerGroup.updatedDate,
      })
      return (
        <TableRow
          key={`table_row_${id}`}
          component={Link}
          to={
            validatePrivileges(userPrivileges, 'PERM_CUSTOMER_GROUP_EDIT')
              ? `/user-groups/${id}`
              : '#'
          }
          className={classes.noTextDecoration}
        >
          <TableCell key={`table_cell_name_${id}`}>
            <RowOverflow>{customerGroup.name}</RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_createdDate_${id}`}>
            <RowOverflow>
              {formatDate(customerGroup.createdDate)}
              <br />
              {formatTime(customerGroup.createdDate)}
            </RowOverflow>
          </TableCell>
          <TableCell key={`table_cell_updatedDate_${id}`}>
            <RowOverflow>
              {formatDate(customerGroup.updatedDate)}
              <br />
              {formatTime(customerGroup.updatedDate)}
            </RowOverflow>
          </TableCell>
        </TableRow>
      )
    })) || (
    <TableRow>
      <TableCell colSpan={tableHeaders.length} align="center">
        {t('noData')}
      </TableCell>
    </TableRow>
  )

  return (
    <Page>
      <PageTitle title={pageTitle} breadcrumbs={breadcrumbs} />
      <Card>
        <SearchWrapper>
          <Typography id="user_group_title_table" variant="h6">
            <strong>{t('voucherManagement.userGroup.subTitle')}</strong>
          </Typography>
          <Grid container spacing={1} justifyContent="flex-end">
            <Grid item xs={12} sm={6} md={6}>
              <SearchInputWrapper>
                <MultipleSearchField
                  id="user_group"
                  spacing={1}
                  fields={searchFields}
                  dateFormat={DEFAULT_DATETIME_FORMAT_ISO}
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
                  id="user_group_csv_button"
                  variant="contained"
                  size="large"
                  disabled={!validatePrivileges(userPrivileges, 'PERM_CUSTOMER_GROUP_VIEW')}
                >
                  <CSVLinkText data={csvData} headers={csvHeaders} filename="user_group.csv">
                    {t('button.export').toLocaleUpperCase()}
                  </CSVLinkText>
                </ActionButton>
                <ActionButton
                  id="user_group_create_button"
                  variant="contained"
                  size="large"
                  endIcon={<AddIcon />}
                  onClick={() => setIsOpenCreateDialog(() => true)}
                  disabled={!validatePrivileges(userPrivileges, 'PERM_CUSTOMER_GROUP_CREATE')}
                >
                  {t('button.create').toLocaleUpperCase()}
                </ActionButton>
              </AlignRight>
            </Grid>
          </Grid>
        </SearchWrapper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((col) => (
                  <TableCell key={col.colName} hidden={col.hidden}>
                    <HeaderTableCell>{col.colName}</HeaderTableCell>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={tableHeaders.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{rowData}</TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>

      {data?.data.pagination ? (
        <Paginate
          pagination={data?.data.pagination}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          refetch={refetch}
        />
      ) : (
        ''
      )}
      <CreateDialog
        open={isOpenCreateDialog}
        onClose={(reload) => {
          if (reload) {
            refetch()
          }
          setIsOpenCreateDialog(() => false)
        }}
      />
    </Page>
  )
}
