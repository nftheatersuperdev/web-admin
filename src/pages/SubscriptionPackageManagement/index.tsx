import styled from 'styled-components'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Link as RouterLink, useLocation } from 'react-router-dom'
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
  makeStyles,
  Button,
  Box,
  FormControl,
  Select,
} from '@material-ui/core'
import { Card } from '@mui/material'
import { Pagination } from '@material-ui/lab'
import { GridColDef, GridPageChangeParams } from '@material-ui/data-grid'
import { Search as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/ControlPoint'
import Backdrop from 'components/Backdrop'
import { Page } from 'layout/LayoutRoute'
import { getActivities } from 'services/web-bff/car-activity'
import DataGridLocale from './SubscriptionPackageGrid'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const TableWrapper = styled.div`
  background-color: #fff;
`

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
  buttonWithoutShadow: {
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
  },
  buttonWithoutExport: {
    backgroundColor: '#424E63',
    color: 'white',
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
  },
  buttoExport: {
    color: 'white',
  },
  exportContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  chipBgGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  chipBgPrimary: {
    backgroundColor: '#4584FF',
    color: 'white',
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
  selectSearch: {
    height: '90px',
  },
}))

const useQueryString = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

export default function SubscriptionPackageManagement(): JSX.Element {
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const classes = useStyles()
  const qs = {
    plate: useQueryString().get('plate'),
    brand: useQueryString().get('brand'),
    model: useQueryString().get('model'),
    color: useQueryString().get('color'),
  }

  const [filterPlate] = useState<string>(qs.plate || '')
  const [filterBrand] = useState<string>(qs.brand || '')
  const [filterModel] = useState<string>(qs.model || '')
  const [filterColor] = useState<string>(qs.color || '')

  const {
    data: carActivitiesData,
    refetch,
    isFetched: isFetchedActivities,
    isFetching: isFetchingActivities,
  } = useQuery('get-car-activities', () =>
    getActivities(
      {
        page,
        size: pageSize,
      },
      {
        carBrandId: filterBrand,
        carModelId: filterModel,
        carSkuId: filterColor,
        plateNumber: filterPlate,
      }
    )
  )

  const rowCount = carActivitiesData?.pagination?.totalRecords ?? 0
  const rows =
    carActivitiesData?.cars.map((carActivity) => {
      return {
        id: carActivity.carId,
        brandName: carActivity.brandName,
        modelName: carActivity.modelName,
        color: carActivity.color,
        plateNumber: carActivity.plateNumber,
      }
    }) || []

  const visibilityColumns = getVisibilityColumns()

  const columns: GridColDef[] = [
    {
      field: 'brandName',
      headerName: t('carActivity.brand.label'),
      description: t('carActivity.brand.label'),
      hide: !visibilityColumns.brandName,
      flex: 1,
      sortable: false,
    },
    {
      field: 'modelName',
      headerName: t('carActivity.model.label'),
      description: t('carActivity.model.label'),
      hide: !visibilityColumns.modelName,
      flex: 1,
      sortable: false,
    },
    {
      field: 'color',
      headerName: t('carActivity.color.label'),
      description: t('carActivity.color.label'),
      hide: !visibilityColumns.color,
      flex: 1,
      sortable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('carActivity.plateNumber.label'),
      description: t('carActivity.plateNumber.label'),
      hide: !visibilityColumns.plateNumber,
      flex: 1,
      sortable: false,
    },
  ]

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

  const DividerCustom = styled(Divider)`
    margin-bottom: 25px;
  `

  const CardWrapper = styled(Card)`
    padding: 21px 0px;
  `

  const CardHeader = styled.div`
    margin: 0px 16px;
  `

  useEffect(() => {
    if (carActivitiesData?.pagination) {
      setPage(carActivitiesData.pagination.page)
      setPageSize(carActivitiesData.pagination.size)
      setPages(carActivitiesData.pagination.totalPage)
    }

    if (isFetchedActivities) {
      console.error(`Unable to mutation useCreateUserGroup, ${isFetchedActivities}`)
    }
  }, [carActivitiesData?.pagination, isFetchedActivities])

  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [pages, page, pageSize, refetch])

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
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
            pagination
            pageSize={pageSize}
            page={page - 1}
            rowCount={rowCount}
            paginationMode="server"
            onPageSizeChange={handlePageSizeChange}
            onPageChange={setPage}
            rows={rows}
            columns={columns}
            onColumnVisibilityChange={onColumnVisibilityChange}
            sortingMode="server"
            hideFooter
          />
          <div className={classes.paginationContrainer}>
            Rows per page:&nbsp;
            <FormControl className={classes.inlineElement} variant="standard">
              <Select
                value={pageSize}
                defaultValue={page}
                onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                  setPage(0)
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
              count={carActivitiesData?.pagination?.totalPage || pages}
              page={carActivitiesData?.pagination?.page || page}
              defaultPage={carActivitiesData?.pagination?.page || page}
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
