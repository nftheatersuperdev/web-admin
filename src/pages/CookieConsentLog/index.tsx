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
import { useState } from 'react'
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
import { getList as getDocumentList } from 'services/web-bff/document'
import {
  getStatusList,
  getVisibilityColumns,
  SelectOption,
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
  </GridToolbarContainer>
)

export default function CookieConsentLog(): JSX.Element {
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [filter, setFilter] = useState({})
  const visibilityColumns = getVisibilityColumns()
  const statusList = getStatusList(t)
  const defaultStatus = statusList.find((status) => status.isDefault)
  const [response, setResponse] = useState<CookieConsentLogListResponse>()
  const [isFetching, setIsFetching] = useState(false)
  const isEnglish = i18n.language === 'en'

  const search = async (filter: CookieConsentLogListProps) => {
    const res = await getList(filter)
    setResponse(res)
    setIsFetching(true)

    setTimeout(() => {
      setIsFetching(false)
    })
  }
  const { data: documentTypeListResponse } = useQuery('document-type-list', () =>
    getDocumentList({ size: config.maxInteger, page: 1 })
  )
  const { data: documentCategories } = useQuery('document-categories', () => getCategories())

  const allSelect: SelectOption = {
    key: 'all',
    label: t('all'),
    value: 'all',
    isDefault: true,
  }
  const documents: SelectOption[] =
    documentTypeListResponse?.documents.map((doc) => {
      return {
        key: doc.codeName,
        label: isEnglish ? doc.nameEn : doc.nameTh,
        value: doc.codeName,
        isDefault: false,
      } as SelectOption
    }) || []
  documents.unshift(allSelect)

  const formik = useFormik({
    initialValues: {
      ipAddress: '',
      category: '',
      status: defaultStatus?.value,
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      console.log('value ->', value)
      let updateObj: CookieConsentLogListProps = {
        ...filter,
        page: 1,
        size: pageSize,
      }

      if (value.ipAddress) {
        updateObj = { ...updateObj, ipAddress: value.ipAddress }
      } else {
        delete updateObj.ipAddress
      }

      if (value.status !== 'all') {
        updateObj = { ...updateObj, isAccepted: value.status }
      } else {
        delete updateObj.isAccepted
      }

      if (value.category !== 'all') {
        updateObj = { ...updateObj, category: value.category }
      } else {
        delete updateObj.category
      }

      setFilter(updateObj)
      setCurrentPageIndex(0)
      search(updateObj)
    },
  })

  const rowCount = response?.data.pagination.totalRecords ?? 0
  const rows =
    response?.data.consents && response?.data.consents.length > 0
      ? response?.data.consents.map((log) => {
          return {
            id: log.id,
            // category: {
            //   en: {
            //     name: log.cookieContent.nameEn,
            //     description: log.cookieContent.descriptionEn,
            //   },
            //   th: {
            //     name: log.cookieContent.nameTh,
            //     description: log.cookieContent.descriptionTh,
            //   },
            // },
            version: log.cookieContent?.version | 0.0,
            ipAddress: log.ipAddress,
            sessionId: log.sessionId,
            createdDate: log.createdDate,
            status: log.status,
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
      field: 'userId',
      headerName: t('cookieConsentLog.userId'),
      description: t('cookieConsentLog.userId'),
      hide: !visibilityColumns.userId,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'email',
      headerName: t('cookieConsentLog.email'),
      description: t('cookieConsentLog.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'firstName',
      headerName: t('cookieConsentLog.firstName'),
      description: t('cookieConsentLog.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'lastName',
      headerName: t('cookieConsentLog.lastName'),
      description: t('cookieConsentLog.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'phoneNumber',
      headerName: t('cookieConsentLog.phoneNumber'),
      description: t('cookieConsentLog.phoneNumber'),
      hide: !visibilityColumns.phoneNumber,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'documentNameEn',
      headerName: t('cookieConsentLog.documentNameEn'),
      description: t('cookieConsentLog.documentNameEn'),
      hide: !visibilityColumns.documentNameEn,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'documentNameTh',
      headerName: t('cookieConsentLog.documentNameTh'),
      description: t('cookieConsentLog.documentNameTh'),
      hide: !visibilityColumns.documentNameTh,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'acceptedDate',
      headerName: t('cookieConsentLog.acceptedDate'),
      description: t('cookieConsentLog.acceptedDate'),
      hide: !visibilityColumns.acceptedDate,
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
      field: 'documentVersion',
      headerName: t('cookieConsentLog.documentVersion'),
      description: t('cookieConsentLog.documentVersion'),
      hide: !visibilityColumns.documentVersion,
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
            label={t('cookieConsentLog.categoryLabel')}
            id="document"
            value={formik.values.category}
            onChange={(event) => {
              formik.setFieldValue('category', event.target.value || '')
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {documentCategories?.map((category) => (
              <MenuItem key={category.id} value={category.category}>
                {isEnglish ? category.nameEn : category.nameTh}
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
