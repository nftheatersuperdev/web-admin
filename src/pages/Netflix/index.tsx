import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  Autocomplete,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
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
import { Edit as EditIcon, ContentCopy } from '@mui/icons-material'
import { useHistory } from 'react-router-dom'
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
import DatePicker from 'components/DatePicker'
import PageTitle from 'components/PageTitle'
import {
  ContentSection,
  DataWrapper,
  GridSearchSection,
  SearchButton,
  TextLineClamp,
  TextSmallLineClamp,
  Wrapper,
} from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import Tooltips from 'components/Tooltips'
import {
  NetflixAccountListInputRequest,
  NetflixAccountListRequest,
} from 'services/web-bff/netflix.type'
import { getNetflixAccountList } from 'services/web-bff/netflix'
import AddNewUserDialog from 'pages/NetflixAccount/AddNewUserDialog'
import { getCustomerOptionList } from 'services/web-bff/customer'
import { CustomerOption } from 'services/web-bff/customer.type'
import Paginate from 'components/Paginate'
import AddNewNetflixDialog from './AddNewNetflixDialog'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const AlignRight = styled.div`
  text-align: right;
`

const initSelectedChangeDate = dayjs().tz(config.timezone).startOf('day').toDate()

export default function Netflix(): JSX.Element {
  const useStyles = makeStyles({
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
      marginLeft: '-40px',
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
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const history = useHistory()
  const [isAddNewUserDialogOpen, setIsAddNewUserDialogOpen] = useState(false)
  const [isAddNewAccountDialogOpen, setIsAddNewAccountDialogOpen] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [selectedChangeDate, setSelectedChangeDate] = useState(initSelectedChangeDate)
  const [accountIdParam, setAccountIdParam] = useState<string>('')
  const [accountTypeParam, setAccountTypeParam] = useState<string>('')
  const defaultFilter: NetflixAccountListInputRequest = {
    changeDate: '-',
    userId: '',
    accountName: '',
    isActive: true,
  }
  const [netflixAccountFilter, setNetflixAccountFilter] = useState<NetflixAccountListInputRequest>({
    ...defaultFilter,
  })
  const { data: customerOptionList } = useQuery('customer-option', () => getCustomerOptionList())
  const customerOptions = customerOptionList || []
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
        page: 1,
        size: pageSize,
      } as NetflixAccountListRequest),
    { cacheTime: 10 * (60 * 1000), staleTime: 5 * (60 * 1000) }
  )
  const formik = useFormik({
    initialValues: {
      userId: '',
      changeDate: formatDateStringWithPattern(
        selectedChangeDate?.toString(),
        DEFAULT_CHANGE_DATE_FORMAT
      ),
      accountName: '',
      isActive: true,
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      const updateObj = { ...value } as NetflixAccountListInputRequest
      setNetflixAccountFilter(updateObj)
      setPage(1)
    },
  })
  const headerText: TableHeaderProps[] = [
    {
      text: 'จำนวน User',
    },
    {
      text: 'ชื่อบัญชี',
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
    if (status === 'ว่าง') {
      setAccountIdParam(accountId)
      setAccountTypeParam(type)
      setIsAddNewUserDialogOpen(true)
    }
  }
  const copyContent = (email: string, password: string) => {
    const text = email.concat(' ').concat(password)
    copyText(text)
  }
  const netflixAccount = (netflixAccountList &&
    netflixAccountList.data.netflix.length > 0 &&
    netflixAccountList.data.netflix.map((netflix) => {
      return (
        // Build Table Body
        <TableRow hover id={`netflix_account__index-${netflix.accountId}`} key={netflix.accountId}>
          <TableCell id="netflix_account_slot__id">
            {netflix.users.map((user) => (
              <Tooltips
                type={`${user.accountType}`}
                color={`${user.color}`}
                subTitle={`${user.accountStatus}`}
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
      <TableCell colSpan={5}>
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
  }, [
    netflixAccountFilter,
    pages,
    page,
    pageSize,
    refetch,
    isAddNewUserDialogOpen,
    isAddNewAccountDialogOpen,
  ])

  return (
    <Page>
      <PageTitle title={t('sidebar.netflixAccount.title')} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('netflix.searchPanel')}
          </Typography>
        </ContentSection>
        <GridSearchSection container spacing={1}>
          <Grid item xs={12} sm={3}>
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
                  placeholder="สามารถค้นหาด้วยชื่อ,อีเมลล์,ไลน์ไอดี"
                  InputLabelProps={{ shrink: true }}
                />
              )}
              onChange={(_event, value) => formik.setFieldValue('userId', value?.value)}
            />
          </Grid>
          <Grid item xs={12} sm={2} className={classes.datePickerFromTo}>
            <DatePicker
              label="วันสลับ"
              id="netflix_account__search_input"
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
          <Grid item xs={12} sm={2}>
            <TextField
              type="text"
              name="accountName"
              placeholder="กรุณาระบุชื่อบัญชีที่ต้องการค้นหา"
              id="netflix_add_account_name"
              label={t('netflix.mainInfo.accountName')}
              fullWidth
              value={formik.values.accountName}
              onChange={({ target }) => formik.setFieldValue('accountName', target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              select
              name="accountStatus"
              placeholder="กรุณาเลือกสถานะบัญชี"
              id="netflix_add_account_name"
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
          <Grid item xs={12} sm={3}>
            <AlignRight>
              <SearchButton
                id="netflix_account__search_btn"
                variant="contained"
                onClick={() => formik.handleSubmit()}
              >
                {t('button.search')}
              </SearchButton>
              &nbsp;
              <SearchButton
                id="netflix_account__add_btn"
                variant="contained"
                onClick={() => setIsAddNewAccountDialogOpen(true)}
              >
                สร้างบัญชีใหม่
              </SearchButton>
            </AlignRight>
          </Grid>
        </GridSearchSection>
        <TableContainer>
          <Table id="netflix_account_list___table">
            <DataTableHeader headers={headerText} />
            {isFetchingAccountList ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={6} align="center">
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
        onClose={() => setIsAddNewUserDialogOpen(false)}
      />
      <AddNewNetflixDialog
        open={isAddNewAccountDialogOpen}
        onClose={() => setIsAddNewAccountDialogOpen(false)}
      />
    </Page>
  )
}
