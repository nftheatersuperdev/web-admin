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
import { useState } from 'react'
import toast from 'react-hot-toast'
import { copyText } from 'utils/copyContent'
import { GridTextField } from 'components/Styled'
import { getCustomerOptionList, createCustomer, isUrlDeplicate } from 'services/web-bff/customer'
import {
  CreateCustomerRequest,
  CreateCustomerResponseAPI,
  CustomerOption,
} from 'services/web-bff/customer.type'
import { getYoutubePackageByType, linkUserToYoutubeAccount } from 'services/web-bff/youtube'
import { UpdateLinkUserYoutubeRequest } from 'services/web-bff/youtube.type'

interface AddNewUserDialogProps {
  open: boolean
  accountId: string
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
  const { open, accountId, onClose } = props
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
  const { data: customerOptionList } = useQuery('customer-option', () =>
    getCustomerOptionList('YOUTUBE')
  )
  const customerOptions = customerOptionList || []
  const youtubeNewPackageOption = useQuery('youtube-new-package', () =>
    getYoutubePackageByType('NEW')
  )
  const youtubeExtendPackageOption = useQuery('youtube-extend-package', () =>
    getYoutubePackageByType('EXTEND')
  )
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: CustomerOption) => option.filterLabel,
  })
  const copyCustomerContent = () => {
    const text =
      'รหัสลูกค้า : ' +
      formikLinkUser.values.userId +
      '\nรหัสผ่าน​ : ' +
      password +
      '\nแพ็คเกจที่สมัคร : ' +
      packageName +
      '\nนำรหัสลูกค้า-รหัสผ่าน เข้าระบบที่เว็บไซต์ด้านล่างได้เลยนะครับ' +
      '\nhttps://nftheaterth.com/login'
    copyText(text)
  }
  const formikCreateUser = useFormik({
    initialValues: {
      packageId: 0,
      lineId: '',
      lineUrl: '',
      email: '',
    },
    validationSchema: Yup.object().shape({
      packageId: Yup.string().required('กรุณาเลือกแพ็คเกจการต่ออายุ'),
      email: Yup.string().email().required('กรุณาระบุ Email'),
      lineId: Yup.string().max(255).required('กรุณาระบุ Line Id'),
      lineUrl: Yup.string().max(255).required('กรุณาระบุ Line URL'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        createCustomer({
          lineId: values.lineId,
          lineUrl: values.lineUrl,
          email: values.email,
          account: 'YOUTUBE',
        } as CreateCustomerRequest),
        {
          loading: t('toast.loading'),
          success: (res: CreateCustomerResponseAPI) => {
            formikLinkUser.setFieldValue('userId', res.data.userId)
            formikCreateUser.resetForm()
            setPassword(res.data.password)
            //formikLinkUser.handleSubmit()
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
      packageId: 0,
      accountId,
    },
    validationSchema: Yup.object().shape({
      userId: Yup.string().max(255).required('กรุณาเลือกลูกค้า'),
      packageId: Yup.string().required('กรุณาเลือกแพ็คเกจการต่ออายุ'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        linkUserToYoutubeAccount(
          {
            userId: values.userId,
            packageId: values.packageId,
          } as UpdateLinkUserYoutubeRequest,
          accountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            formikLinkUser.resetForm()
            handleCloseModal()
            handleCloseConfirmModal()
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
    const p = youtubeNewPackageOption.data?.find((pk) => pk.packageId === value)
    setPackageName(p.packageName + ' ' + p.packagePrice + ' บาท')
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
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  id="customer_add__email"
                  label={t('customer.email')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateUser.values.email}
                  error={Boolean(formikCreateUser.touched.email && formikCreateUser.errors.email)}
                  helperText={formikCreateUser.touched.email && formikCreateUser.errors.email}
                  onChange={({ target }) => formikCreateUser.setFieldValue('email', target.value)}
                  InputLabelProps={{ shrink: true }}
                />
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
                  {youtubeNewPackageOption.data?.map((option) => (
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
                  label="แพ็คเก็ต/ราคาx"
                  onChange={handlePackageChange}
                  value={formikLinkUser.values.packageId}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikLinkUser.touched.packageId && formikLinkUser.errors.packageId
                  )}
                  helperText={formikLinkUser.touched.packageId && formikLinkUser.errors.packageId}
                  InputLabelProps={{ shrink: true }}
                >
                  {youtubeExtendPackageOption.data?.map((option) => (
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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            นำรหัสลูกค้า-รหัสผ่าน เข้าระบบที่เว็บไซต์ด้านล่างได้เลยนะครับ
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            https://nftheaterth.com/login
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
