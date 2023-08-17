/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material'
import { Edit as EditIcon, ContentCopy, CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
import { DEFAULT_CHANGE_DATE_FORMAT } from 'utils'
import { useEffect, useState } from 'react'
import { copyText } from 'utils/copyContent'
import { useHistory } from 'react-router-dom'
import DatePicker from 'components/DatePicker'
import PageTitle from 'components/PageTitle'
import {
  ContentSection,
  DataWrapper,
  GridSearchSection,
  TextLineClamp,
  TextSmallLineClamp,
  Wrapper,
} from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import { getCustomerOptionList } from 'services/web-bff/customer'
import { CustomerOption } from 'services/web-bff/customer.type'
import {
  YoutubeAccountListInputRequest,
  YoutubeAccountListRequest,
} from 'services/web-bff/youtube.type'
import { getYoutubeAccountList } from 'services/web-bff/youtube'
import Tooltips from 'components/Tooltips'
import Paginate from 'components/Paginate'
import AddNewUserDialog from 'pages/YoutubeAccount/AddNewUserDialog'
import AddNewYoutubeDialog from './AddNewYoutubeDialog'

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

export default function Youtube(): JSX.Element {
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
  const [isAddNewAccountDialogOpen, setIsAddNewAccountDialogOpen] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [accountIdParam, setAccountIdParam] = useState<string>('')
  const [selectedChangeDate, setSelectedChangeDate] = useState<Date>()
  const [isAddNewUserDialogOpen, setIsAddNewUserDialogOpen] = useState(false)
  const [selectCustStatus, setSelectCustStatus] = useState<{ value: string; label: string }[]>([])
  const defaultFilter: YoutubeAccountListInputRequest = {
    changeDate: '-',
    userId: '',
    accountName: '',
    accountStatus: '',
    customerStatus: [],
  }
  const [youtubeAccountFilter, setYoutubeAccountFilter] = useState<YoutubeAccountListInputRequest>({
    ...defaultFilter,
  })
  const { data: customerOptionList } = useQuery('customer-option', () => getCustomerOptionList(), {
    refetchOnWindowFocus: false,
  })
  const customerOptions = customerOptionList || []
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: CustomerOption) => option.filterLabel,
  })
  const {
    data: youtubeAccountList,
    refetch,
    isFetching: isFetchingAccountList,
  } = useQuery(
    'youtube-account-list',
    () =>
      getYoutubeAccountList({
        data: youtubeAccountFilter,
        page: 1,
        size: pageSize,
      } as YoutubeAccountListRequest),
    {
      refetchOnWindowFocus: false,
    }
  )
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
    // formik.setFieldValue('customerStatus', dataFormikCustStatus)
  }
  const getChipStatus = (status: string) => {
    return <Chip size="small" label={status} className={classes.chipGreen} />
  }
  const copyContent = (email: string, password: string) => {
    const text = email.concat(' ').concat(password)
    copyText(text)
  }
  const handleClickIcon = (type: string, accountId: string) => {
    setAccountIdParam(accountId)
    setIsAddNewUserDialogOpen(true)
  }
  const youtubeAccount = (youtubeAccountList &&
    youtubeAccountList.data.youtube.length > 0 &&
    youtubeAccountList.data.youtube.map((youtube) => {
      return (
        // Build Table Body
        <TableRow hover id={`youtube_account__index-${youtube.accountId}`} key={youtube.accountId}>
          <TableCell id="youtube_account_slot__id">
            {youtube.users.map((user, i) => (
              <Tooltips
                key={i}
                type={`${user.accountType}`}
                color={`${user.color}`}
                subTitle={`${user.accountStatus}`}
                onClick={() => handleClickIcon(`${user.accountType}`, `${youtube.accountId}`)}
              />
            ))}
          </TableCell>
          <TableCell id="youtube_account_name__id">
            <DataWrapper>
              <TextLineClamp>{youtube.accountName}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="youtube_account_change_date__id" align="center">
            <DataWrapper>
              <TextSmallLineClamp>{youtube.changeDate}</TextSmallLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="youtube_account_email__id">
            <DataWrapper>
              <TextLineClamp>
                {youtube.email} &nbsp;&nbsp;
                <IconButton onClick={() => copyContent(`${youtube.email}`, `${youtube.password}`)}>
                  <ContentCopy />
                </IconButton>
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="youtube_account_email__id">
            <DataWrapper>
              <TextLineClamp>{getChipStatus(`${youtube.accountStatus}`)}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell align="center">
            <TextSmallLineClamp>
              <IconButton onClick={() => history.push(`/youtube/${youtube.accountId}`)}>
                <EditIcon />
              </IconButton>
            </TextSmallLineClamp>
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
    if (youtubeAccountList?.data.pagination) {
      setPage(youtubeAccountList.data.pagination.page)
      setPageSize(youtubeAccountList.data.pagination.size)
      setPages(youtubeAccountList.data.pagination.totalPage)
    }
  }, [youtubeAccountList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [youtubeAccountFilter, pages, page, pageSize, refetch])
  return (
    <Page>
      <PageTitle title={t('sidebar.youtubeAccount.title')} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('youtube.searchPanel')}
          </Typography>
          <Grid item xs={12} sm={3}>
            <AlignRight>
              <Button
                id="youtube_account__search_btn"
                variant="contained"
                // onClick={() => formik.handleSubmit()}
              >
                {t('button.search')}
              </Button>
              &nbsp;
              <Button
                id="youtube_account__add_btn"
                variant="contained"
                onClick={() => setIsAddNewAccountDialogOpen(true)}
              >
                สร้างบัญชีใหม่
              </Button>
            </AlignRight>
          </Grid>
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
                    label={t('youtube.customer')}
                    variant="outlined"
                    placeholder="ค้นหาด้วยรหัสลูกค้า,ไลน์ไอดี,อีเมลล์"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                // onChange={(_event, value) => formik.setFieldValue('userId', value?.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2} className={classes.datePickerFromTo}>
              <DatePicker
                label="วันสลับ"
                id="youtube_account_list__change_date_input"
                name="selectedChangeDate"
                format={DEFAULT_CHANGE_DATE_FORMAT}
                value={selectedChangeDate}
                inputVariant="outlined"
                // onChange={(date) => {
                //   date && setSelectedChangeDate(date.toDate())
                //   formik.setFieldValue(
                //     'changeDate',
                //     formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                //   )
                // }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                select
                name="accountStatus"
                placeholder="เลือกสถานะบัญชี"
                id="youtube_account_list__account_status_input"
                label={t('youtube.mainInfo.accountStatus')}
                fullWidth
                variant="outlined"
                // value={formik.values.isActive}
                // onChange={({ target }) => formik.setFieldValue('isActive', target.value)}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="active">{t('youtube.statuses.active')}</MenuItem>
                <MenuItem value="inactive">{t('youtube.statuses.inactive')}</MenuItem>
                <MenuItem value="appeal">{t('youtube.statuses.appeal')}</MenuItem>
                <MenuItem value="renew">{t('youtube.statuses.renew')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Autocomplete
                fullWidth
                multiple
                limitTags={1}
                id="youtube_account_list__customer_status_input"
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
          </GridSearchSection>
          <TableContainer>
            <Table id="youtube_account_list___table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <TableHeaderColumn>จำนวน User</TableHeaderColumn>
                  </TableCell>
                  <TableCell align="center">
                    <TableHeaderColumn>ชื่อบัญชี</TableHeaderColumn>
                  </TableCell>
                  <TableCell align="center">
                    <TableHeaderColumn>วันสลับ</TableHeaderColumn>
                  </TableCell>
                  <TableCell align="center">
                    <TableHeaderColumn>อีเมลล์</TableHeaderColumn>
                  </TableCell>
                  <TableCell align="center">
                    <TableHeaderColumn>สถานะบัญชี</TableHeaderColumn>
                  </TableCell>
                  <TableCell align="center">
                    <TableHeaderColumn>จัดการบัญชี</TableHeaderColumn>
                  </TableCell>
                </TableRow>
              </TableHead>
              {isFetchingAccountList ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <TableBody>{youtubeAccount}</TableBody>
              )}
            </Table>
          </TableContainer>
          <GridSearchSection container>
            <Grid item xs={12}>
              <Paginate
                pagination={youtubeAccountList?.data.pagination}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                refetch={refetch}
              />
            </Grid>
          </GridSearchSection>
        </ContentSection>
      </Wrapper>
      <AddNewYoutubeDialog
        open={isAddNewAccountDialogOpen}
        onClose={() => setIsAddNewAccountDialogOpen(false)}
      />
      <AddNewUserDialog
        open={isAddNewUserDialogOpen}
        accountId={accountIdParam}
        onClose={() => setIsAddNewUserDialogOpen(false)}
      />
    </Page>
  )
}
