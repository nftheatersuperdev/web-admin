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
import { ConsentLogListProps, ConsentLogListResponse } from 'services/web-bff/consent-log.type'
import { getList } from 'services/web-bff/consent-log'
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

export default function ConsentLog(): JSX.Element {
  const { t, i18n } = useTranslation()
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [filter, setFilter] = useState({})
  const visibilityColumns = getVisibilityColumns()
  const statusList = getStatusList(t)
  const defaultStatus = statusList.find((status) => status.isDefault)
  const [response, setResponse] = useState<ConsentLogListResponse>()
  const [isFetching, setIsFetching] = useState(false)
  const isEnglish = i18n.language === 'en'

  const search = async (filter: ConsentLogListProps) => {
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

  useEffect(() => {
    getList(filter).then((res) => setResponse(res))
  }, [])

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
  const defaultDocument = documents?.find((x: SelectOption) => x.isDefault)

  const formik = useFormik({
    initialValues: {
      email: '',
      documentType: defaultDocument?.value,
      status: defaultStatus?.value,
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      let updateObj: ConsentLogListProps = {
        ...filter,
        page: 1,
        size: pageSize,
      }

      if (value.email) {
        updateObj = { ...updateObj, email: value.email }
      } else {
        delete updateObj.email
      }

      if (value.status !== 'all') {
        updateObj = { ...updateObj, isAccepted: value.status }
      } else {
        delete updateObj.isAccepted
      }

      if (value.documentType !== 'all') {
        updateObj = { ...updateObj, codeName: value.documentType }
      } else {
        delete updateObj.codeName
      }

      setFilter(updateObj)
      setCurrentPageIndex(0)
      search(updateObj)
    },
  })

  const rowCount = response?.data.pagination.totalRecords ?? 0
  const rows =
    response?.data.agreements && response?.data.agreements.length > 0
      ? response?.data.agreements.map((log) => {
          return {
            id: log.id,
            userId: log.customer.id,
            email: log.customer.email,
            firstName: log.customer.firstName,
            lastName: log.customer.lastName,
            phoneNumber: log.customer.phoneNumber,
            documentNameEn: log.documentContent.nameEn,
            documentNameTh: log.documentContent.nameTh,
            acceptedDate: log.createdDate,
            status: log.isAccepted
              ? t('consentLog.documentStatus.accept')
              : t('consentLog.documentStatus.decline'),
            documentVersion: log.documentContent.version,
          }
        })
      : []

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    //  setSubscriptionFilter({ ...subscriptionFilter, size: params.pageSize, page: 1 })
    setPageSize(params.pageSize)
    setCurrentPageIndex(0)
    const updateObj: ConsentLogListProps = {
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
    const updateObj: ConsentLogListProps = {
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
      headerName: t('consentLog.id'),
      description: t('consentLog.id'),
      hide: !visibilityColumns.id,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'userId',
      headerName: t('consentLog.userId'),
      description: t('consentLog.userId'),
      hide: !visibilityColumns.userId,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'email',
      headerName: t('consentLog.email'),
      description: t('consentLog.email'),
      hide: !visibilityColumns.email,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'firstName',
      headerName: t('consentLog.firstName'),
      description: t('consentLog.firstName'),
      hide: !visibilityColumns.firstName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'lastName',
      headerName: t('consentLog.lastName'),
      description: t('consentLog.lastName'),
      hide: !visibilityColumns.lastName,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'phoneNumber',
      headerName: t('consentLog.phoneNumber'),
      description: t('consentLog.phoneNumber'),
      hide: !visibilityColumns.phoneNumber,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'documentNameEn',
      headerName: t('consentLog.documentNameEn'),
      description: t('consentLog.documentNameEn'),
      hide: !visibilityColumns.documentNameEn,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'documentNameTh',
      headerName: t('consentLog.documentNameTh'),
      description: t('consentLog.documentNameTh'),
      hide: !visibilityColumns.documentNameTh,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'acceptedDate',
      headerName: t('consentLog.acceptedDate'),
      description: t('consentLog.acceptedDate'),
      hide: !visibilityColumns.acceptedDate,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatDate,
    },
    {
      field: 'status',
      headerName: t('consentLog.status'),
      description: t('consentLog.status'),
      hide: !visibilityColumns.status,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
    {
      field: 'documentVersion',
      headerName: t('consentLog.documentVersion'),
      description: t('consentLog.documentVersion'),
      hide: !visibilityColumns.documentVersion,
      flex: 1,
      filterable: false,
      valueFormatter: columnFormatText,
    },
  ]
  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {t('consentLog.header')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Typography color="textPrimary">{t('consentLog.header')}</Typography>
      </BreadcrumbsWrapper>
      <Grid className={classes.searchBar} justifyContent="flex-end" container spacing={3}>
        <Grid item xs={3}>
          <TextField
            fullWidth
            variant="outlined"
            value={formik.values.email}
            onChange={(event) => {
              formik.setFieldValue('email', event.target.value || '')
            }}
            placeholder={t('consentLog.searchLabel')}
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
            label={t('consentLog.documentTypeLabel')}
            id="document"
            defaultValue={defaultDocument?.value}
            value={formik.values.documentType}
            onChange={(event) => {
              formik.setFieldValue('documentType', event.target.value || '')
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            {documents?.map((option) => (
              <MenuItem key={option.key} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={3}>
          <TextField
            fullWidth
            select
            label={t('consentLog.statusNameLabel')}
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
