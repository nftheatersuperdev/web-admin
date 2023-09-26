/* eslint-disable react/jsx-key */
import { ChangeEvent, useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  TableHead,
  Backdrop,
  CircularProgress,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Delete as DeleteIcon,
  AddCircleOutline as ExtendIcon,
  ContentCopy,
  Edit as EditIcon,
  PersonRemove,
  LinkOff as LinkOffIcon,
  PersonAdd,
  DisabledByDefault as DisableIcon,
  CheckBox as EnableIcon,
  SwapHoriz,
} from '@mui/icons-material'
import AddIcon from '@mui/icons-material/ControlPoint'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import {
  formaDateStringWithPattern,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_CHANGE_DATE_FORMAT,
  formatDateStringWithPattern,
} from 'utils'
import { copyText } from 'utils/copyContent'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import PageTitle from 'components/PageTitle'
import DatePicker from 'components/DatePicker'
import {
  DataWrapper,
  GridSearchSection,
  GridTextField,
  TextLineClamp,
  TextLineURLClamp,
  Wrapper,
} from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import { NetflixAccountRequest, UpdateNetflixAccountRequest } from 'services/web-bff/netflix.type'
import {
  deleteUserFromAdditionalAccount,
  deleteUserFromNetflixAccount,
  getNetflixAccount,
  unlinkAdditionalAccounts,
  updateNetflixAccount,
  updateNetflixAccountStatus,
} from 'services/web-bff/netflix'
import Tooltips from 'components/Tooltips'
import ConfirmDialog from 'components/ConfirmDialog'
import CheckBoxComponent from 'components/CheckBoxComponent'
import { getNextStatus, updateCustomer } from 'services/web-bff/customer'
import { UpdateCustomerRequest } from 'services/web-bff/customer.type'
import AddNewUserDialog from './AddNewUserDialog'
import AddNewScreenDialog from './AddNewAdditionalScreenDialog'
import ExtendUserDialog from './ExtendUserDialog'
import EditAdditionalScreenDialog from './EditAdditionalScreenDialog'
import TransferUserDialog from './TransferUserDialog'
import ConfirmDeleteDialog from 'components/ConfirmDeleteDialog'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const TableHeaderColumn = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: bold;
  padding-left: 10px;
`
const AlignRight = styled.div`
  text-align: right;
