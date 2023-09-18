import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import ls from 'localstorage-slim'
import { useQuery } from 'react-query'
import {
  CheckBox,
  CheckBoxOutlineBlank,
  CloseOutlined,
  ContentCopy,
  DeleteForever,
  AddCircleOutline as ExtendIcon,
} from '@mui/icons-material'
import { useFormik } from 'formik'
import { STORAGE_KEYS } from 'auth/AuthContext'
import { copyText } from 'utils/copyContent'
import toast from 'react-hot-toast'
import { DataWrapper, GridSearchSection, TextLineClamp, Wrapper } from 'components/Styled'
import PageTitle from 'components/PageTitle'
import { Page } from 'layout/LayoutRoute'
import { deleteCustomer, getCustomerList } from 'services/web-bff/customer'
import { CustomerListInputRequest, CustomerListRequest } from 'services/web-bff/customer.type'
import Paginate from 'components/Paginate'
import ConfirmDialog from 'components/ConfirmDialog'
import ExtendUserDialog from './ExtendUserDialog'
import AddNewUserDialog from './AddNewUserDialog'

const AlignRight = styled.div`
  text-align: right;
`
const TableHeaderColumn = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: bold;
  padding-left: 10px;
`

interface SelectOption {
  label: string
  value: string
}

export default function Customer(): JSX.Element {
  const useStyles = makeStyles({
    hideObject: {
      display: 'none',
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
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    center: {
      textAlign: 'center',
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [userIdParam, setUserIdParam] = useState<string>('')
  const [lineIdParam, setLineIdParam] = useState<string>('')
  const [accountParam, setAccountParam] = useState<string>('')
  const [confirmMessage, setConfirmMessage] = useState<string>('')
  const [isAddNewUserDialogOpen, setIsAddNewUserDialogOpen] = useState(false)
  const [isExtendUserDialogOpen, setIsExtendUserDialogOpen] = useState(false)
  const [visibleDeleteConfirmationDialog, setVisibleDeleteConfirmationDialog] = useState(false)
  const moduleAccount = ls.get<string | null | undefined>(STORAGE_KEYS.ACCOUNT)
  const [selectCustStatus, setSelectCustStatus] = useState<{ value: string; label: string }[]>([])
  const defaultFilter: CustomerListInputRequest = {
    userId: '',
    email: '',
    lineId: '',
    account: moduleAccount,
    status: [],
  }
  const handleExtendUser = (userId: string, lineId: string, account: string) => {
    setUserIdParam(userId)
    setLineIdParam(lineId)
    setAccountParam(account)
    setIsExtendUserDialogOpen(true)
  }
  const [customerFilter, setCustomerFilter] = useState<CustomerListInputRequest>({
    ...defaultFilter,
  })
  const {
    data: customerList,
    refetch,
    isFetching,
  } = useQuery(
    'customer-list',
    () =>
      getCustomerList({
        data: customerFilter,
        page,
        size: pageSize,
      } as CustomerListRequest),
    {
      refetchOnWindowFocus: false,
    }
  )
  const formik = useFormik({
    initialValues: {
      userId: '',
      email: '',
      lineId: '',
      account: moduleAccount,
      status: [],
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      const updateObj = { ...values } as CustomerListInputRequest
      setCustomerFilter(updateObj)
      setPage(1)
    },
  })
  const handleDeleteCustomer = (id: string, lineId: string) => {
    setUserIdParam(id)
    setConfirmMessage(
      'คุณแน่ใจหรือว่าต้องการลูกค้า ' +
        lineId +
        ' ออกจากระบบ ** หากทำรายการแล้วไม่สามารถยกเลิกได้ **'
    )
    setVisibleDeleteConfirmationDialog(true)
  }
  const handleOnCloseDeleteConfirmationDialog = (userId: string) => {
    setVisibleDeleteConfirmationDialog(false)
    toast.promise(
      deleteCustomer(userId),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          return 'ลบลูกค้าสำเร็จ'
        },
        error: 'ลบลูกค้าไม่สำเร็จ',
      },
      {
        duration: 5000,
      }
    )
  }
  const copyContent = (email: string, password: string) => {
    const text = email.concat(' ').concat(password)
    copyText(text)
  }
  const icon = <CheckBoxOutlineBlank fontSize="small" />
  const checkedIcon = (
    <CheckBox className="MuiCheckbox-icon MuiCheckbox-iconChecked" fontSize="small" />
  )
  const handleAutocompleteChange = (valuesSelect: SelectOption[]) => {
    setSelectCustStatus(valuesSelect)
    setFieldInFormik(valuesSelect)
  }
  const setFieldInFormik = (valuesSelect: SelectOption[]) => {
    const dataFormikCustStatus = valuesSelect.map((item) => {
      return item.value
    })
    formik.setFieldValue('status', dataFormikCustStatus)
  }
  const customerStatusOptions = [
    { value: 'กำลังใช้งาน', label: 'กำลังใช้งาน' },
    { value: 'รอ-เรียกเก็บ', label: 'รอ-เรียกเก็บ' },
    { value: 'รอ-ทวงซ้ำ 1', label: 'รอ-ทวงซ้ำ 1' },
    { value: 'รอ-ทวงซ้ำ 2', label: 'รอ-ทวงซ้ำ 2' },
    { value: 'รอ-หมดอายุ', label: 'รอ-หมดอายุ' },
    { value: 'หมดอายุ', label: 'หมดอายุ' },
  ]
  const customers = (customerList &&
    customerList.data.customer.length > 0 &&
    customerList.data.customer.map((cust) => {
      return (
        <TableRow hover id={`customer__index-${cust.userId}`} key={cust.userId}>
          <TableCell id="customer__user_id">
            <DataWrapper>
              <TextLineClamp>
                {cust.userId}&nbsp;&nbsp;
                <IconButton onClick={() => copyContent(`${cust.userId}`, `${cust.password}`)}>
                  <ContentCopy />
                </IconButton>
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__password">
            <DataWrapper>
              <TextLineClamp>{cust.password}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__line_id">
            <DataWrapper>
              <TextLineClamp>{cust.lineId}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__email">
            <DataWrapper>
              <TextLineClamp>{cust.email}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__status">
            <DataWrapper>
              <TextLineClamp>{cust.customerStatus}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__dayLeft">
            <DataWrapper>
              <TextLineClamp>{cust.dayLeft}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__account">
            <DataWrapper>
              <TextLineClamp>{cust.account}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="customer__actions" className={classes.center}>
            <Tooltip title="ต่ออายุ">
              <IconButton
                onClick={() =>
                  handleExtendUser(`${cust.userId}`, `${cust.lineId}`, `${cust.account}`)
                }
              >
                <ExtendIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="ลบลูกค้าออกจากระบบ">
              <IconButton onClick={() => handleDeleteCustomer(`${cust.userId}`, `${cust.lineId}`)}>
                <DeleteForever />
              </IconButton>
            </Tooltip>
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
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (customerList?.data.pagination) {
      setPage(customerList.data.pagination.page)
      setPageSize(customerList.data.pagination.size)
      setPages(customerList.data.pagination.totalPage)
    }
  }, [customerList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [customerFilter, pages, page, pageSize, refetch])
  return (
    <Page>
      <PageTitle title={t('customer.title')} />
      <Wrapper>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={9}>
            <Typography variant="h6" component="h2">
              {t('customer.searchPanel')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <AlignRight>
              <Button
                id="netflix_account__search_btn"
                variant="contained"
                onClick={() => formik.handleSubmit()}
              >
                {t('button.search')}
              </Button>
              &nbsp;
              <Button
                id="netflix_account__add_btn"
                variant="contained"
                onClick={() => setIsAddNewUserDialogOpen(true)}
              >
                สร้างลูกค้าใหม่
              </Button>
            </AlignRight>
          </Grid>
        </Grid>
        <GridSearchSection container spacing={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              type="text"
              name="userId"
              placeholder="ระบุชื่อรหัสลูกค้าที่ต้องการค้นหา"
              id="customer_list__user_id_input"
              label={t('customer.userId')}
              fullWidth
              value={formik.values.userId}
              onChange={({ target }) => formik.setFieldValue('userId', target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formik.values.userId !== '' ? (
                      <CloseOutlined
                        className={classes.paddingRightBtnClear}
                        onClick={() => {
                          formik.setFieldValue('userId', '')
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
              type="text"
              name="lineId"
              placeholder="ระบุไลน์ไอดีที่ต้องการค้นหา"
              id="customer_list__line_id_input"
              label={t('customer.lineId')}
              fullWidth
              value={formik.values.lineId}
              onChange={({ target }) => formik.setFieldValue('lineId', target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {formik.values.lineId !== '' ? (
                      <CloseOutlined
                        className={classes.paddingRightBtnClear}
                        onClick={() => {
                          formik.setFieldValue('lineId', '')
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
        </GridSearchSection>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              fullWidth
              multiple
              limitTags={1}
              id="customer_list__status_input"
              options={customerStatusOptions}
              disableCloseOnSelect
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                  {option.label}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="สถานะลูกค้า" InputLabelProps={{ shrink: true }} />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    size="small"
                    label={option.label}
                    {...getTagProps({ index })}
                    key={index}
                    className={classes.chipBgPrimary}
                  />
                ))
              }
              value={selectCustStatus || []}
              onChange={(_event, value) => {
                handleAutocompleteChange(value)
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
              value={formik.values.account}
              disabled={moduleAccount !== 'ALL'}
              onChange={({ target }) => formik.setFieldValue('account', target.value)}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="ALL"> ทั้งหมด </MenuItem>
              <MenuItem value="NETFLIX">Netflix</MenuItem>
              <MenuItem value="YOUTUBE">Youtube</MenuItem>
            </TextField>
          </Grid>
        </Grid>
        <TableContainer>
          <Table id="netflix_account_list___table">
            <TableHead>
              <TableRow>
                <TableCell align="center" key="รหัสลูกค้า">
                  <TableHeaderColumn>รหัสลูกค้า</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="รหัสผ่าน">
                  <TableHeaderColumn>รหัสผ่าน</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="lineId">
                  <TableHeaderColumn>Line Id</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="email">
                  <TableHeaderColumn>Email</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="สถานะลูกค้า">
                  <TableHeaderColumn>สถานะลูกค้า</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="จำนวนวัน">
                  <TableHeaderColumn>จำนวนวัน</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="บัญชี">
                  <TableHeaderColumn>บัญชี</TableHeaderColumn>
                </TableCell>
                <TableCell align="center" key="จัดการลูกค้า">
                  <TableHeaderColumn>จัดการลูกค้า</TableHeaderColumn>
                </TableCell>
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{customers}</TableBody>
            )}
          </Table>
        </TableContainer>
        <GridSearchSection container>
          <Grid item xs={12}>
            <Paginate
              pagination={customerList?.data.pagination}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              refetch={refetch}
            />
          </Grid>
        </GridSearchSection>
      </Wrapper>
      <ConfirmDialog
        open={visibleDeleteConfirmationDialog}
        title="ลบลูกค้าออกจากระบบ"
        message={confirmMessage}
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => handleOnCloseDeleteConfirmationDialog(`${userIdParam}`)}
        onCancel={() => setVisibleDeleteConfirmationDialog(false)}
      />
      <ExtendUserDialog
        open={isExtendUserDialogOpen}
        userId={userIdParam}
        account={accountParam}
        lineId={lineIdParam}
        accountType=""
        onClose={() => {
          refetch()
          setIsExtendUserDialogOpen(false)
        }}
      />
      <AddNewUserDialog
        open={isAddNewUserDialogOpen}
        onClose={() => {
          refetch()
          setIsAddNewUserDialogOpen(false)
        }}
      />
    </Page>
  )
}
