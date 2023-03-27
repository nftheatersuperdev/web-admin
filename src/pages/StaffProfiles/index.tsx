import React, { Fragment, useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import {
  Breadcrumbs,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  makeStyles,
  TableCell,
  TableRow,
  Card,
  FormControl,
  Button,
  Grid,
  Checkbox,
  MenuItem,
  Select,
  TableBody,
  Chip,
  InputLabel,
} from '@material-ui/core'
import { formatDate } from 'utils'
import AddIcon from '@mui/icons-material/ControlPoint'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { useTranslation } from 'react-i18next'
import Pagination from '@material-ui/lab/Pagination'
import { getAdminUsers } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import NoResultCard from 'components/NoResultCard'
import PageTitle from 'components/PageTitle'

const useStyles = makeStyles({
  hide: {
    display: 'none',
  },
  link: {
    color: '#333',
  },
  textBold: {
    fontWeight: 'bold',
  },
  subText: {
    color: '#AAA',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  displayNone: {
    display: 'none',
  },
  displayBlock: {
    display: 'block',
  },
  textRight: {
    textAlign: 'right',
  },
  fullWidth: {
    width: '100%',
  },
  searchWrapper: {
    margin: '20px 20px',
  },
  searchTextField: {
    width: '200px',
  },
  alignRight: {
    display: 'flex !important',
    justifyContent: 'right !important',
  },
  chipGreen: {
    backgroundColor: '#1FEE16',
    color: 'white',
    fontWeight: 'bold',
  },
  buttonClearAllFilters: {
    padding: '16px 9px 16px 9px !important',
    color: '#3f51b5',
    '&:hover, &:focus': {
      background: 'none',
    },
  },
  hideObject: {
    display: 'none',
  },
  headerTopic: {
    padding: '8px 16px',
  },
  buttonWithoutShadow: {
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
  },
  buttonOverridePadding: {
    padding: '16px',
  },
  gridContainer: {
    marginBottom: '10px',
  },
  table: {
    width: '100%',
  },
  tableColumnCarInfo: {
    position: 'sticky',
    left: 0,
    background: '#fff',
    whiteSpace: 'nowrap',
  },
  tableColumnDateHeader: {
    minWidth: '200px',
    whiteSpace: 'nowrap',
    color: '#FFF',
    borderLeft: 'none',
    borderRight: 'none',
  },
  tableColumnDate: {
    minWidth: '200px',
    color: '#FFF',
    borderLeft: 'none',
    borderRight: 'none',
  },
  tableColumnActions: {
    position: 'sticky',
    right: 0,
    background: '#fff',
    textAlign: 'center',
  },
  paginationContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
  },
  filter: {
    height: '90px',
  },
  clickableRow: {
    cursor: 'pointer',
    height: '40px',
    '&:hover, &:focus': {
      backgroundColor: 'aquamarine',
    },
  },
  selectedRow: {
    '&:hover, &:focus': {
      backgroundColor: 'aqua',
    },
  },
})

export default function StaffProfiles(): JSX.Element {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const [searchCriteria, setCriteria] = React.useState('')
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { data: adminUsersData, refetch } = useQuery(
    'admin-users',
    () => getAdminUsers(page, pageSize),
    {
      cacheTime: 0,
    }
  )
  const usersData =
    (adminUsersData &&
      adminUsersData.data?.adminUsers.length > 0 &&
      adminUsersData.data.adminUsers.map((adminUserData) => {
        return (
          <TableRow
            hover
            onClick={() => history.push(`/staff-profile/${adminUserData.id}/edit`)}
            key={`admin-user-${adminUserData.id}`}
          >
            <TableCell>
              <Checkbox className={classes.hideObject} size="small" />
            </TableCell>
            <TableCell>{adminUserData.firstName}</TableCell>
            <TableCell>{adminUserData.lastName}</TableCell>
            <TableCell>{adminUserData.email}</TableCell>
            <TableCell>{adminUserData.role}</TableCell>
            <TableCell>
              {!adminUserData.isActive ? (
                <Chip size="small" label={t('user.disabled')} color="secondary" />
              ) : (
                <Chip size="small" label={t('user.enabled')} className={classes.chipGreen} />
              )}
            </TableCell>
            <TableCell>{formatDate(adminUserData.createdDate)}</TableCell>
            <TableCell>{formatDate(adminUserData.updatedDate)}</TableCell>
          </TableRow>
        )
      })) ||
    []
  const isNoData = usersData.length < 1

  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (adminUsersData?.data.pagination) {
      setPage(adminUsersData.data.pagination.page)
      setPageSize(adminUsersData.data.pagination.size)
      setPages(adminUsersData.data.pagination.totalPage)
    }
  }, [adminUsersData, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [pages, page, pageSize, refetch])

  const onCriteriaChange = (params: string) => {
    params = params + ''
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.staffProfile')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement')}</Typography>
        <Typography color="primary">{t('sidebar.staffProfile')}</Typography>
      </Breadcrumbs>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography>{t('staffProfile.staffList')}</Typography>
        </div>
        <div className={classes.searchWrapper}>
          <Grid container spacing={2} direction="row" className={classes.gridContainer}>
            <Grid item className={[classes.filter].join(' ')} xs={6}>
              <FormControl>
                <InputLabel className={classes.hideObject} id="demo-simple-select-helper-label">
                  {t('staffProfile.searchCriteria')}
                </InputLabel>
                <Select
                  className={[classes.searchTextField, classes.hideObject].join(' ')}
                  labelId="demo-simple-select-autowidth-label"
                  id="demo-simple-select-autowidth"
                  value={searchCriteria}
                  onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                    setCriteria(event.target.value as string)
                    onCriteriaChange(event.target.value as string)
                  }}
                >
                  <MenuItem value="">
                    <em> </em>
                  </MenuItem>
                  <MenuItem value="userId">{t('user.id')}</MenuItem>
                  <MenuItem value="firebaseId">{t('staffProfile.firebaseId')}</MenuItem>
                  <MenuItem value="firstName">{t('user.firstName')}</MenuItem>
                  <MenuItem value="lastName">{t('user.lastName')}</MenuItem>
                  <MenuItem value="email">{t('user.email')}</MenuItem>
                  <MenuItem value="role">{t('user.role')}</MenuItem>
                  <MenuItem value="accountStatus">{t('user.status')}</MenuItem>
                  <MenuItem value="createdDate">{t('staffProfile.createdDate')}</MenuItem>
                  <MenuItem value="updatedDate">{t('user.updatedDate')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item className={[classes.filter, classes.textRight].join(' ')} xs={6}>
              <Button
                className={classes.hideObject}
                endIcon={<FileDownloadIcon />}
                color="primary"
                variant="contained"
              >
                {t('button.export')}
              </Button>
              &nbsp;&nbsp;
              <Button
                endIcon={<AddIcon />}
                color="primary"
                variant="contained"
                onClick={() => history.push(`/staff-profile/create`)}
              >
                {t('button.addNew')}
              </Button>
            </Grid>
          </Grid>
        </div>
        {isNoData ? (
          <NoResultCard />
        ) : (
          <Fragment>
            <TableContainer component={Paper} className={classes.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Checkbox className={classes.hideObject} size="small" />
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('user.firstName')}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('user.lastName')}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('user.email')}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('user.role')}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('user.status')}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('staffProfile.createdDate')}</div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={classes.textBold}> {t('user.updatedDate')}</div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{usersData}</TableBody>
              </Table>
            </TableContainer>
            <Card>
              <div className={classes.paginationContrainer}>
                {t('table.rowPerPage')}:&nbsp;
                <FormControl className={classes.inlineElement}>
                  <Select
                    value={adminUsersData?.data.pagination?.size || pageSize}
                    defaultValue={adminUsersData?.data.pagination?.size || pageSize}
                    onChange={(event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
                      setPage(1)
                      setPageSize(event.target.value as number)
                    }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </FormControl>
                &nbsp;&nbsp;{adminUsersData?.data.pagination?.page || pages} {t('staffProfile.of')}
                &nbsp;
                {adminUsersData?.data.pagination?.totalPage || pages}
                <Pagination
                  count={adminUsersData?.data.pagination?.totalPage || pages}
                  page={adminUsersData?.data.pagination?.page || page}
                  defaultPage={adminUsersData?.data.pagination?.page || page}
                  variant="text"
                  shape="rounded"
                  onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                    setPage(value)
                  }}
                />
              </div>
            </Card>
          </Fragment>
        )}
      </Card>
    </Page>
  )
}
