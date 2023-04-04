import dayjs from 'dayjs'
import styled from 'styled-components'
import { Fragment, useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import {
  Breadcrumbs,
  IconButton,
  Link,
  Typography,
  Divider,
  Card,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  makeStyles,
  Button,
  Box,
} from '@material-ui/core'
import { GridColDef, GridCellParams, GridValueFormatterParams } from '@material-ui/data-grid'
import { Search as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import AddIcon from '@mui/icons-material/ControlPoint'
import { Page } from 'layout/LayoutRoute'
import { getList } from 'services/web-bff/document'
import DataGridLocale from 'components/DataGridLocale'
import { getVisibilityColumns, setVisibilityColumns, VisibilityColumns } from './utils'

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const TableWrapper = styled.div`
  background-color: #fff;
`

const formatDate = (date: string): string => dayjs(date).format(DEFAULT_DATETIME_FORMAT)

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

export default function SubscriptionPackageManagement(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [page] = useState<number>(1)
  const [size] = useState<number>(10)
  const classes = useStyles()

  const { data: response, isFetching } = useQuery('documents', () => getList({ page, size }))

  const visibilityColumns = getVisibilityColumns()
  const rowCount = response?.pagination.totalRecords || 0
  const rows = response?.documents?.map((document) => document) || []

  const columns: GridColDef[] = [
    {
      field: 'nameTh',
      headerName: t('documents.overview.nameTH'),
      description: t('documents.overview.nameTH'),
      hide: !visibilityColumns.nameTh,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'nameEn',
      headerName: t('documents.overview.nameEN'),
      description: t('documents.overview.nameEN'),
      hide: !visibilityColumns.nameEn,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'codeName',
      headerName: t('documents.overview.codeName'),
      description: t('documents.overview.codeName'),
      hide: !visibilityColumns.codeName,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'version',
      headerName: t('documents.overview.activeVersion'),
      description: t('documents.overview.activeVersion'),
      hide: !visibilityColumns.version,
      flex: 1,
      sortable: true,
      filterable: false,
    },
    {
      field: 'lastUpdated',
      headerName: t('documents.overview.lastUpdated'),
      description: t('documents.overview.lastUpdated'),
      hide: !visibilityColumns.lastUpdated,
      flex: 1,
      sortable: true,
      filterable: false,
      valueFormatter: ({ row }: GridValueFormatterParams): string => formatDate(row.effectiveDate),
    },
    {
      field: 'action',
      headerName: t('documents.overview.action'),
      description: t('documents.overview.action'),
      hide: !visibilityColumns.action,
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: ({ row }: GridCellParams) => (
        <Fragment>
          <IconButton
            onClick={() => history.push(`/documents/${row.codeName}/versions/${row.version}`)}
          >
            <SearchIcon />
          </IconButton>
          <IconButton onClick={() => history.push(`/documents/${row.codeName}/versions`)}>
            <SearchIcon />
          </IconButton>
        </Fragment>
      ),
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

  const Wrapper = styled(Card)`
    padding: 21px 0px;
  `

  const CardHeader = styled.div`
    margin: 0px 16px;
  `

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
      <Wrapper>
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
            pageSize={size}
            page={page}
            rowCount={rowCount}
            rows={rows}
            columns={columns}
            disableSelectionOnClick
            filterMode="server"
            onColumnVisibilityChange={onColumnVisibilityChange}
            loading={isFetching}
          />
        </TableWrapper>
      </Wrapper>
    </Page>
  )
}
