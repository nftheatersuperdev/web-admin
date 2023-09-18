/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Modal,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { getAccountTypeOptions } from 'constant/PackageOption'
import { copyText } from 'utils/copyContent'
import { GridTextField } from 'components/Styled'
import { getCustomerOptionList, createCustomer, isUrlDeplicate } from 'services/web-bff/customer'
import {
  CreateCustomerRequest,
  CreateCustomerResponseAPI,
  CustomerOption,
} from 'services/web-bff/customer.type'
import { getNetflixPackage, linkUserToNetflixAccount } from 'services/web-bff/netflix'
import { UpdateLinkUserNetflixRequest } from 'services/web-bff/netflix.type'

interface AddNewUserDialogProps {
  open: boolean
  accountId: string
  accountType?: string
  isLocked?: boolean
  onClose: () => void
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export const TextSmallLineClamp = styled.div`
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow-wrap: break-word;
`

export default function AddNewUserDialog(props: AddNewUserDialogProps): JSX.Element {
  const useStyles = makeStyles({
    createCustomerButton: {
      textAlign: 'right',
    },
    hideObject: {
      display: 'none',
    },
    alignRight: {
      textAlign: 'right',
    },
  })
  const classes = useStyles()
  const { open, accountId, accountType, isLocked, onClose } = props
  const { t } = useTranslation()
  const [isCreateNewCustomer, setIsCreateNewCustomer] = useState<boolean>(true)
  const [openAlertModal, setOpenAlertModal] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [packageName, setPackageName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isDup, setIsDup] = useState(false)
  const checkUrlDuplicate = async (url: string) => {
    const isDup = isUrlDeplicate(url)
    const val = (await isDup).data
    setIsDup(val)
  }
  const handleCloseModal = () => {
    setOpenAlertModal(false)
  }
  const handleCloseConfirmModal = () => {
    setOpenAlertModal(false)
    setOpenConfirmModal(false)
  }
  const handleCreate = () => {
    if (isDup) {
      setOpenAlertModal(true)
    } else {
      formikCreateUser.handleSubmit()
    }
  }
  const copyCustomerContent = () => {
    const text =
      'รหัสลูกค้า : ' +
      formikLinkUser.values.userId +
      '\nรหัสผ่าน​ : ' +
      password +
      '\nแพ็คเกจที่สมัคร : ' +
      packageName
    copyText(text)
  }
  const { data: customerOptionList } = useQuery('customer-option', () =>
    getCustomerOptionList('NETFLIX')
  )
  const customerOptions = customerOptionList || []
  const netflixTVPackageOption = useQuery('netflix-tv-package', () => getNetflixPackage('TV'))
  const netflixOtherPackageOption = useQuery('netflix-other-package', () =>
    getNetflixPackage('OTHER')
  )
  const tvPackageOptions = netflixTVPackageOption || []
  const otherPackageOptions = netflixOtherPackageOption || []
  const accountTypeOption = getAccountTypeOptions()
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: CustomerOption) => option.filterLabel,
  })
  const formikCreateUser = useFormik({
    initialValues: {
      packageId: '',
      lineId: '',
      lineUrl: '',
      type: accountType,
    },
    validationSchema: Yup.object().shape({
      // extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
      packageId: Yup.string().required('กรุณาเลือกแพ็คเกจการต่ออายุ'),
      lineId: Yup.string().max(255).required('กรุณาระบุ Line Id'),
      lineUrl: Yup.string().max(255).required('กรุณาระบุ Line URL'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        createCustomer({
          lineId: values.lineId,
          lineUrl: values.lineUrl,
          account: 'NETFLIX',
        } as CreateCustomerRequest),
        {
          loading: t('toast.loading'),
          success: (res: CreateCustomerResponseAPI) => {
            formikLinkUser.setFieldValue('userId', res.data.userId)
            formikCreateUser.resetForm()
            //formikLinkUser.handleSubmit()
            setPassword(res.data.password)
            setOpenConfirmModal(true)
            return 'สร้างลูกค้า ' + values.lineId + ' สำเร็จ'
          },
          error: (err) => {
            return 'สร้างลูกค้า ' + values.lineId + ' ไม่สำเร็จ เนื่องจาก ' + err.data.message
          },
        }
      )
    },
  })
  const formikLinkUser = useFormik({
    initialValues: {
      userId: '',
      packageId: '',
      accountId,
      type: accountType,
    },
    validationSchema: Yup.object().shape({
      userId: Yup.string().max(255).required('กรุณาเลือกลูกค้า'),
      // extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
      packageId: Yup.string().required('กรุณาเลือกแพ็คเกจการต่ออายุ'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        linkUserToNetflixAccount(
          {
            userId: values.userId,
            packageId: values.packageId,
            accountType: values.type,
          } as UpdateLinkUserNetflixRequest,
          accountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            formikLinkUser.resetForm()
            handleCloseConfirmModal()
            handleCloseModal()
            onClose()
            return 'เพิ่มลูกค้า ' + values.userId + ' สำเร็จ'
          },
          error: (err) => {
            return 'เพิ่มลูกค้า ' + values.userId + ' ไม่สำเร็จ เนื่องจาก ' + err.data.message
          },
        }
      )
    },
  })
  const handlePackageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (accountType === 'OTHER') {
      const p = otherPackageOptions.data?.find((pk) => pk.packageId === value)
      setPackageName(p.packageName + ' ' + p.packagePrice + ' บาท')
    } else {
      const p = tvPackageOptions.data?.find((pk) => pk.packageId === value)
      setPackageName(p.packageName + ' ' + p.packagePrice + ' บาท')
    }
    formikLinkUser.setFieldValue('packageId', value)
    formikCreateUser.setFieldValue('packageId', value)
  }
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            {!isCreateNewCustomer ? 'เพิ่มลูกค้า' : 'สร้างลูกค้า'}
          </Grid>
          <GridTextField item xs={6} sm={6} className={classes.createCustomerButton}>
            <Button
              className={!isCreateNewCustomer ? '' : classes.hideObject}
              variant="contained"
              onClick={() => setIsCreateNewCustomer(true)}
            >
              สมัครลูกค้าใหม่
            </Button>
            <Button
              className={isCreateNewCustomer ? '' : classes.hideObject}
              variant="contained"
              onClick={() => setIsCreateNewCustomer(false)}
            >
              เลือกลูกค้าปัจจุบัน
            </Button>
          </GridTextField>
        </Grid>
      </DialogTitle>
      {isCreateNewCustomer ? (
        <form onSubmit={formikCreateUser.handleSubmit}>
          <DialogContent>
            <Grid container spacing={1}>
              {/* <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  id="customer_add__customer_name"
                  label={t('customer.customerName')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateUser.values.customerName}
                  error={Boolean(
                    formikCreateUser.touched.customerName && formikCreateUser.errors.customerName
                  )}
                  helperText={
                    formikCreateUser.touched.customerName && formikCreateUser.errors.customerName
                  }
                  onChange={({ target }) =>
                    formikCreateUser.setFieldValue('customerName', target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  id="customer_add__email"
                  label={t('customer.email')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateUser.values.email}
                  onChange={({ target }) => formikCreateUser.setFieldValue('email', target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  id="customer_add__phone_number"
                  label={t('customer.phoneNumber')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateUser.values.phoneNumber}
                  onChange={({ target }) =>
                    formikCreateUser.setFieldValue('phoneNumber', target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField> */}
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  id="customer_add__line_id"
                  label={t('customer.lineId')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateUser.values.lineId}
                  error={Boolean(formikCreateUser.touched.lineId && formikCreateUser.errors.lineId)}
                  helperText={formikCreateUser.touched.lineId && formikCreateUser.errors.lineId}
                  onChange={({ target }) => formikCreateUser.setFieldValue('lineId', target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  id="customer_add__line_url"
                  label={t('customer.lineUrl')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateUser.values.lineUrl}
                  error={Boolean(
                    formikCreateUser.touched.lineUrl && formikCreateUser.errors.lineUrl
                  )}
                  helperText={formikCreateUser.touched.lineUrl && formikCreateUser.errors.lineUrl}
                  onChange={({ target }) => formikCreateUser.setFieldValue('lineUrl', target.value)}
                  onBlur={({ target }) => checkUrlDuplicate(target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
              <GridTextField item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="ประเภทอุปกรณ์"
                  onChange={(event) => {
                    const value = event.target.value
                    formikLinkUser.setFieldValue('type', value)
                    formikCreateUser.setFieldValue('type', value)
                  }}
                  disabled={isLocked}
                  value={formikCreateUser.values.type}
                  placeholder="กรุณาประเภทอุปกรณ์"
                  error={Boolean(formikCreateUser.touched.type && formikCreateUser.errors.type)}
                  helperText={formikCreateUser.touched.type && formikCreateUser.errors.type}
                  InputLabelProps={{ shrink: true }}
                >
                  {accountTypeOption?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </GridTextField>
              <GridTextField item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="แพ็คเก็ต/ราคา"
                  onChange={handlePackageChange}
                  value={formikCreateUser.values.packageId}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikCreateUser.touched.packageId && formikCreateUser.errors.packageId
                  )}
                  helperText={
                    formikCreateUser.touched.packageId && formikCreateUser.errors.packageId
                  }
                  InputLabelProps={{ shrink: true }}
                >
                  {accountType === 'TV' || accountType === 'ADDITIONAL'
                    ? tvPackageOptions.data?.map((option) => (
                        <MenuItem key={option.packageDay} value={option.packageId}>
                          {option.packageName + ' ' + option.packagePrice + ' บาท'}
                        </MenuItem>
                      ))
                    : otherPackageOptions.data?.map((option) => (
                        <MenuItem key={option.packageDay} value={option.packageId}>
                          {option.packageName + ' ' + option.packagePrice + ' บาท'}
                        </MenuItem>
                      ))}
                </TextField>
              </GridTextField>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                formikCreateUser.resetForm()
                onClose()
              }}
              color="primary"
            >
              {t('button.cancel')}
            </Button>
            <Button color="primary" variant="contained" onClick={handleCreate}>
              {t('button.create')}
            </Button>
          </DialogActions>
        </form>
      ) : (
        <form onSubmit={formikLinkUser.handleSubmit}>
          <DialogContent>
            <Grid container spacing={1}>
              <GridTextField item xs={12} sm={12}>
                <Autocomplete
                  className={!isCreateNewCustomer ? '' : classes.hideObject}
                  options={customerOptions}
                  getOptionLabel={(option) => (option ? option.label : '')}
                  filterOptions={filterOptions}
                  noOptionsText="ไม่พบข้อมูลลูกค้า"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('customer.title')}
                      variant="outlined"
                      placeholder="สามารถค้นหาด้วยชื่อ,อีเมลล์,ไลน์ไอดี"
                      error={Boolean(formikLinkUser.touched.userId && formikLinkUser.errors.userId)}
                      helperText={formikLinkUser.touched.userId && formikLinkUser.errors.userId}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  onChange={(_event, value) => formikLinkUser.setFieldValue('userId', value?.value)}
                />
              </GridTextField>
              <GridTextField item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="ประเภทอุปกรณ์"
                  onChange={(event) => {
                    const value = event.target.value
                    formikLinkUser.setFieldValue('type', value)
                    formikCreateUser.setFieldValue('type', value)
                  }}
                  disabled={isLocked}
                  value={formikLinkUser.values.type}
                  placeholder="กรุณาประเภทอุปกรณ์"
                  error={Boolean(formikLinkUser.touched.type && formikLinkUser.errors.type)}
                  helperText={formikLinkUser.touched.type && formikLinkUser.errors.type}
                  InputLabelProps={{ shrink: true }}
                >
                  {accountTypeOption?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </GridTextField>
              <GridTextField item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="แพ็คเก็ต/ราคา"
                  onChange={handlePackageChange}
                  value={formikLinkUser.values.packageId}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikLinkUser.touched.packageId && formikLinkUser.errors.packageId
                  )}
                  helperText={formikLinkUser.touched.packageId && formikLinkUser.errors.packageId}
                  InputLabelProps={{ shrink: true }}
                >
                  {accountType === 'TV'
                    ? tvPackageOptions.data?.map((option) => (
                        <MenuItem key={option.packageDay} value={option.packageId}>
                          {option.packageName + ' ' + option.packagePrice + ' บาท'}
                        </MenuItem>
                      ))
                    : otherPackageOptions.data?.map((option) => (
                        <MenuItem key={option.packageDay} value={option.packageId}>
                          {option.packageName + ' ' + option.packagePrice + ' บาท'}
                        </MenuItem>
                      ))}
                </TextField>
              </GridTextField>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                formikLinkUser.resetForm()
                handleCloseConfirmModal()
                onClose()
              }}
              color="primary"
            >
              {t('button.cancel')}
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {t('button.add')}
            </Button>
          </DialogActions>
        </form>
      )}
      <Modal
        open={openAlertModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            แจ้งเตือน URL ซ้ำ
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextSmallLineClamp>
              เนื่องจาก URL {formikCreateUser.values.lineUrl} มีอยู่ในระบบแล้ว
              คุณต้องการสร้างซ้ำหรือไม่?
            </TextSmallLineClamp>
          </Typography>
          <br />
          <br />
          <div className={classes.alignRight}>
            <Button color="primary" variant="contained" onClick={handleCloseModal}>
              {t('button.cancel')}
            </Button>
            &nbsp;&nbsp;
            <Button
              color="primary"
              variant="contained"
              onClick={() => formikCreateUser.handleSubmit()}
            >
              {t('button.create')}
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openConfirmModal}
        onClose={handleCloseConfirmModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            สมัครลูกค้าใหม่สำเร็จ
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            รหัสลูกค้า : {formikLinkUser.values.userId}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            รหัสผ่าน : {password}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            แพ็คเกจที่สมัคร : {packageName}
          </Typography>
          <br />
          <div className={classes.alignRight}>
            <Button color="primary" variant="contained" onClick={copyCustomerContent}>
              คัดลอกข้อมูล
            </Button>
            &nbsp;&nbsp;
            <Button color="primary" variant="contained" onClick={handleCloseConfirmModal}>
              {t('button.cancel')}
            </Button>
            &nbsp;&nbsp;
            <Button
              color="primary"
              variant="contained"
              onClick={() => formikLinkUser.handleSubmit()}
            >
              สมัคร
            </Button>
          </div>
        </Box>
      </Modal>
    </Dialog>
  )
}
