/* eslint-disable react-hooks/exhaustive-deps */
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
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { Search as SearchIcon } from '@material-ui/icons'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import config from 'config'
import {
  GridColDef,
  GridPageChangeParams,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
} from '@material-ui/data-grid'
import { columnFormatDate, columnFormatText } from 'utils'
import { useQuery } from 'react-query'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import {
  CookieConsentLogListProps,
  CookieConsentLogListResponse,
} from 'services/web-bff/cookie-consent-log.type'
import { getList, getCategories } from 'services/web-bff/cookie-consent-log'
import {
  getStatusList,
  getVisibilityColumns,
  setVisibilityColumns,
  VisibilityColumns,
  SelectOption,
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
  </GridToolbarContainer>
)

export default function CookieConsentLogPage(): JSX.Element {
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [filter, setFilter] = useState({})
  const visibilityColumns = getVisibilityColumns()
  const statusList = getStatusList(t)
  const defaultStatus = statusList.find((status) => status.isDefault)
  const [response, setResponse] = useState<CookieConsentLogListResponse>()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const isEnglish = i18n.language === 'en'

  const search = async (filter: CookieConsentLogListProps) => {
    setIsFetching(true)
    setResponse(undefined)
    const res = await getList(filter)
    setResponse(res)
    setIsFetching(false)
  }
  const { data: documentCategories } = useQuery('document-categories', () => getCategories())

  useEffect(() => {
    getList(filter).then((res) => setResponse(res))
  }, [])

  const allSelect: SelectOption = {
    key: 'all',
    label: t('all'),
    value: 'all',
    isDefault: true,
  }
  const categories: SelectOption[] =
    documentCategories?.map((category) => {
      return {
        key: category.id,
        label: isEnglish ? category.nameEn : category.nameTh,
        value: category.category,
        isDefault: false,
      } as SelectOption
    }) || []
  categories.unshift(allSelect)
  const defaultCategory = categories?.find((x: SelectOption) => x.isDefault)

  const formik = useFormik({
    initialValues: {
      ipAddress: '',
      category: defaultCategory?.value,
      status: defaultStatus?.value,
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      let updateObject: CookieConsentLogListProps = {
        ...filter,
        page: 1,
        size: pageSize,
      }

      if (value.ipAddress) {
        updateObject = { ...updateObject, ipAddress: value.ipAddress }
      } else {
        delete updateObject.ipAddress
      }

      if (value.status !== 'all') {
        updateObject = { ...updateObject, isAccepted: value.status }
      } else {
        delete updateObject.isAccepted
      }

      if (value.category !== 'all') {
        updateObject = { ...updateObject, category: value.category }
      } else {
        delete updateObject.category
      }

      setFilter(updateObject)
      setCurrentPageIndex(0)
      search(updateObject)
    },
  })

  const rowCount = response?.data.pagination.totalRecords ?? 0
  const rows =
    response?.data.cookieConsents && response?.data.cookieConsents.length > 0
      ? response?.data.cookieConsents.map((log) => {
          return {
            id: log.id,
            categoryName: isEnglish ? log.cookieContent.nameEn : log.cookieContent.nameTh,
            version: log.cookieContent?.version || 0.0,
            ipAddress: log.ipAddress,
            sessionId: log.sessionId,
            createdDate: log.createdDate,
            status:
              log.isAccepted === true
                ? t('cookieConsentLog.documentStatus.accept')
                : t('cookieConsentLog.documentStatus.decline'),
          }
        })
      : []

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    //  setSubscriptionFilter({ ...subscriptionFilter, size: params.pageSize, page: 1 })
    setPageSize(params.pageSize)
    setCurrentPageIndex(0)
    const updateObj: CookieConsentLogListProps = {
      ...filter,
      page: 1,
      size: params.pageSize,
    }
    setFilter(updateObj)
    search(updateObj)
  }

  const handleFetchPage = (pageNumber: number) => {
    const _pageNumber = pageNumber
    setCurrentPageIndex(_pageNumber)
    const updateObj: CookieConsentLogListProps = {
      ...filter,
      page: pageNumber + 1,
      size: pageSize,
    }
    setFilter(updateObj)
    search(updateObj)
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
      headerName: t('cookieConsentLog.id'),
      description: t('cookieConsentLog.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'sessionId',
      headerName: t('cookieConsentLog.sessionId'),
      description: t('cookieConsentLog.sessionId'),
      hide: !visibilityColumns.sessionId,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'ipAddress',
      headerName: t('cookieConsentLog.ipAddress'),
      description: t('cookieConsentLog.ipAddress'),
      hide: !visibilityColumns.ipAddress,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'categoryName',
      headerName: t('cookieConsentLog.categoryName'),
      description: t('cookieConsentLog.categoryName'),
      hide: !visibilityColumns.categoryName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'createdDate',
      headerName: t('cookieConsentLog.createdDate'),
      description: t('cookieConsentLog.createdDate'),
      hide: !visibilityColumns.createdDate,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'status',
      headerName: t('cookieConsentLog.status'),
      description: t('cookieConsentLog.status'),
      hide: !visibilityColumns.status,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'version',
      headerName: t('cookieConsentLog.version'),
      description: t('cookieConsentLog.version'),
      hide: !visibilityColumns.version,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
  ]
  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {t('cookieConsentLog.header')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Typography color="textPrimary">{t('cookieConsentLog.header')}</Typography>
      </BreadcrumbsWrapper>
      <Grid className={classes.searchBar} justifyContent="flex-end" container spacing={3}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            variant="outlined"
            value={formik.values.ipAddress}
            onChange={(event) => {
              formik.setFieldValue('ipAddress', event.target.value || '')
            }}
            placeholder={t('cookieConsentLog.searchLabel')}
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
          <TextField
            fullWidth
            select
            label={t('cookieConsentLog.categoryName')}
            id="document"
            value={formik.values.category}
            defaultValue={defaultCategory?.value}
            onChange={(event) => {
              formik.setFieldValue('category', event.target.value || '')
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {categories?.map((category) => (
              <MenuItem key={category.key} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            select
            label={t('cookieConsentLog.statusNameLabel')}
            id="status"
            name="status"
            defaultValue={defaultStatus?.value}
            value={formik.values.status}
            onChange={(event) => {
              formik.setFieldValue('status', event.target.value || '')
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {statusList.map((status) => {
              return (
                <MenuItem key={status.key} value={status.value}>
                  {status.label}
                </MenuItem>
              )
            })}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <Button
            onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
            disabled={!formik.values.category}
          >
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
          checkboxSelection={false}
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
