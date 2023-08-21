import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  DisabledByDefault as DisableIcon,
  CheckBox as EnableIcon,
  Delete as DeleteIcon,
  AddCircleOutline as ExtendIcon,
  Visibility,
  VisibilityOff,
  SwapHoriz,
  PersonAdd,
  ContentCopy,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ChangeEvent, useEffect, useState } from 'react'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { useParams } from 'react-router-dom'
import {
  DEFAULT_CHANGE_DATE_FORMAT,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  formatDateStringWithPattern,
} from 'utils'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import DatePicker from 'components/DatePicker'
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
import { getYoutubeAccount } from 'services/web-bff/youtube'
import { YoutubeAccountRequest } from 'services/web-bff/youtube.type'
import CheckBoxComponent from 'components/CheckBoxComponent'
import Tooltips from 'components/Tooltips'

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

export default function YoutubeAccount(): JSX.Element {
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
  const { id } = useParams<YoutubeAccountRequest>()
  const [openLoading, setOpenLoading] = useState(true)
  const [isUpdateAccount, setIsUpdateAccount] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [checkedAllUsers, setCheckedAllUsers] = useState<boolean>(false)
  const [isAddNewUserDialogOpen, setIsAddNewUserDialogOpen] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleCloseLoading = () => {
    setOpenLoading(false)
  }
  const {
    data: youtube,
    refetch,
    isFetching,
  } = useQuery('youtube-account', () => getYoutubeAccount({ id }), {
    refetchOnWindowFocus: false,
  })
  const initSelectedChangeDate = dayjs(youtube?.data.changeDate, 'DD/MM')
    .tz(config.timezone)
    .startOf('day')
    .toDate()
  const [selectedChangeDate, setSelectedChangeDate] = useState<Date>(initSelectedChangeDate)
  const formikUpdateAccount = useFormik({
    initialValues: {
      accountId: id,
      changeDate: formatDateStringWithPattern(
        selectedChangeDate?.toString(),
        DEFAULT_CHANGE_DATE_FORMAT
      ),
      password: youtube?.data.password,
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
      console.log(JSON.stringify(values))
    },
  })
  const handleDeleteUser = (id: string) => {
    console.log('Delete user ' + id)
  }
  const handleTransferUser = (accountId: string, accountName: string) => {
    console.log('Transfer user' + accountId + ' to ' + accountName)
  }
  const handleExtendUser = (userId: string, customerName: string, lineId: string) => {
    console.log('Extend user' + lineId + ' to ' + customerName + ' ' + userId)
  }
  const handleChangeCustomerStatus = async (userId: string, status: string) => {
    console.log('Change customer status' + userId + ' ' + status)
  }
  const handleSelectUser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target
    setSelectedUsers([...selectedUsers, id])
    if (!checked) {
      setSelectedUsers(selectedUsers.filter((user) => user !== id))
    }
  }
  const handleSelectAllUser = () => {
    setCheckedAllUsers(!checkedAllUsers)
    if (youtube !== undefined) {
      setSelectedUsers(youtube.data.users.map((user) => user.user.userId))
    }
    if (checkedAllUsers) {
      setSelectedUsers([])
    }
  }
  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    setSelectedChangeDate(
      dayjs(youtube?.data.changeDate, 'DD/MM').tz(config.timezone).startOf('day').toDate()
    )
  }, [youtube, refetch])
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
      <PageTitle title={t('sidebar.youtubeAccount.title')} />
      <Wrapper>
        <GridSearchSection container spacing={1}>
          <GridTextField item xs={9} sm={9}>
            <Typography variant="h6" component="h2">
              {t('youtube.mainInfo.title')}
            </Typography>
          </GridTextField>
          <GridTextField item xs={3} sm={3} className={classes.alignRight}>
            {youtube?.data.accountStatus === 'ปิดการใช้งานชั่วคราว' ? (
              <Button
                id="youtube_detail__enable_btn"
                className={classes.disableButton}
                endIcon={<EnableIcon />}
                variant="contained"
                onClick={() => console.log('xx')}
              >
                {t('button.enabled')}
              </Button>
            ) : (
              <Button
                id="youtube_detail__disable_btn"
                className={classes.disableButton}
                endIcon={<DisableIcon />}
                variant="contained"
                onClick={() => console.log('yy')}
              >
                {t('button.disabled')}
              </Button>
            )}
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              id="youtube_detail_account_name"
              label={t('youtube.mainInfo.accountName')}
              fullWidth
              disabled
              variant="outlined"
              value={youtube?.data.accountName}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6} className={classes.datePickerFromTo}>
            <DatePicker
              className={classes.width100}
              label={t('youtube.mainInfo.changeDate')}
              id="youtube_account__search_input"
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
              id="youtube_detail_email"
              label={t('youtube.mainInfo.email')}
              fullWidth
              disabled
              variant="outlined"
              value={youtube?.data.email}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              id="youtube_detail_password"
              label={t('youtube.mainInfo.password')}
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
              id="youtube_detail_account_status"
              label={t('youtube.mainInfo.accountStatus')}
              fullWidth
              disabled
              variant="outlined"
              value={youtube?.data.accountStatus}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6} />
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              disabled
              id="youtube_detail_created_date"
              label={t('youtube.mainInfo.createdDate')}
              fullWidth
              variant="outlined"
              value={formaDateStringWithPattern(
                youtube?.data.createdDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              disabled
              id="youtube_detail_created_by"
              label={t('youtube.mainInfo.createdBy')}
              fullWidth
              variant="outlined"
              value={youtube?.data.createdBy}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              disabled
              id="youtube_detail_updated_date"
              label={t('youtube.mainInfo.updatedDate')}
              fullWidth
              variant="outlined"
              value={formaDateStringWithPattern(
                youtube?.data.updatedDate,
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={6} sm={6}>
            <TextField
              type="text"
              disabled
              id="youtube_detail_updated_by"
              label={t('youtube.mainInfo.updatedBy')}
              fullWidth
              variant="outlined"
              value={youtube?.data.updatedBy}
              InputLabelProps={{ shrink: true }}
            />
          </GridTextField>
          <GridTextField item xs={9} sm={9} />
          <GridTextField item xs={3} sm={3} className={classes.alignRight}>
            <Button
              id="youtube_detail__update_btn"
              className={classes.addButton}
              variant="contained"
              disabled={!isUpdateAccount}
              onClick={() => handleUpdateAccount()}
            >
              {t('button.update')}
            </Button>
          </GridTextField>
        </GridSearchSection>
      </Wrapper>
      <Wrapper>
        <GridSearchSection container spacing={1}>
          <GridTextField item xs={9} sm={9}>
            <Typography variant="h6" component="h2">
              {t('youtube.user')}
            </Typography>
          </GridTextField>
          <GridTextField item xs={3} sm={3} className={classes.alignRight}>
            <AlignRight>
              <Button
                id="youtube_detail__add_btn"
                disabled={selectedUsers.length === 0}
                className={classes.addButton}
                endIcon={<SwapHoriz />}
                variant="contained"
                onClick={() =>
                  handleTransferUser(`${youtube?.data.accountId}`, `${youtube?.data.accountName}`)
                }
              >
                {t('youtube.transferUser')}
              </Button>
              &nbsp;
              <Button
                id="youtube_detail__add_btn"
                disabled={youtube?.data.users.length === 7}
                className={classes.addButton}
                endIcon={<PersonAdd />}
                variant="contained"
                onClick={() => setIsAddNewUserDialogOpen(true)}
              >
                {t('youtube.addUser')}
              </Button>
            </AlignRight>
          </GridTextField>
        </GridSearchSection>
        <TableContainer>
          <Table id="youtube_user_list___table">
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
              {(youtube &&
                youtube.data.users.length > 0 &&
                youtube.data.users.map((user) => {
                  return (
                    <TableRow hover key={user.user.userId}>
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
                  <TableCell colSpan={9}>
                    <div className={classes.noResultMessage}>
                      ไม่พบข้อมูลลูกค้าภายในบัญชี Youtube นี้
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Wrapper>
    </Page>
  )
}
