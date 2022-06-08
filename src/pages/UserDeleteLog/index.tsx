import styled from 'styled-components'
import {
  Breadcrumbs,
  Button,
  Card,
  Grid,
  InputAdornment,
  Link,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core'
import {
  GridColDef,
  GridPageChangeParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { Search as SearchIcon } from '@material-ui/icons'
import { useState } from 'react'
import config from 'config'
import { columnFormatDate, columnFormatText } from 'utils'
import { useFormik } from 'formik'
import { UserDeleteLogListResponse, UserDeleteLogProps } from 'services/web-bff/user.type'
import { getAllUserDeleteLog } from 'services/web-bff'
import DataGridLocale from 'components/DataGridLocale'
import { Page } from 'layout/LayoutRoute'
import {
  getSearchTypeList,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
} from './utils'

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`

const useStyles = makeStyles(() => ({
  searchBar: {
    margin: '20px 0 0 0',
    display: 'flex',
    alignItems: 'center',
  },
}))

const customToolbar = () => (
  <GridToolbarContainer>
    <GridToolbarColumnsButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport csvOptions={{ allColumns: true }} />
  </GridToolbarContainer>
)

export default function UserDeleteLog(): JSX.Element {
  const { t } = useTranslation()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [filter, setFilter] = useState({})
  const visibilityColumns = getVisibilityColumns()
  const [response, setResponse] = useState<UserDeleteLogListResponse>()
  const [isFetching, setIsFetching] = useState(false)
  const searchTypeList = getSearchTypeList(t)
  const searchTypeDefault = searchTypeList.find((type) => type.isDefault)

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

  const formik = useFormik({
    initialValues: {
      input: '',
      searchType: searchTypeDefault?.value,
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      const updateObj = {
        [value.searchType as string]: value.input,
        page: 1,
        size: pageSize,
      } as UserDeleteLogProps

      setFilter(updateObj)
      search(updateObj)
    },
  })

  const handleFetchPage = (pageNumber: number) => {
    const _pageNumber = pageNumber
    setCurrentPageIndex(_pageNumber)
    const updateObj: UserDeleteLogProps = {
      ...filter,
      page: pageNumber + 1,
      size: pageSize,
    }
    setFilter(updateObj)
    search(updateObj)
  }

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    //  setSubscriptionFilter({ ...subscriptionFilter, size: params.pageSize, page: 1 })
    setPageSize(params.pageSize)
    setCurrentPageIndex(0)
    const updateObj: UserDeleteLogProps = {
      ...filter,
      page: 1,
      size: params.pageSize,
    }
    setFilter(updateObj)
    search(updateObj)
  }

  const search = async (filter: UserDeleteLogProps) => {
    const res = await getAllUserDeleteLog(filter)
    setResponse(res)
    setIsFetching(true)

    setTimeout(() => {
      setIsFetching(false)
    })
  }
  const rowCount = response?.data.pagination.totalRecords ?? 0
  const rows =
    response?.data.logs && response?.data.logs.length > 0
      ? response?.data.logs.map((log, i) => {
          const index = i
            ? (pageSize * currentPageIndex + i + 1).toString()
            : (pageSize * currentPageIndex + 1).toString()
          return {
            id: index,
            email: log.email,
            firstName: log.firstName,
            lastName: log.lastName,
            createdDate: log.createdDate,
            action: log.action,
            createdBy: log.createdBy,
          }
        })
      : []

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('userDeleteLog.id'),
      description: t('userDeleteLog.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'firstName',
      headerName: t('userDeleteLog.firstName'),
      description: t('userDeleteLog.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'lastName',
      headerName: t('userDeleteLog.lastName'),
      description: t('userDeleteLog.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'email',
      headerName: t('userDeleteLog.email'),
      description: t('userDeleteLog.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'createdDate',
      headerName: t('userDeleteLog.createdDate'),
      description: t('userDeleteLog.createdDate'),
      hide: !visibilityColumns.createdDate,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'action',
      headerName: t('userDeleteLog.action'),
      description: t('userDeleteLog.action'),
      hide: !visibilityColumns.action,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'createdBy',
      headerName: t('userDeleteLog.createdBy'),
      description: t('userDeleteLog.createdBy'),
      hide: !visibilityColumns.createdBy,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
  ]

  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {t('userDeleteLog.header')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Typography color="textPrimary">{t('userDeleteLog.breadcrumb')}</Typography>
      </BreadcrumbsWrapper>
      <Grid className={classes.searchBar} container spacing={3}>
        <Grid item xs={2}>
          <TextField
            fullWidth
            select
            label={t('userDeleteLog.column')}
            id="document"
            defaultValue={searchTypeDefault?.value}
            value={formik.values.searchType}
            onChange={(event) => {
              formik.setFieldValue('searchType', event.target.value || '')
              formik.setFieldValue('input', '')
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {searchTypeList?.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            variant="outlined"
            value={formik.values.input}
            onChange={(ev) => {
              formik.setFieldValue('input', ev.target.value || '')
            }}
            placeholder={t('userDeleteLog.searchLabel')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button onClick={() => formik.handleSubmit()} color="primary" variant="contained">
            {t('button.search')}
          </Button>
        </Grid>
      </Grid>

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
          onColumnVisibilityChange={onColumnVisibilityChange}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
          filterMode="server"
          loading={isFetching}
          onFetchNextPage={() => handleFetchPage(currentPageIndex + 1)}
          onFetchPreviousPage={() => handleFetchPage(currentPageIndex - 1)}
          customToolbar={customToolbar}
        />
      </Card>
    </Page>
  )
}
