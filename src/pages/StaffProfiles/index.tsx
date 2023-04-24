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
  Divider,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import config from 'config'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  formatStringForInputText,
} from 'utils'
import AddIcon from '@mui/icons-material/ControlPoint'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import styled from 'styled-components'
import Pagination from '@material-ui/lab/Pagination'
import { getAdminUsers } from 'services/web-bff/admin-user'
import { Page } from 'layout/LayoutRoute'
import NoResultCard from 'components/NoResultCard'
import './pagination.css'
import PageTitleWithoutLine from 'components/PageTitleWithoutLine'

const useStyles = makeStyles({
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
  },
  inlineElement: {
    display: 'inline-flex',
  },
  textRight: {
    textAlign: 'right',
  },
  setWidth: {
    width: '120px',
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
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '64px',
  },
  chipRed: {
    backgroundColor: '#F44336',
    color: 'white',
    borderRadius: '64px',
  },
  buttonExport: {
    color: 'white',
    textDecoration: 'none',
  },
  hideObject: {
    display: 'none',
  },
  headerTopic: {
    padding: '8px 16px',
  },
  gridContainer: {
    marginBottom: '10px',
  },
  table: {
    width: '100%',
  },
  paginationContrainer: {
    display: 'flex',
    listStyleType: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px',
    round: 'true',
  },
  filter: {
    height: '90px',
  },
  selectedRow: {
    '&:hover, &:focus': {
      backgroundColor: 'aqua',
    },
  },
  addButton: {
    color: '#fff',
    backgroundColor: '#424E63',
  },
  breadcrumText: {
    color: '#000000DE',
  },
  headerTopicText: {
    fontSize: '20px',
  },
})

const DividerCustom = styled(Divider)`
  margin: 10px 0;
`
export default function StaffProfiles(): JSX.Element {
  const classes = useStyles()
  const history = useHistory()
  const { t } = useTranslation()
  const [searchCriteria, setCriteria] = React.useState('')
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const { data: adminUsersData, refetch } = useQuery(
    'admin-users',
    () => getAdminUsers(page, pageSize),
    {
      cacheTime: 0,
    }
  )
  const csvHeaders = [
    { label: 'First name', key: 'firstName' },
    { label: 'Last name', key: 'lastName' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Account Status', key: 'status' },
    { label: 'Created Date', key: 'createdDate' },
    { label: 'Updated Date', key: 'updatedDate' },
  ]
  // eslint-disable-next-line
  const csvData: any = []
  const usersData =
    (adminUsersData &&
      adminUsersData.data?.adminUsers.length > 0 &&
      adminUsersData.data.adminUsers.map((adminUserData) => {
        // Build CSV Data
        const acctStatus = adminUserData.isActive ? 'Enable' : 'Disable'
        const makeCsvData = () => ({
          firstName: adminUserData.firstName,
          lastName: adminUserData.lastName,
          email: adminUserData.email,
          role: adminUserData.role,
          status: acctStatus,
          createdDate: formaDateStringWithPattern(
            adminUserData.createdDate,
            DEFAULT_DATETIME_FORMAT_MONTH_TEXT
          ),
          updatedDate: formaDateStringWithPattern(
            adminUserData.updatedDate,
            DEFAULT_DATETIME_FORMAT_MONTH_TEXT
          ),
        })
        csvData.push(makeCsvData())
        // Build Table Body
        return (
          <TableRow
            hover
            onClick={() => history.push(`/staff-profile/${adminUserData.id}/edit`)}
            key={`admin-user-${adminUserData.id}`}
          >
            <TableCell>
              <Checkbox className={classes.hideObject} size="small" />
            </TableCell>
            <TableCell>{formatStringForInputText(adminUserData.firstName)}</TableCell>
            <TableCell>{formatStringForInputText(adminUserData.lastName)}</TableCell>
            <TableCell>{formatStringForInputText(adminUserData.email)}</TableCell>
            <TableCell>{adminUserData.role}</TableCell>
            <TableCell align="center">
              {!adminUserData.isActive ? (
                <Chip size="small" label={t('user.disabled')} className={classes.chipRed} />
              ) : (
                <Chip size="small" label={t('user.enabled')} className={classes.chipGreen} />
              )}
            </TableCell>
            <TableCell>
              {formaDateStringWithPattern(
                adminUserData.createdDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
            </TableCell>
            <TableCell>
              {formaDateStringWithPattern(
                adminUserData.updatedDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
            </TableCell>
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
      <PageTitleWithoutLine title={t('sidebar.staffProfile')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Typography className={classes.breadcrumText}>{t('sidebar.staffProfile')}</Typography>
      </Breadcrumbs>
      <br />
      <DividerCustom />
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography className={classes.headerTopicText}>{t('staffProfile.staffList')}</Typography>
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
                  onChange={(event) => {
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
                id="staff_profile__export_btn"
                className={classes.addButton}
                color="primary"
                variant="contained"
              >
                <CSVLink
                  data={csvData}
                  headers={csvHeaders}
                  filename="EVme Admin Dashboard.csv"
                  className={classes.buttonExport}
                >
                  {t('button.export').toUpperCase()}
                </CSVLink>
              </Button>
              &nbsp;&nbsp;
              <Button
                id="staff_profile__add_btn"
                endIcon={<AddIcon />}
                className={classes.addButton}
                variant="contained"
                onClick={() => history.push(`/staff-profile/create`)}
              >
                {t('button.create').toUpperCase()}
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
                    <TableCell align="center">
                      <Checkbox className={classes.hideObject} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.textBoldBorder}> {t('staffProfile.firstName')}</div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.textBoldBorder}> {t('staffProfile.lastName')}</div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.textBoldBorder}> {t('user.email')}</div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.textBoldBorder}> {t('user.role')}</div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={[classes.textBoldBorder, classes.setWidth].join(' ')}>
                        {t('user.status')}
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.textBoldBorder}> {t('staffProfile.createdDate')}</div>
                    </TableCell>
                    <TableCell align="center">
                      <div className={classes.textBoldBorder}> {t('user.updatedDate')}</div>
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
                    onChange={(event) => {
                      setPage(1)
                      setPageSize(event.target.value as number)
                    }}
                  >
                    {config.tableRowsPerPageOptions?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
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
