import { useTranslation } from 'react-i18next'
import {
  Grid,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TextField,
  InputAdornment,
  MenuItem,
  Autocomplete,
} from '@mui/material'
import styled from 'styled-components'
import ls from 'localstorage-slim'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { makeStyles } from '@mui/styles'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { CloseOutlined } from '@mui/icons-material'
import { useFormik } from 'formik'
import { STORAGE_KEYS } from 'auth/AuthContext'
import {
  DataWrapper,
  EnabledTextField,
  GridSearchSection,
  TextLineClamp,
  Wrapper,
} from 'components/Styled'
import PageTitle from 'components/PageTitle'
import { Page } from 'layout/LayoutRoute'
import { searchAdminUser } from 'services/web-bff/admin-user'
import { AdminUserByCriteria, AdminUsersProps } from 'services/web-bff/admin-user.type'
import Paginate from 'components/Paginate'
import AddNewAdminDialog from './AddNewAdminDialog'

const AlignRight = styled.div`
  text-align: right;
`
const TableHeaderColumn = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: bold;
  padding-left: 10px;
`

export default function AdminUser(): JSX.Element {
  const useStyles = makeStyles({
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16.5px 14px',
      },
    },
    textLeft: {
      textAlign: 'left',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    paddingRightBtnClear: {
      cursor: 'pointer',
      padding: '4px 4px',
    },
    chipGreen: {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '64px',
    },
    chipGrey: {
      backgroundColor: '#979797',
      color: 'white',
      borderRadius: '64px',
    },
    chipBgPrimary: {
      backgroundColor: '#4584FF',
      color: 'white',
      borderRadius: '64px',
      padding: '4px',
      margin: '2px',
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const moduleAccount = ls.get<string | null | undefined>(STORAGE_KEYS.ACCOUNT)
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [isAddNewAddminDialogOpen, setIsAddNewAdminDialogOpen] = useState(false)
  const defaultFilter: AdminUserByCriteria = {
    adminName: '',
    email: '',
    module: '',
    role: '',
    isActive: true,
  }
  const [adminFilter, setAdminFilter] = useState<AdminUserByCriteria>({
    ...defaultFilter,
  })
  const {
    data: adminUserList,
    refetch,
    isFetching: isFetchingAdminList,
  } = useQuery(
    'admin-user-list',
    () =>
      searchAdminUser({
        data: adminFilter,
        page,
        size: pageSize,
      } as AdminUsersProps),
    {
      refetchOnWindowFocus: false,
    }
  )
  const adminUser = (adminUserList &&
    adminUserList.data.adminUsers.length > 0 &&
    adminUserList?.data.adminUsers.map((admin) => {
      return (
        // Build Table Body
        <TableRow hover key={admin.id}>
          <TableCell align="left">
            <DataWrapper>
              <TextLineClamp>{admin.adminName}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell align="left">
            <DataWrapper>
              <TextLineClamp>{admin.email}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{admin.account}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{admin.role}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>
                {formaDateStringWithPattern(admin.createdDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
        </TableRow>
      )
    })) || (
    <TableRow>
      <TableCell colSpan={6}>
        <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
      </TableCell>
    </TableRow>
  )
  const roleOptions = [
    { value: 'NETFLIX_ADMIN', label: 'แอดมิน Netflix' },
    { value: 'NETFLIX_AUTHOR', label: 'หัวหน้าแอดมิน Netflix' },
    { value: 'YOUTUBE_ADMIN', label: 'แอดมิน Youtube' },
    { value: 'YOUTUBE_AUTHOR', label: 'หัวหน้าแอดมิน Youtube' },
    { value: 'SUPER_ADMIN', label: 'แอดมินระดับสูงสุด' },
  ]
  const formik = useFormik({
    initialValues: {
      email: '',
      module: moduleAccount,
      role: '',
      isActive: true,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const updateObj = { ...values } as AdminUserByCriteria
      setAdminFilter(updateObj)
      setPage(1)
    },
  })
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (adminUserList?.data.pagination) {
      setPage(adminUserList.data.pagination.page)
      setPageSize(adminUserList.data.pagination.size)
      setPages(adminUserList.data.pagination.totalPage)
    }
  }, [adminUserList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [adminFilter, pages, page, pageSize, refetch])
  return (
    <Page>
      <PageTitle title={t('sidebar.adminManagement.title')} />
      <Wrapper>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" component="h2">
              {t('adminUser.searchPanel')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <AlignRight>
              <Button
                id="admin_user__search_btn"
                variant="contained"
                onClick={() => formik.handleSubmit()}
              >
                {t('button.search')}
              </Button>
              &nbsp;
              <Button
                id="admin_user__add_btn"
                variant="contained"
                onClick={() => setIsAddNewAdminDialogOpen(true)}
              >
                สร้างผู้ใช้งานแอดมินใหม่
              </Button>
            </AlignRight>
          </Grid>
        </Grid>
        <GridSearchSection container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              type="text"
              name="email"
              placeholder="ระบุอีเมลล์ที่ต้องการค้นหา"
              id="customer_list__email_input"
              label={t('customer.email')}
              fullWidth
              value={formik.values.email}
              onChange={({ target }) => formik.setFieldValue('email', target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formik.values.email !== '' ? (
                      <CloseOutlined
                        className={classes.paddingRightBtnClear}
                        onClick={() => {
                          formik.setFieldValue('email', '')
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              name="account"
              placeholder="เลือกบัญชี"
              id="netflix_account_list__account_status_input"
              label={t('customer.account')}
              fullWidth
              variant="outlined"
              value={formik.values.module}
              disabled={moduleAccount !== 'ALL'}
              onChange={({ target }) => formik.setFieldValue('module', target.value)}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="ALL"> ทั้งหมด </MenuItem>
              <MenuItem value="NETFLIX">Netflix</MenuItem>
              <MenuItem value="YOUTUBE">Youtube</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              autoHighlight
              options={roleOptions || []}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === ''
              }
              renderInput={(params) => {
                return (
                  <EnabledTextField
                    /* eslint-disable react/jsx-props-no-spreading */
                    {...params}
                    label="ระดับผู้ใช้งาน"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    error={Boolean(formik.touched.role && formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                  />
                )
              }}
              onChange={(_event, item) => {
                formik.setFieldValue('role', item?.value)
              }}
            />
          </Grid>
        </GridSearchSection>
        <br />
        <TableContainer>
          <Table id="admin_user_list___table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <TableHeaderColumn>ชื่อแอดมิน</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>อีเมลล์</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>บัญชี</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>ระดับผู้ใช้งาน</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>วันที่สร้าง</TableHeaderColumn>
                </TableCell>
              </TableRow>
            </TableHead>
            {isFetchingAdminList ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{adminUser}</TableBody>
            )}
          </Table>
        </TableContainer>
        <GridSearchSection container>
          <Grid item xs={12}>
            <Paginate
              pagination={adminUserList?.data.pagination}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              refetch={refetch}
            />
          </Grid>
        </GridSearchSection>
      </Wrapper>
      <AddNewAdminDialog
        open={isAddNewAddminDialogOpen}
        onClose={() => setIsAddNewAdminDialogOpen(false)}
      />
    </Page>
  )
}
