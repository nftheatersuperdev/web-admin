/* eslint-disable react/jsx-key */
import { useEffect, useState } from 'react'
import {
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  CalendarMonth,
  Visibility,
  VisibilityOff,
  Delete as DeleteIcon,
  AddCircleOutline as ExtendIcon,
  ContentCopy,
  Edit as EditIcon,
  PersonRemove,
  PersonAdd,
  DisabledByDefault as DisableIcon,
} from '@mui/icons-material'
import AddIcon from '@mui/icons-material/ControlPoint'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useHistory, useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { formaDateStringWithPattern, DEFAULT_DATETIME_FORMAT_MONTH_TEXT } from 'utils'
import { copyText } from 'utils/copyContent'
import toast from 'react-hot-toast'
import PageTitle from 'components/PageTitle'
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
import { NetflixAccountRequest } from 'services/web-bff/netflix.type'
import {
  deleteUserFromNetflixAccount,
  getNetflixAccount,
  updateNetflixAccount,
} from 'services/web-bff/netflix'
import Tooltips from 'components/Tooltips'
import ConfirmDialog from 'components/ConfirmDialog'
import AddNewUserDialog from './AddNewUserDialog'
import AddNewScreenDialog from './AddNewAdditionalScreenDialog'
import ExtendUserDialog from './ExtendUserDialog'

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
  const [userIdParam, setUserIdParam] = useState<string>('')
  const [customerNameParam, setCustomerNameParam] = useState<string>('')
  const [accountIdParam, setAccountIdParam] = useState<string>('')
  const [accountParam, setAccountParam] = useState<string>('')
  const [lineIdParam, setLineIdParam] = useState<string>('')
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const { data: netflix, refetch } = useQuery('netflix-account', () => getNetflixAccount({ id }))
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
  const headerUserColumn: TableHeaderProps[] = [
    {
      text: 'ประเภท',
    },
    {
      text: 'ชื่อลูกค้า',
    },
    {
      text: 'Line Id',
    },
    {
      text: 'Line URL',
    },
    {
      text: 'วันหมุดอายุ',
    },
    {
      text: 'สถานะ',
    },
    {
      text: 'เพิ่มโดย',
    },
    {
      text: 'การจัดการลูกค้า',
    },
  ]
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
  const handleOnCloseDiableConfirmationDialog = (accountId: string, status: boolean) => {
    setVisibleDisableConfirmationDialog(false)
    toast.promise(
      updateNetflixAccount(accountId, status),
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
  const handleExtendUser = (userId: string, customerName: string, lineId: string) => {
    setUserIdParam(userId)
    setCustomerNameParam(customerName)
    setLineIdParam(lineId)
    setIsExtendUserDialogOpen(true)
  }
  const handleDeleteUser = (id: string) => {
    setUserIdParam(id)
    setVisibleDeleteConfirmationDialog(true)
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
  /**
   * Init pagination depends on data from the API.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [netflix, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <Page>
      <PageTitle title={t('sidebar.netflixAccount.title')} />
      <Wrapper>
        <GridSearchSection container spacing={1}>
          <GridTextField item xs={9} sm={9}>
            <Typography variant="h6" component="h2">
              {t('netflix.mainInfo.title')}
            </Typography>
          </GridTextField>
          <GridTextField item xs={3} sm={3} className={classes.alignRight}>
            <Button
              id="netflix_detail__disable_btn"
              className={classes.disableButton}
              endIcon={<DisableIcon />}
              variant="contained"
              onClick={() => handleDisableAccount(`${netflix?.data.accountId}`)}
            >
              {t('button.disabled')}
            </Button>
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              id="netflix_detail_account_name"
              label={t('netflix.mainInfo.accountName')}
              fullWidth
              variant="outlined"
              value={netflix?.data.accountName}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              id="netflix_detail_change_date"
              label={t('netflix.mainInfo.changeDate')}
              fullWidth
              variant="outlined"
              value={netflix?.data.changeDate}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarMonth />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              id="netflix_detail_account_name"
              label={t('netflix.mainInfo.email')}
              fullWidth
              variant="outlined"
              value={netflix?.data.email}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              id="netflix_detail_account_name"
              label={t('netflix.mainInfo.password')}
              fullWidth
              variant="outlined"
              value={netflix?.data.password}
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
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              id="netflix_detail_account_name"
              label={t('netflix.mainInfo.accountStatus')}
              fullWidth
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
        </GridSearchSection>
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
                      <TableCell>
                        <TextLineClamp>
                          {add.email} &nbsp;&nbsp;
                          <IconButton
                            onClick={() => copyContent(`${add.email}`, `${add.password}`)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </TextLineClamp>
                      </TableCell>
                      <TableCell>
                        <TextLineClamp>{add.user?.userId}</TextLineClamp>
                      </TableCell>
                      <TableCell>
                        <TextLineClamp>{add.user?.lineId}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton>
                          <PersonRemove />
                        </IconButton>
                        <IconButton>
                          <DeleteIcon />
                        </IconButton>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
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
          </GridTextField>
        </GridSearchSection>
        <TableContainer>
          <Table id="netflix_addition_account_list___table">
            <DataTableHeader headers={headerUserColumn} />
            <TableBody>
              {(netflix &&
                netflix.data.users.length > 0 &&
                netflix.data.users.map((user) => {
                  return (
                    <TableRow hover>
                      <TableCell align="center" className={classes.width80}>
                        <Tooltips
                          type={`${user.accountType}`}
                          color={`${user.color}`}
                          subTitle={`${user.accountStatus}`}
                        />
                      </TableCell>
                      <TableCell>
                        <TextLineClamp>{user.user?.customerName}</TextLineClamp>
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
                        <TextLineClamp>{user.accountStatus}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center" className={classes.width110}>
                        <TextLineClamp>{user.addedBy}</TextLineClamp>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="ลบลูกค้า">
                          <IconButton onClick={() => handleDeleteUser(`${user.user.userId}`)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ต่ออายุ">
                          <IconButton
                            onClick={() =>
                              handleExtendUser(
                                `${user.user.userId}`,
                                `${user.user.customerName}`,
                                `${user.user.lineId}`
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
                  <TableCell colSpan={8}>
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
        onClose={() => setIsAddNewUserDialogOpen(false)}
      />
      <AddNewScreenDialog
        open={isAddNewScreenDialogOpen}
        accountId={accountIdParam}
        accountName={accountParam}
        onClose={() => setIsAddNewScreenDialogOpen(false)}
      />
      <ExtendUserDialog
        open={isExtendUserDialogOpen}
        userId={userIdParam}
        customerName={customerNameParam}
        lineId={lineIdParam}
        onClose={() => setIsExtendUserDialogOpen(false)}
      />
      <ConfirmDialog
        open={visibleDeleteConfirmationDialog}
        title="ลบลูกค้าออกจากบัญชีนี้"
        message="คุณแน่ใจหรือว่าต้องการลูกค้าออกจากบัญชีนี้"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => handleOnCloseDeleteConfirmationDialog(`${userIdParam}`, `${id}`)}
        onCancel={() => setVisibleDeleteConfirmationDialog(false)}
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
    </Page>
  )
}