`

export default function NetflixAccount(): JSX.Element {
  const useStyles = makeStyles({
    addButton: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      color: '#fff',
      backgroundColor: '#424E63',
      width: '120px',
    },
    disableButton: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      color: '#fff',
      backgroundColor: '#424E63',
      width: '170px',
    },
    alignRight: {
      textAlign: 'right',
    },
    width110: {
      width: '110px',
    },
    width80: {
      width: '80px',
    },
    hideObject: {
      display: 'none',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    deleteTitle: {
      color: 'red',
    },
    width100: {
      width: '100%',
    },
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16.5px 14px',
      },
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const history = useHistory()
  const { id } = useParams<NetflixAccountRequest>()
  const [showPassword, setShowPassword] = useState(false)
  const [isAddNewUserDialogOpen, setIsAddNewUserDialogOpen] = useState(false)
  const [isAddNewScreenDialogOpen, setIsAddNewScreenDialogOpen] = useState(false)
  const [isExtendUserDialogOpen, setIsExtendUserDialogOpen] = useState(false)
  const [visibleDeleteConfirmationDialog, setVisibleDeleteConfirmationDialog] =
    useState<boolean>(false)
  const [visibleDisableConfirmationDialog, setVisibleDisableConfirmationDialog] =
    useState<boolean>(false)
  const [visibleEnableConfirmationDialog, setVisibleEnableConfirmationDialog] =
    useState<boolean>(false)
  const [visibleDeleteAddConfirmationDialog, setVisibleDeleteAddConfirmationDialog] =
    useState<boolean>(false)
  const [visibleUnlinkConfirmationDialog, setVisibleUnlinkConfirmationDialog] =
    useState<boolean>(false)
  const [visibleUpdateConfirmationDialog, setVisibleUpdateConfirmationDialog] =
    useState<boolean>(false)
  const [visibleChangeStatusDialog, setVisibleChangeStatusDialog] = useState<boolean>(false)
  const [isEditAdditionalScreenDialogOpen, setIsEditAdditionalScreenDialogOpen] =
    useState<boolean>(false)
  const [isTransferUserDialogOpen, setIsTransferUserDialogOpen] = useState<boolean>(false)
  const [isUpdateAccount, setIsUpdateAccount] = useState<boolean>(false)
  const [userIdParam, setUserIdParam] = useState<string>('')
  const [customerNameParam, setCustomerNameParam] = useState<string>('')
  const [accountIdParam, setAccountIdParam] = useState<string>('')
  const [additionalAccountIdParam, setAdditionalAccountIdParam] = useState<string>('')
  const [emailParam, setEmailParam] = useState<string>('')
  const [passwordParam, setPasswordParam] = useState<string>('')
  const [accountParam, setAccountParam] = useState<string>('')
  const [lineIdParam, setLineIdParam] = useState<string>('')
  const [statusParam, setStatusParam] = useState<string>('')
  const [accountTypeParam, setAccountTypeParam] = useState<string>('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [changeStatusTitle, setChangeStatusTitle] = useState<string>('')
  const [changeStatusMsg, setChangeStatusMsg] = useState<string>('')
  const [checkedAllUsers, setCheckedAllUsers] = useState<boolean>(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const [openLoading, setOpenLoading] = useState(true)
  const handleCloseLoading = () => {
    setOpenLoading(false)
  }
  const {
    data: netflix,
    refetch,
    isFetching,
  } = useQuery('netflix-account', () => getNetflixAccount({ id }), {
    refetchOnWindowFocus: false,
  })
  const initSelectedChangeDate = dayjs(netflix?.data.changeDate, 'DD/MM')
    .tz(config.timezone)
    .startOf('day')
    .toDate()

  const [selectedChangeDate, setSelectedChangeDate] = useState<Date>(initSelectedChangeDate)
  const headerAdditionalColumn: TableHeaderProps[] = [
    {
      text: 'ลำดับ',
    },
    {
      text: 'อีเมลล์จอเสริม',
    },
    {
      text: 'รหัสลูกค้า',
    },
    {
      text: 'Line ID',
    },
    {
      text: 'การจัดการจอเสริม',
    },
  ]
  const formikUpdateAccount = useFormik({
    initialValues: {
      accountId: id,
      changeDate: formatDateStringWithPattern(
        selectedChangeDate?.toString(),
        DEFAULT_CHANGE_DATE_FORMAT
      ),
      password: netflix?.data.password,
    },
    validationSchema: Yup.object().shape({
      changeDate: Yup.string()
        .max(255)
        .matches(/^[1-31/0-12]/, 'กรุณาระบุวันสลับให้ตรงรูปแบบเช่น 29/09')
        .required('กรุณาระบุวันสลับ'),
      password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      setVisibleUpdateConfirmationDialog(false)
      toast.promise(
        updateNetflixAccount(
          {
            changeDate: values.changeDate,
            password: values.password,
          } as UpdateNetflixAccountRequest,
          values.accountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            refetch()
            return 'อัพเดตข้อมูลสำเร็จ'
          },
          error: () => {
            return 'อัพเดตข้อมูลไม่สำเร็จ'
          },
        }
      )
    },
  })

  const handleOnCloseDeleteConfirmationDialog = (userId: string, accountId: string) => {
    setVisibleDeleteConfirmationDialog(false)
    toast.promise(
      deleteUserFromNetflixAccount(userId, accountId),
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
  const handleOnCloseDeleteAddConfirmationDialog = (
    userId: string,
    additionalId: string,
    accountId: string
  ) => {
    setVisibleDeleteAddConfirmationDialog(false)
    toast.promise(
      deleteUserFromAdditionalAccount(userId, additionalId, accountId),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          return 'ทำรายการสำเร็จ'
        },
        error: 'ทำรายการไม่สำเร็จ',
      },
      { duration: 5000 }
    )
  }
  const handleOnCloseDiableConfirmationDialog = (accountId: string, status: boolean) => {
    setVisibleDisableConfirmationDialog(false)
    toast.promise(
      updateNetflixAccountStatus(accountId, status),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          return 'ทำรายการสำเร็จ'
        },
        error: 'ทำรายการไม่สำเร็จ',
      },
      { duration: 5000 }
    )
  }
  const handleOnCloseEnableConfirmationDialog = (accountId: string, status: boolean) => {
    setVisibleEnableConfirmationDialog(false)
    toast.promise(
      updateNetflixAccountStatus(accountId, status),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          return 'ทำรายการสำเร็จ'
        },
        error: 'ทำรายการไม่สำเร็จ',
      },
      { duration: 5000 }
    )
  }
  const handleOnCloseUnlinkConfirmationDialog = (accountId: string, additionalId: string) => {
    setVisibleUnlinkConfirmationDialog(false)
    toast.promise(
      unlinkAdditionalAccounts(accountId, additionalId),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          return 'ทำรายการสำเร็จ'
        },
        error: 'ทำรายการไม่สำเร็จ',
      },
      { duration: 5000 }
    )
  }
  const copyContent = (email: string, password: string) => {
    const text = email.concat(' ').concat(password)
    copyText(text)
  }
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  const handleExtendUser = (
    userId: string,
    customerName: string,
    lineId: string,
    device: string
  ) => {
    setUserIdParam(userId)
    setCustomerNameParam(customerName)
    setLineIdParam(lineId)
    setAccountTypeParam(device)
    setIsExtendUserDialogOpen(true)
  }
  const handleDeleteUser = (id: string) => {
    setUserIdParam(id)
    setVisibleDeleteConfirmationDialog(true)
  }
  const handleChangeCustomerStatus = async (userId: string, status: string) => {
    setUserIdParam(userId)
    setChangeStatusTitle('อัพเดตสถานะลูกค้า ' + userId)
    const nextStatus = await getNextStatus(status)
    setChangeStatusMsg(
      `คุณต้องการอัพเดตสถานะลูกค้าจาก '` + status + `' เป็นสถานะ '` + nextStatus + `'`
    )
    setStatusParam(nextStatus)
    setVisibleChangeStatusDialog(true)
  }
  const handleOnCloseChangeStatusDialog = (userId: string, nextStatus: string) => {
    toast.promise(
      updateCustomer({ customerStatus: nextStatus } as UpdateCustomerRequest, userId),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          setVisibleChangeStatusDialog(false)
          return 'อัพเดตสถานะลูกค้าสำเร็จ'
        },
        error: (err) => {
          return 'อัพเดตสถานะลูกค้าไม่สำเร็จ เนื่องจาก ' + err.data.message
        },
      },
      { duration: 5000 }
    )
  }
  const handleDeleteAdditionalUser = (userId: string, additionalId: string, accountId: string) => {
    setAccountIdParam(accountId)
    setUserIdParam(userId)
    setAdditionalAccountIdParam(additionalId)
    setVisibleDeleteAddConfirmationDialog(true)
  }
  const handleUnlinkAdditional = (accountId: string, additionalId: string) => {
    setAccountIdParam(accountId)
    setAdditionalAccountIdParam(additionalId)
    setVisibleUnlinkConfirmationDialog(true)
  }
  const handleAddNewScreenAddition = (id: string, name: string) => {
    setAccountParam(name)
    setAccountIdParam(id)
    setIsAddNewScreenDialogOpen(true)
  }
  const handleDisableAccount = (id: string) => {
    setAccountIdParam(id)
    setVisibleDisableConfirmationDialog(true)
  }
  const handleEnableAccount = (id: string) => {
    setAccountIdParam(id)
    setVisibleEnableConfirmationDialog(true)
  }
  const handleUpdateAccount = () => {
    setVisibleUpdateConfirmationDialog(true)
  }
  const handleEditAddition = (
    accountId: string,
    additionalId: string,
    email: string,
    password: string
  ) => {
    setAccountIdParam(accountId)
    setAdditionalAccountIdParam(additionalId)
    setEmailParam(email)
    setPasswordParam(password)
    setIsEditAdditionalScreenDialogOpen(true)
  }
  const handleSelectAllUser = () => {
    setCheckedAllUsers(!checkedAllUsers)
    if (netflix !== undefined) {
      setSelectedUsers(netflix.data.users.map((user) => user.user.userId))
    }
    if (checkedAllUsers) {
      setSelectedUsers([])
    }
  }
  const handleSelectUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target
    setSelectedUsers([...selectedUsers, id])
    if (!checked) {
      setSelectedUsers(selectedUsers.filter((user) => user !== id))
    }
  }
  const handleTransferUser = (accountId: string, accountName: string) => {
    setAccountIdParam(accountId)
    setAccountParam(accountName)
    setIsTransferUserDialogOpen(true)
  }
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    setSelectedChangeDate(
      dayjs(netflix?.data.changeDate, 'DD/MM').tz(config.timezone).startOf('day').toDate()
    )
  }, [netflix, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <Page>
      {isFetching ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openLoading}
          onClick={handleCloseLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ''
      )}
      <PageTitle title={t('sidebar.netflixAccount.title')} />
      <Wrapper>
        <form onSubmit={formikUpdateAccount.handleSubmit}>
          <GridSearchSection container spacing={1}>
            <GridTextField item xs={9} sm={9}>
              <Typography variant="h6" component="h2">
                {t('netflix.mainInfo.title')}
              </Typography>
            </GridTextField>
            <GridTextField item xs={3} sm={3} className={classes.alignRight}>
              {netflix?.data.isActive ? (
                <Button
                  id="netflix_detail__disable_btn"
                  className={classes.disableButton}
                  endIcon={<DisableIcon />}
                  variant="contained"
                  onClick={() => handleDisableAccount(`${netflix?.data.accountId}`)}
                >
                  {t('button.disabled')}
                </Button>
              ) : (
                <Button
                  id="netflix_detail__enable_btn"
                  className={classes.disableButton}
                  endIcon={<EnableIcon />}
                  variant="contained"
                  onClick={() => handleEnableAccount(`${netflix?.data.accountId}`)}
                >
                  {t('button.enabled')}
                </Button>
              )}
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                type="text"
                id="netflix_detail_account_name"
                label={t('netflix.mainInfo.accountName')}
                fullWidth
                disabled
                variant="outlined"
                value={netflix?.data.accountName}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6} className={classes.datePickerFromTo}>
              <DatePicker
                className={classes.width100}
                label={t('netflix.mainInfo.changeDate')}
                id="netflix_account__search_input"
                name="selectedChangeDate"
                format={DEFAULT_CHANGE_DATE_FORMAT}
                value={selectedChangeDate}
                inputVariant="outlined"
                onChange={(date) => {
                  date && setSelectedChangeDate(date.toDate())
                  formikUpdateAccount.setFieldValue(
                    'changeDate',
                    formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                  )
                  setIsUpdateAccount(true)
                }}
                error={Boolean(
                  formikUpdateAccount.touched.changeDate && formikUpdateAccount.errors.changeDate
                )}
                helperText={
                  formikUpdateAccount.touched.changeDate && formikUpdateAccount.errors.changeDate
                }
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                type="text"
                id="netflix_detail_email"
                label={t('netflix.mainInfo.email')}
                fullWidth
                disabled
                variant="outlined"
                value={netflix?.data.email}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                id="netflix_detail_password"
                label={t('netflix.mainInfo.password')}
                fullWidth
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                InputLabelProps={{ shrink: true }}
                value={formikUpdateAccount.values.password}
                error={Boolean(
                  formikUpdateAccount.touched.password && formikUpdateAccount.errors.password
                )}
                helperText={
                  formikUpdateAccount.touched.password && formikUpdateAccount.errors.password
                }
                onChange={({ target }) => {
                  setIsUpdateAccount(true)
                  formikUpdateAccount.setFieldValue('password', target.value)
                }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                id="netflix_detail_account_status"
                label={t('netflix.mainInfo.accountStatus')}
                fullWidth
                disabled
                variant="outlined"
                value={
                  netflix?.data.isActive
                    ? t('netflix.statuses.active')
                    : t('netflix.statuses.inactive')
                }
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6} />
            <GridTextField item xs={6} sm={6}>
              <TextField
                type="text"
                disabled
                id="netflix_detail_created_date"
                label={t('netflix.mainInfo.createdDate')}
                fullWidth
                variant="outlined"
                value={formaDateStringWithPattern(
                  netflix?.data.createdDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                type="text"
                disabled
                id="netflix_detail_created_by"
                label={t('netflix.mainInfo.createdBy')}
                fullWidth
                variant="outlined"
                value={netflix?.data.createdBy}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                type="text"
                disabled
                id="netflix_detail_updated_date"
                label={t('netflix.mainInfo.updatedDate')}
                fullWidth
                variant="outlined"
                value={formaDateStringWithPattern(
                  netflix?.data.updatedDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={6} sm={6}>
              <TextField
                type="text"
                disabled
                id="netflix_detail_updated_by"
                label={t('netflix.mainInfo.updatedBy')}
                fullWidth
                variant="outlined"
                value={netflix?.data.updatedBy}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={9} sm={9} />
            <GridTextField item xs={3} sm={3} className={classes.alignRight}>
              <Button
                id="netflix_detail__update_btn"
                className={classes.addButton}
                variant="contained"
                disabled={!isUpdateAccount}
                onClick={() => handleUpdateAccount()}
              >
                {t('button.update')}
              </Button>
            </GridTextField>
          </GridSearchSection>
        </form>
      </Wrapper>
      <Wrapper>
        <GridSearchSection container spacing={1}>
          <GridTextField item xs={9} sm={9}>
            <Typography variant="h6" component="h2">
              {t('netflix.additionalAccount')}
            </Typography>
          </GridTextField>
          <GridTextField item xs={3} sm={3} className={classes.alignRight}>
            <Button
              id="netflix_detail__add_btn"
              disabled={netflix?.data.additionalAccounts.length === 2}
              className={classes.addButton}
              endIcon={<AddIcon />}
              variant="contained"
              onClick={() =>
                handleAddNewScreenAddition(
                  `${netflix?.data.accountId}`,
                  `${netflix?.data.accountName}`
                )
              }
            >
              {t('button.addAdditional')}
            </Button>
          </GridTextField>
        </GridSearchSection>
        <TableContainer>
          <Table id="netflix_addition_account_list___table">
            <DataTableHeader headers={headerAdditionalColumn} />
            <TableBody>
              {(netflix &&
                netflix.data.additionalAccounts.length > 0 &&
                netflix.data.additionalAccounts.map((add, index) => {
                  return (
                    <TableRow hover>
                      <TableCell align="center">
                        <TextLineClamp>{index + 1}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <TextLineClamp>
                          {add.email} &nbsp;&nbsp;
                          <IconButton
                            onClick={() => copyContent(`${add.email}`, `${add.password}`)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <TextLineClamp>{add.user?.userId}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <TextLineClamp>{add.user?.lineId}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="ลบลูกค้า">
                          <IconButton
                            disabled={add.user === null}
                            onClick={() =>
                              handleDeleteAdditionalUser(
                                `${add.user.userId}`,
                                `${add.additionalId}`,
                                `${netflix.data.accountId}`
                              )
                            }
                          >
                            <PersonRemove />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="แก้ไขบัญชี">
                          <IconButton
                            onClick={() =>
                              handleEditAddition(
                                `${netflix.data.accountId}`,
                                `${add.additionalId}`,
                                `${add.email}`,
                                `${add.password}`
                              )
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="นำบัญชีเสริมออก">
                          <IconButton
                            onClick={() =>
                              handleUnlinkAdditional(
                                `${netflix.data.accountId}`,
                                `${add.additionalId}`
                              )
                            }
                          >
                            <LinkOffIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })) || (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className={classes.noResultMessage}>
                      ไม่มีอีเมลล์หน้าจอเสริมของบัญชี Netflix นี้
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
      <Wrapper>
        <GridSearchSection container spacing={1}>
          <GridTextField item xs={9} sm={9}>
            <Typography variant="h6" component="h2">
              {t('netflix.user')}
            </Typography>
          </GridTextField>
          <GridTextField item xs={3} sm={3} className={classes.alignRight}>
            <AlignRight>
              <Button
                id="netflix_detail__add_btn"
                disabled={selectedUsers.length === 0}
                className={classes.addButton}
                endIcon={<SwapHoriz />}
                variant="contained"
                onClick={() =>
                  handleTransferUser(`${netflix?.data.accountId}`, `${netflix?.data.accountName}`)
                }
              >
                {t('netflix.transferUser')}
              </Button>
              &nbsp;
              <Button
                id="netflix_detail__add_btn"
                disabled={netflix?.data.users.length === 7}
                className={classes.addButton}
                endIcon={<PersonAdd />}
                variant="contained"
                onClick={() => setIsAddNewUserDialogOpen(true)}
              >
                {t('netflix.addUser')}
              </Button>
            </AlignRight>
          </GridTextField>
        </GridSearchSection>
        <TableContainer>
          <Table id="netflix_addition_account_list___table">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <CheckBoxComponent
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAllUser}
                    isChecked={checkedAllUsers}
                  />
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>ประเภท</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>รหัสลูกค้า</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>ชื่อ Line</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>Line URL</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>วันหมดอายุ</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>สถานะ</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>เพิ่มโดย</TableHeaderColumn>
                </TableCell>
                <TableCell align="center">
                  <TableHeaderColumn>เมนู</TableHeaderColumn>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(netflix &&
                netflix.data.users.length > 0 &&
                netflix.data.users.map((user) => {
                  return (
                    <TableRow hover>
                      <TableCell align="center">
                        <CheckBoxComponent
                          key={user.user.userId}
                          type="checkbox"
                          name={user.user.userId}
                          id={user.user.userId}
                          handleClick={(event: ChangeEvent<HTMLInputElement>) =>
                            handleSelectUser(event)
                          }
                          isChecked={selectedUsers.includes(`${user.user.userId}`)}
                        />
                      </TableCell>
                      <TableCell align="center" className={classes.width80}>
                        <Tooltips
                          type={`${user.accountType}`}
                          color={`${user.color}`}
                          subTitle={`${user.accountStatus}`}
                          display={true}
                        />
                      </TableCell>
                      <TableCell>
                        <TextLineClamp>{user.user?.userId}</TextLineClamp>
                      </TableCell>
                      <TableCell>
                        <TextLineClamp>{user.user?.lineId}</TextLineClamp>
                      </TableCell>
                      <TableCell>
                        <DataWrapper>
                          <TextLineURLClamp>{user.user?.lineUrl}</TextLineURLClamp>
                          <IconButton
                            className={user.user?.lineUrl ? '' : classes.hideObject}
                            onClick={() => openInNewTab(`${user.user.lineUrl}`)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </DataWrapper>
                      </TableCell>
                      <TableCell align="center" className={classes.width110}>
                        <TextLineClamp>{user.user?.dayLeft}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center" className={classes.width110}>
                        <TextLineClamp>{user.user?.customerStatus}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center" className={classes.width110}>
                        <TextLineClamp>{user.addedBy}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="ลบลูกค้า">
                          <IconButton
                            disabled={user.accountType === 'ADDITIONAL'}
                            onClick={() => handleDeleteUser(`${user.user.userId}`)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ปรับสถานะ">
                          <IconButton
                            disabled={user.user.customerStatus === 'กำลังใช้งาน'}
                            onClick={() => {
                              setOpenLoading(true)
                              handleChangeCustomerStatus(
                                `${user.user.userId}`,
                                `${user.user.customerStatus}`
                              )
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ต่ออายุ">
                          <IconButton
                            onClick={() =>
                              handleExtendUser(
                                `${user.user.userId}`,
                                `${user.user.customerName}`,
                                `${user.user.lineId}`,
                                `${user.accountType}`
                              )
                            }
                          >
                            <ExtendIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  )
                })) || (
                <TableRow>
                  <TableCell colSpan={9}>
                    <div className={classes.noResultMessage}>
                      ไม่พบข้อมูลลูกค้าภายในบัญชี Netflix นี้
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
      <br />
      <div className={classes.alignRight}>
        <Button className={classes.addButton} variant="contained" onClick={() => history.goBack()}>
          {t('button.back')}
        </Button>
      </div>
      <AddNewUserDialog
        open={isAddNewUserDialogOpen}
        accountId={id}
        accountType="OTHER"
        isLocked={false}
        onClose={() => {
          refetch()
          setIsAddNewUserDialogOpen(false)
        }}
      />
      <AddNewScreenDialog
        open={isAddNewScreenDialogOpen}
        accountId={accountIdParam}
        accountName={accountParam}
        onClose={() => {
          refetch()
          setIsAddNewScreenDialogOpen(false)
        }}
      />
      <ExtendUserDialog
        open={isExtendUserDialogOpen}
        userId={userIdParam}
        customerName={customerNameParam}
        lineId={lineIdParam}
        accountType={accountTypeParam}
        onClose={() => {
          refetch()
          setIsExtendUserDialogOpen(false)
        }}
      />
      <EditAdditionalScreenDialog
        open={isEditAdditionalScreenDialogOpen}
        accountId={accountIdParam}
        additionalId={additionalAccountIdParam}
        email={emailParam}
        password={passwordParam}
        onClose={() => {
          refetch()
          setIsEditAdditionalScreenDialogOpen(false)
        }}
      />
      <TransferUserDialog
        open={isTransferUserDialogOpen}
        userIds={selectedUsers}
        accountId={accountIdParam}
        accountName={accountParam}
        onClose={() => {
          refetch()
          setIsTransferUserDialogOpen(false)
        }}
      />
      <ConfirmDialog
        open={visibleChangeStatusDialog}
        title={changeStatusTitle}
        message={changeStatusMsg}
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => handleOnCloseChangeStatusDialog(`${userIdParam}`, `${statusParam}`)}
        onCancel={() => setVisibleChangeStatusDialog(false)}
      />
      <ConfirmDeleteDialog
        open={visibleDeleteConfirmationDialog}
        title="ออกจากบัญชี"
        titleBold="ลบลูกค้า"
        message="คุณแน่ใจหรือว่าต้องการลูกค้าออกจากบัญชีนี้"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => handleOnCloseDeleteConfirmationDialog(`${userIdParam}`, `${id}`)}
        onCancel={() => setVisibleDeleteConfirmationDialog(false)}
      />
      <ConfirmDeleteDialog
        open={visibleDeleteAddConfirmationDialog}
        title="ออกจากบัญชี"
        titleBold="ลบลูกค้า"
        message="คุณแน่ใจหรือว่าต้องการลบลูกค้าออกจากบัญชีนี้"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() =>
          handleOnCloseDeleteAddConfirmationDialog(
            `${userIdParam}`,
            `${additionalAccountIdParam}`,
            `${accountIdParam}`
          )
        }
        onCancel={() => setVisibleDeleteAddConfirmationDialog(false)}
      />
      <ConfirmDialog
        open={visibleDisableConfirmationDialog}
        title="ปิดบัญชี Netflix ชั่วคราว"
        message="คุณแน่ใจหรือว่าต้องการปิดบัญชีนี้ชั่วคราว"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => handleOnCloseDiableConfirmationDialog(`${accountIdParam}`, false)}
        onCancel={() => setVisibleDisableConfirmationDialog(false)}
      />
      <ConfirmDialog
        open={visibleEnableConfirmationDialog}
        title="เปิดการใช้งานบัญชี Netflix"
        message="คุณแน่ใจหรือว่าต้องการเปิดการใช้งานบัญชีนี้"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => handleOnCloseEnableConfirmationDialog(`${accountIdParam}`, true)}
        onCancel={() => setVisibleEnableConfirmationDialog(false)}
      />
      <ConfirmDialog
        open={visibleUnlinkConfirmationDialog}
        title="นำบัญชีเสริมออกจากบัญชีนี้"
        message="คุณแน่ใจหรือว่าต้องการนำบัญชีเสริมออกจากบัญชีนี้"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() =>
          handleOnCloseUnlinkConfirmationDialog(`${accountIdParam}`, `${additionalAccountIdParam}`)
        }
        onCancel={() => setVisibleDeleteAddConfirmationDialog(false)}
      />
      <ConfirmDialog
        open={visibleUpdateConfirmationDialog}
        title="อัพเดตบัญชี Netflix"
        message="คุณแน่ใจหรือว่าต้องการอัพเดตบัญชี Netflix นี้"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => formikUpdateAccount.handleSubmit()}
        onCancel={() => setVisibleUpdateConfirmationDialog(false)}
      />
    </Page>
  )
}
