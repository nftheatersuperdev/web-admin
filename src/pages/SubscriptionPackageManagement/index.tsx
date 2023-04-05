import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Link as RouterLink } from 'react-router-dom'
import config from 'config'
import {
  Breadcrumbs,
  Link,
  Typography,
  Divider,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  Box,
  FormControl,
  Select,
} from '@material-ui/core'
import { makeStyles } from '@mui/styles'
import { Card } from '@mui/material'
import { Pagination } from '@material-ui/lab'
import {
  GridCellParams,
  GridColDef,
  GridColumnHeaderParams,
  GridPageChangeParams,
} from '@material-ui/data-grid'
import { Search as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/ControlPoint'
import Backdrop from 'components/Backdrop'
import { Page } from 'layout/LayoutRoute'
import { getSubscriptionPackages } from 'services/web-bff/subscription-package'
import DataGridLocale from './SubscriptionPackageGrid'

const useStyles = makeStyles(() => ({
  searchBar: {
    marginTop: '10px',
    marginBottom: '10px',
    marginLeft: '4px',
    display: 'flex',
    alignItems: 'left',
  },
  fullWidth: {
    width: '100%',
  },
  filter: {
    height: '54px',
  },
  paginationContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  paddindElement: {
    marginLeft: '16px',
  },
  addButton: {
    color: '#fff',
    backgroundColor: '#424E63',
    height: '54px',
  },
  addButtonGrid: {
    display: 'flex',
    marginRight: '24px',
  },
  columnHeader: {
    fontSize: '14px',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
  },
  selectSearch: {
    height: '90px',
  },
}))

export default function SubscriptionPackageManagement(): JSX.Element {
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const classes = useStyles()

  const {
    data: subscriptionsData,
    refetch,
    isFetched: isFetchedActivities,
    isFetching: isFetchingActivities,
  } = useQuery('get-subscription-packages', () =>
    getSubscriptionPackages({
      page,
      size: pageSize,
    })
  )

  const rowCount = subscriptionsData?.pagination?.totalRecords ?? 0
  const rows =
    subscriptionsData?.packages.map((packageData) => {
      return {
        id: packageData.id,
        packageName: packageData.nameEn,
        packagePeriod: packageData.periodMonth,
        price: packageData.price,
        publishedDate: packageData.publishDate,
        status: packageData.status,
      }
    }) || []

  const columns: GridColDef[] = [
    {
      field: 'id',
      hide: false,
      flex: 1,
      sortable: false,
      renderHeader: (_: GridColumnHeaderParams) =>
        getTextHeaderCell(t('subscriptionPackageManagement.table.columnHeader.packageId')),
      renderCell: (params: GridCellParams) => getTextCell(params.row.id),
    },
    {
      field: 'packageName',
      headerName: t('subscriptionPackageManagement.table.columnHeader.packageName'),
      hide: false,
      flex: 1,
      sortable: false,
      headerClassName: classes.columnHeader,
    },
    {
      field: 'packagePeriod',
      hide: false,
      flex: 1,
      sortable: false,
      renderHeader: (_: GridColumnHeaderParams) =>
        getTextHeaderCell(t('subscriptionPackageManagement.table.columnHeader.packagePeriod')),
      renderCell: (params: GridCellParams) => getTextCell(params.row.packagePeriod),
    },
    {
      field: 'price',
      headerName: t('subscriptionPackageManagement.table.columnHeader.price'),
      hide: false,
      flex: 1,
      sortable: false,
      headerClassName: classes.columnHeader,
    },
    {
      field: 'publishedDate',
      hide: false,
      flex: 1,
      sortable: false,
      renderHeader: (_: GridColumnHeaderParams) =>
        getTextHeaderCell(t('subscriptionPackageManagement.table.columnHeader.publishedDate')),
      renderCell: (params: GridCellParams) => getTextCell(params.row.status),
    },
  ]

  const BreadcrumbsWrapper = styled(Breadcrumbs)`
    margin: 10px 0 20px 0;
  `
  const TableWrapper = styled.div`
    background-color: #fff;
  `

  const DividerCustom = styled(Divider)`
    margin-bottom: 25px;
  `

  const CardWrapper = styled(Card)`
    padding: 21px 0px;
  `

  const CardHeader = styled.div`
    margin: 0px 16px;
  `

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  useEffect(() => {
    if (subscriptionsData?.pagination) {
      setPage(subscriptionsData.pagination.page)
      setPageSize(subscriptionsData.pagination.size)
    }

    if (isFetchedActivities) {
      console.error(`Unable to mutation useCreateUserGroup, ${pageSize}`)
    }
  }, [subscriptionsData?.pagination, isFetchedActivities, pageSize])

  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [page, pageSize, refetch])

  function getTextHeaderCell(text: string) {
    return <div className={classes.columnHeader}>{text}</div>
  }

  function getTextCell(text: string) {
    return (
      <Typography variant="h6" component="h2">
        {text}
      </Typography>
    )
  }

  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {t('subscriptionPackageManagement.header')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.subscriptionManagement')}
        </Link>
        <Typography color="textPrimary">{t('subscriptionPackageManagement.header')}</Typography>
      </BreadcrumbsWrapper>
      <DividerCustom />
      <CardWrapper>
        <CardHeader>
          <Typography variant="h6" component="h2">
            {t('subscriptionPackageManagement.table.header')}
          </Typography>
          <Grid className={classes.searchBar} container spacing={3}>
            <Grid item xs={12} sm={3} lg={3} xl={3}>
              <TextField
                className={[classes.selectSearch].join(' ')}
                fullWidth
                select
                label={t('subscriptionPackageManagement.table.selectSearch')}
                variant="outlined"
                id="subscription_package_management__searchtype_input"
              >
                <MenuItem value="TODO">
                  <em>TODO</em>
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3} lg={3} xl={3}>
              <TextField
                disabled={false}
                className={classes.filter}
                fullWidth
                variant="outlined"
                id="subscription_package_management__searchField_input"
                placeholder={t('subscriptionPackageManagement.table.enterSearch')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} lg={6} xl={6}>
              <Box className={classes.addButtonGrid} justifyContent="flex-end">
                <Button endIcon={<AddIcon />} className={classes.addButton} variant="contained">
                  {t('subscriptionPackageManagement.table.createButton')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardHeader>
        <TableWrapper>
          <DataGridLocale
            autoHeight
            pageSize={pageSize}
            page={page - 1}
            rowCount={rowCount}
            paginationMode="server"
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setPage}
            rows={rows}
            columns={columns}
            sortingMode="server"
            hideFooter
            disableColumnMenu
          />
          <div className={classes.paginationContrainer}>
            Rows per page:&nbsp;
            <FormControl className={classes.inlineElement} variant="standard">
              <Select
                value={pageSize}
                defaultValue={page}
                onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                  setPage(1)
                  setPageSize(event.target.value as number)
                }}
              >
                {config.tableRowsPerPageOptions.map((rowOption) => {
                  return (
                    <MenuItem key={rowOption} value={rowOption}>
                      {rowOption}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
            <Pagination
              count={subscriptionsData?.pagination?.totalPage}
              page={subscriptionsData?.pagination?.page || page}
              defaultPage={subscriptionsData?.pagination?.page || page}
              variant="text"
              color="primary"
              onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                setPage(value)
              }}
            />
          </div>
        </TableWrapper>
      </CardWrapper>
      <Backdrop open={isFetchingActivities} />
    </Page>
  )
}
