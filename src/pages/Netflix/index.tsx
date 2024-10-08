import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material'
import {
  Edit as EditIcon,
  ContentCopy,
  CheckBox,
  CheckBoxOutlineBlank,
  CloseOutlined,
} from '@mui/icons-material'
import { useHistory, useLocation } from 'react-router-dom'
import { copyText } from 'utils/copyContent'
import { makeStyles } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { DEFAULT_CHANGE_DATE_FORMAT, formatDateStringWithPattern } from 'utils'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import DatePicker from 'components/DatePicker'
import PageTitle from 'components/PageTitle'
import {
  DataWrapper,
  GridSearchSection,
  TextLineClamp,
  TextSmallLineClamp,
  Wrapper,
} from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import Tooltips from 'components/Tooltips'
import {
  GetNetflixPackageResponse,
  NetflixAccountListInputRequest,
  NetflixAccountListRequest,
} from 'services/web-bff/netflix.type'
import { getNetflixAccountList, getNetflixPackage } from 'services/web-bff/netflix'
import AddNewUserDialog from 'pages/NetflixAccount/AddNewUserDialog'
import { getCustomerOptionList } from 'services/web-bff/customer'
import { CustomerOption } from 'services/web-bff/customer.type'
import Paginate from 'components/Paginate'
import AddNewNetflixDialog from './AddNewNetflixDialog'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const initDate = dayjs().tz(config.timezone).startOf('day').toDate()

const AlignRight = styled.div`
  text-align: right;
`
const CheckBoxGroupLabel = styled(FormLabel)`
  font-size: 12px;
`

interface SelectOption {
  label: string
  value: string
}

