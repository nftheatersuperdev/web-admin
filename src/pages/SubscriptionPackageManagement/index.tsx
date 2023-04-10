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
import {
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Pagination } from '@material-ui/lab'
import { Search as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/ControlPoint'
import { Page } from 'layout/LayoutRoute'
import { getSubscriptionPackages } from 'services/web-bff/subscription-package'
import {
  formatDateMonth,
  publishedStatus,
  packageStatusString,
  PackageStatus,
  formatDateMonthYearTime,
  formatMoney,
} from './utils'

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
    fontSize: '12px',
    //fontFamily: 'Roboto',
    fontWeight: 'bold',
    paddingLeft: '16px',
  },
  selectSearch: {
    height: '90px',
  },
  cellText: {
    fontSize: '14px',
    //fontFamily: 'Roboto',
    fontWeight: 400,
    fontStyle: 'normal',
    paddingLeft: '8px',
  },
  twoLine: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  published: {
    borderRadius: '64px',
    fontSize: '12px',
    //fontFamily: 'Roboto',
    fontWeight: 500,
    height: '24px',
    lineHeight: '24px',
    width: '29px',
    textAlign: 'center',
    marginLeft: '8px',
  },
  bgGreen: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  bgGrey: {
    backgroundColor: '#E0E0E0',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  bgSecondary: {
    backgroundColor: '##424E63',
    color: 'white',
  },
  table: {
    width: '100%',
  },
  headerBorder: {
    borderLeft: '2px solid #E0E0E0',
  },
  packageStatus: {
    borderRadius: '64px',
    fontSize: '12px',
    //fontFamily: 'Roboto',
    fontWeight: 500,
    height: '24px',
    lineHeight: '24px',
    textAlign: 'center',
    marginLeft: '8px',
    paddingLeft: '6px',
    paddingRight: '6px',
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
    isFetching: isFetchingSubscription,
  } = useQuery('get-subscription-packages', () =>
    getSubscriptionPackages({
      page,
      size: pageSize,
    })
  )

  const rows =
    subscriptionsData?.packages.map((packageData) => {
      return {
        id: packageData.id,
        packageName: packageData.nameEn,
        packagePeriod: packageData.periodMonth,
        price: packageData.price,
        publishedDate: packageData.publishDate,
        status: packageData.status,
        createdBy: packageData.createdBy,
        createdDate: packageData.createdDate,
        isPublish: packageData.isPublish,
      }
    }) || []

  const subscriptionsRowData =
    (rows &&
      rows.length > 0 &&
      rows.map((row) => {
        return (
          <TableRow hover key={`subscription-${row.id}`}>
            <TableCell>{getTwoLineTextCell(row.id)}</TableCell>
            <TableCell>{getTwoLineTextCell(row.packageName)}</TableCell>
            <TableCell>{getPeriodTextCell(row.packagePeriod)}</TableCell>
            <TableCell colSpan={2}>{getPriceTextCell(row.price)}</TableCell>
            <TableCell>{getTwoLineTextCell(formatDateMonth(row.publishedDate))}</TableCell>
            <TableCell>{getPublishedChipCell(row.isPublish)}</TableCell>
            <TableCell>{getPackageStatusCell(row.status)}</TableCell>
            <TableCell>{getTwoLineTextCell(row.createdBy)}</TableCell>
            <TableCell>{getTwoLineTextCell(formatDateMonthYearTime(row.createdDate))}</TableCell>
          </TableRow>
        )
      })) ||
    []

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
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [page, pageSize, refetch])

  function getTextHeaderCell(text: string, isShowborder = true) {
    let classGroup = classes.columnHeader
    if (isShowborder) {
      classGroup = [classes.columnHeader, classes.headerBorder].join(' ')
    }
    return <div className={classGroup}>{text}</div>
  }

  function getTwoLineTextCell(text: string) {
    return <div className={[classes.cellText, classes.twoLine].join(' ')}>{text}</div>
  }

  function getPeriodTextCell(text: number) {
    return (
      <div className={[classes.cellText, classes.twoLine].join(' ')}>
        {text} {t('subscriptionPackageManagement.table.cell.months')}
      </div>
    )
  }

  function getPublishedChipCell(isPublished: boolean) {
    return (
      <div>
        <div
          className={[classes.published, isPublished ? classes.bgGreen : classes.bgGrey].join(' ')}
        >
          {publishedStatus(isPublished, t)}
        </div>
      </div>
    )
  }

  function getPriceTextCell(text: number) {
    return (
      <div className={[classes.cellText, classes.twoLine].join(' ')}>
        {formatMoney(text)} {t('subscriptionPackageManagement.table.cell.thb')}
      </div>
    )
  }

  function getPackageStatusCell(status: string) {
    let classGroup = classes.packageStatus
    switch (status) {
      case PackageStatus.Active:
        classGroup = [classes.packageStatus, classes.bgGreen].join(' ')
        break
      case PackageStatus.Inactive:
        classGroup = [classes.packageStatus, classes.bgGrey].join(' ')
        break
      case PackageStatus.Pending:
        classGroup = [classes.packageStatus, classes.bgSecondary].join(' ')
        break
      default:
        classGroup = classes.packageStatus
        break
    }
    return (
      <div>
        <div className={classGroup}>{packageStatusString(status, t)}</div>
      </div>
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
          <TableContainer className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.packageId'),
                      false
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.packageName')
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.packagePeriod')
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(t('subscriptionPackageManagement.table.columnHeader.price'))}
                  </TableCell>
                  <TableCell> </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.publishedDate')
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.published')
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.status')
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.createdBy')
                    )}
                  </TableCell>
                  <TableCell>
                    {getTextHeaderCell(
                      t('subscriptionPackageManagement.table.columnHeader.createdDate')
                    )}
                  </TableCell>
                </TableRow>
              </TableHead>
              {isFetchingSubscription ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>{subscriptionsRowData}</TableBody>
              )}
            </Table>
          </TableContainer>

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
    </Page>
  )
}