export default function Netflix(): JSX.Element {
  const useStyles = makeStyles({
    hideObject: {
      display: 'none',
    },
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16.5px 14px',
      },
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
  const history = useHistory()
  const searchParams = useLocation().search
  const queryString = new URLSearchParams(searchParams)
  const queryChangeDate = queryString.get('changeDate')
  const queryBillDate = queryString.get('billDate')
  const queryCustStatus = queryString.get('customerStatus')
  const [isAddNewUserDialogOpen, setIsAddNewUserDialogOpen] = useState(false)
  const [isAddNewAccountDialogOpen, setIsAddNewAccountDialogOpen] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selectedChangeDate, setSelectedChangeDate] = useState(initDate)
  const [selectedBillDate, setSelectedBillDate] = useState(initDate)
  const [accountIdParam, setAccountIdParam] = useState('')
  const [accountTypeParam, setAccountTypeParam] = useState('')
  const [packageParam, setPackageParam] = useState<GetNetflixPackageResponse>()
  const [selectCustStatus, setSelectCustStatus] = useState<{ value: string; label: string }[]>([])
  const defaultFilter: NetflixAccountListInputRequest = {
    changeDate: queryChangeDate || '-',
    billDate: queryBillDate || '-',
    userId: '',
    accountName: '',
    accountEmail: '',
    isActive: true,
    customerStatus: queryCustStatus !== null ? [queryCustStatus] : [],
    filterTVAvailable: true,
    filterOtherAvailable: true,
    filterAdditionalAvailable: true,
  }
  const [netflixAccountFilter, setNetflixAccountFilter] = useState<NetflixAccountListInputRequest>({
    ...defaultFilter,
  })
  const { data: customerOptionList } = useQuery(
    'customer-option',
    () => getCustomerOptionList('NETFLIX'),
    {
      refetchOnWindowFocus: false,
    }
  )
  const customerOptions = customerOptionList || []
  const netflixTVPackageOption = useQuery('netflix-tv-package', () => getNetflixPackage('TV'))
  const netflixOtherPackageOption = useQuery('netflix-other-package', () =>
    getNetflixPackage('OTHER')
  )
  const tvPackageOptions = netflixTVPackageOption || []
  const otherPackageOptions = netflixOtherPackageOption || []
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: CustomerOption) => option.filterLabel,
  })
  const {
    data: netflixAccountList,
    refetch,
    isFetching: isFetchingAccountList,
  } = useQuery(
    'netflix-account-list',
    () =>
      getNetflixAccountList({
        data: netflixAccountFilter,
        page,
        size: pageSize,
      } as NetflixAccountListRequest),
    {
      refetchOnWindowFocus: false,
    }
  )
  const formik = useFormik({
    initialValues: {
      userId: '',
      changeDate: formatDateStringWithPattern(
        selectedChangeDate?.toString(),
        DEFAULT_CHANGE_DATE_FORMAT
      ),
      billDate: formatDateStringWithPattern(
        selectedBillDate?.toString(),
        DEFAULT_CHANGE_DATE_FORMAT
      ),
      accountName: '',
      accountEmail: '',
      isActive: true,
      customerStatus: [],
      filterTVAvailable: true,
      filterOtherAvailable: true,
      filterAdditionalAvailable: true,
    },
    enableReinitialize: false,
    onSubmit: (value) => {
      const updateObj = { ...value } as NetflixAccountListInputRequest
      setNetflixAccountFilter(updateObj)
      setPage(1)
    },
  })
  const customerStatusOptions = [
    { value: 'กำลังใช้งาน', label: 'กำลังใช้งาน' },
    { value: 'รอ-เรียกเก็บ', label: 'รอ-เรียกเก็บ' },
    { value: 'รอ-ทวงซ้ำ 1', label: 'รอ-ทวงซ้ำ 1' },
    { value: 'รอ-ทวงซ้ำ 2', label: 'รอ-ทวงซ้ำ 2' },
    { value: 'รอ-หมดอายุ', label: 'รอ-หมดอายุ' },
    { value: 'หมดอายุ', label: 'หมดอายุ' },
  ]
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
    formik.setFieldValue('customerStatus', dataFormikCustStatus)
  }
  const headerText: TableHeaderProps[] = [
    {
      text: 'จำนวน User',
    },
    {
      text: 'ชื่อบัญชี',
    },
    {
      text: 'รอบบิล',
    },
    {
      text: 'วันสลับ',
    },
    {
      text: 'อีเมลล์',
    },
    {
      text: 'สถานะบัญชี',
    },
    {
      text: 'จัดการบัญชี',
    },
  ]
  const handleClickIcon = (type: string, status: string, accountId: string) => {
    console.log(`handleClickIcon : ` + status + ` : ` + accountId + ` : ` + type)
    if (status === 'ว่าง') {
      setAccountIdParam(accountId)
      setAccountTypeParam(type)
      if (type === 'OTHER') {
        setPackageParam(otherPackageOptions.data)
      } else {
        setPackageParam(tvPackageOptions.data)
      }
      setIsAddNewUserDialogOpen(true)
    } else if (status === 'ยังไม่เปิดจอเสริม') {
      toast.error('ไม่สามารถทำรายการได้ เนื่องจากยังไม่เปิดจอเสริม')
    }
  }
  const handleAccountNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('accountName', value)
  }
  const handleAccountEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('accountEmail', value)
  }
  const copyContent = (email: string, password: string) => {
    const text = email.concat(' ').concat(password)
    copyText(text)
  }
  const allEmail: string[] = []
  const copyAllEmail = () => {
    copyText(allEmail.toString().replaceAll(',', ''))
  }
  const displayTooltip = (type: string, status: string) => {
    if (type === 'TV') {
      return true
    } else if (
      type === 'ADDITIONAL' &&
      formik.values.filterAdditionalAvailable
      // && (status === 'ว่าง' || status === 'ยังไม่เปิดจอเสริม')
    ) {
      return true
    } else if (type === 'OTHER' && formik.values.filterOtherAvailable) {
      return true
    }
  }
  const netflixAccount = (netflixAccountList &&
    netflixAccountList.data.netflix.length > 0 &&
    netflixAccountList.data.netflix.map((netflix) => {
      // Build all email
      allEmail.push(netflix.email)
      allEmail.push('\n')
      allEmail.push(netflix.password)
      allEmail.push('\n')
      return (
        // Build Table Body
        <TableRow hover id={`netflix_account__index-${netflix.accountId}`} key={netflix.accountId}>
          <TableCell id="netflix_account_slot__id">
            {netflix.users.map((user, i) => (
              <Tooltips
                key={i}
                type={`${user.accountType}`}
                color={`${user.color}`}
                subTitle={`${user.accountStatus}`}
                display={displayTooltip(`${user.accountType}`, `${user.accountStatus}`)}
                onClick={() =>
                  handleClickIcon(
                    `${user.accountType}`,
                    `${user.accountStatus}`,
                    `${netflix.accountId}`
                  )
                }
              />
            ))}
          </TableCell>
          <TableCell id="netflix_account_name__id">
            <DataWrapper>
              <TextLineClamp>{netflix.accountName}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="netflix_bill_date__id">
            <DataWrapper>
              <TextLineClamp>{netflix.billDate}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="netflix_account_change_date__id" align="center">
            <DataWrapper>
              <TextSmallLineClamp>{netflix.changeDate}</TextSmallLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="netflix_account_email__id">
            <DataWrapper>
              <TextLineClamp>
                {netflix.email} &nbsp;&nbsp;
                <IconButton onClick={() => copyContent(`${netflix.email}`, `${netflix.password}`)}>
                  <ContentCopy />
                </IconButton>
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="netflix_account_email__id">
            <DataWrapper>
              <TextLineClamp>
                {netflix.isActive ? (
                  <Chip
                    size="small"
                    label={t('netflix.statuses.active')}
                    className={classes.chipGreen}
                  />
                ) : (
                  <Chip
                    size="small"
                    label={t('netflix.statuses.inactive')}
                    className={classes.chipGrey}
                  />
                )}
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell align="center">
            <TextSmallLineClamp>
              <IconButton onClick={() => history.push(`/netflix/${netflix.accountId}`)}>
                <EditIcon />
              </IconButton>
            </TextSmallLineClamp>
          </TableCell>
        </TableRow>
      )
    })) || (
    <TableRow>
      <TableCell colSpan={7}>
        <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
      </TableCell>
    </TableRow>
  )
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (netflixAccountList?.data.pagination) {
      setPage(netflixAccountList.data.pagination.page)
      setPageSize(netflixAccountList.data.pagination.size)
      setPages(netflixAccountList.data.pagination.totalPage)
    }
  }, [netflixAccountList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [netflixAccountFilter, pages, page, pageSize, refetch])
  useEffect(() => {
    if (queryCustStatus !== null) {
      setSelectCustStatus([{ value: queryCustStatus, label: queryCustStatus }])
    }
    if (queryChangeDate !== null) {
      const year = new Date().getFullYear()
      const [day, month] = queryChangeDate.split('/')
      setSelectedChangeDate(new Date(+year, +month - 1, +day))
    } else if (selectedChangeDate !== null) {
      setSelectedChangeDate(selectedChangeDate)
    } else {
      setSelectedChangeDate(new Date())
    }
    if (queryBillDate !== null) {
      const year = new Date().getFullYear()
      const [day, month] = queryBillDate.split('/')
      setSelectedBillDate(new Date(+year, +month - 1, +day))
    } else if (selectedBillDate !== null) {
      setSelectedBillDate(selectedBillDate)
    } else {
      setSelectedBillDate(new Date())
    }
  }, [queryCustStatus, queryChangeDate, selectedChangeDate, queryBillDate, selectedBillDate])
  return (
    <Page>
      <PageTitle title={t('sidebar.netflixAccount.title')} />
      <Wrapper>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="h2">
              {t('netflix.searchPanel')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
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
                onClick={() => setIsAddNewAccountDialogOpen(true)}
              >
                สร้างบัญชีใหม่
              </Button>
              &nbsp;
              <Button
                id="netflix_account__search_btn"
                variant="contained"
                disabled={isFetchingAccountList && allEmail.length === 0}
                onClick={() => copyAllEmail()}
              >
                คัดลอก Email ทั้งหมด
              </Button>
            </AlignRight>
          </Grid>
        </Grid>
        <GridSearchSection container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              options={customerOptions}
              getOptionLabel={(option) => (option ? option.label : '')}
              filterOptions={filterOptions}
              noOptionsText="ไม่พบข้อมูลลูกค้า"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t('netflix.customer')}
                  variant="outlined"
                  placeholder="ค้นหาด้วยรหัสลูกค้า,ไลน์ไอดี,อีเมลล์"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              onChange={(_event, value) => formik.setFieldValue('userId', value?.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              disabled={isFetchingAccountList}
              type="text"
              name="accountName"
              placeholder="ระบุชื่อบัญชีที่ต้องการค้นหา"
              id="netflix_account_list__account_name_input"
              label={t('netflix.mainInfo.accountName')}
              fullWidth
              value={formik.values.accountName}
              onChange={handleAccountNameChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: <InputAdornment position="start">NF-</InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    {formik.values.accountName !== '' ? (
                      <CloseOutlined
                        className={classes.paddingRightBtnClear}
                        onClick={() => {
                          formik.setFieldValue('accountName', '')
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
              disabled={isFetchingAccountList}
              select
              name="accountStatus"
              placeholder="เลือกสถานะบัญชี"
              id="netflix_account_list__account_status_input"
              label={t('netflix.mainInfo.accountStatus')}
              fullWidth
              variant="outlined"
              value={formik.values.isActive}
              onChange={({ target }) => formik.setFieldValue('isActive', target.value)}
              InputLabelProps={{ shrink: true }}
            >
              <MenuItem value="true">{t('netflix.statuses.active')}</MenuItem>
              <MenuItem value="false">{t('netflix.statuses.inactive')}</MenuItem>
            </TextField>
          </Grid>
        </GridSearchSection>
        <GridSearchSection container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Autocomplete
              disabled={isFetchingAccountList}
              fullWidth
              multiple
              limitTags={1}
              id="netflix_account_list__customer_status_input"
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
                <TextField
                  {...params}
                  label="สถานะลูกค้า"
                  placeholder="เลือกสถานะลูกค้า"
                  InputLabelProps={{ shrink: true }}
                />
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
              disabled={isFetchingAccountList}
              type="text"
              name="accountEmail"
              placeholder="ระบุอีเมลล์บัญชีที่ต้องการค้นหา"
              id="netflix_account_list__email_account_input"
              label="อีเมลล์บ้าน"
              fullWidth
              value={formik.values.accountEmail}
              onChange={handleAccountEmailChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </GridSearchSection>
        <GridSearchSection container spacing={1}>
          <Grid item xs={12} sm={4} className={classes.datePickerFromTo}>
            <DatePicker
              disabled={isFetchingAccountList}
              label="รอบบิล"
              id="netflix_account_list__bill_date_input"
              name="selectedBillDate"
              format={DEFAULT_CHANGE_DATE_FORMAT}
              value={selectedBillDate}
              inputVariant="outlined"
              onChange={(date) => {
                date && setSelectedBillDate(date.toDate())
                formik.setFieldValue(
                  'billDate',
                  formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                )
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} className={classes.datePickerFromTo}>
            <DatePicker
              disabled={isFetchingAccountList}
              label="วันสลับ"
              id="netflix_account_list__change_date_input"
              name="selectedChangeDate"
              format={DEFAULT_CHANGE_DATE_FORMAT}
              value={selectedChangeDate}
              inputVariant="outlined"
              onChange={(date) => {
                date && setSelectedChangeDate(date.toDate())
                formik.setFieldValue(
                  'changeDate',
                  formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                )
              }}
            />
          </Grid>
        </GridSearchSection>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <CheckBoxGroupLabel>เลือกกรองอุปกรณ์ที่ว่าง</CheckBoxGroupLabel>
              <FormGroup aria-label="position" row>
                {/* <FormControlLabel
                  control={
                    <Checkbox
                      key="TV"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        formik.setFieldValue('filterTVAvailable', event.target.checked)
                      }}
                      name="filterDevice"
                      color="primary"
                      value={formik.values.filterTVAvailable}
                      checked={formik.values.filterTVAvailable}
                    />
                  }
                  label="ทีวี"
                  key="TV"
                /> */}
                <FormControlLabel
                  control={
                    <Checkbox
                      key="ADDITIONAL"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        formik.setFieldValue('filterAdditionalAvailable', event.target.checked)
                      }}
                      name="filterDevice"
                      color="primary"
                      value={formik.values.filterAdditionalAvailable}
                      checked={formik.values.filterAdditionalAvailable}
                    />
                  }
                  label="จอเสริม"
                  key="ADDITIONAL"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      key="OTHER"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        formik.setFieldValue('filterOtherAvailable', event.target.checked)
                      }}
                      name="filterDevice"
                      color="primary"
                      value={formik.values.filterOtherAvailable}
                      checked={formik.values.filterOtherAvailable}
                    />
                  }
                  label="อุปกรณ์อื่นๆ"
                  key="OTHER"
                />
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
        <br />
        <TableContainer>
          <Table id="netflix_account_list___table">
            <DataTableHeader headers={headerText} />
            {isFetchingAccountList ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{netflixAccount}</TableBody>
            )}
          </Table>
        </TableContainer>
        <GridSearchSection container>
          <Grid item xs={12}>
            <Paginate
              pagination={netflixAccountList?.data.pagination}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              refetch={refetch}
            />
          </Grid>
        </GridSearchSection>
      </Wrapper>
      <AddNewUserDialog
        open={isAddNewUserDialogOpen}
        accountId={accountIdParam}
        accountType={accountTypeParam}
        packageOptions={packageParam}
        isLocked={true}
        onClose={() => {
          refetch()
          setIsAddNewUserDialogOpen(false)
        }}
      />
      <AddNewNetflixDialog
        open={isAddNewAccountDialogOpen}
        onClose={() => {
          refetch()
          setIsAddNewAccountDialogOpen(false)
        }}
      />
    </Page>
  )
}
