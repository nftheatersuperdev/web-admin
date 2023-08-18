/* eslint-disable react/jsx-props-no-spreading */
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  TextField,
  createFilterOptions,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { GridTextField } from 'components/Styled'
import { getCustomerOptionList, createCustomer } from 'services/web-bff/customer'
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

export default function AddNewUserDialog(props: AddNewUserDialogProps): JSX.Element {
  const useStyles = makeStyles({
    createCustomerButton: {
      textAlign: 'right',
    },
    hideObject: {
      display: 'none',
    },
  })
  const classes = useStyles()
  const { open, accountId, onClose } = props
  const { t } = useTranslation()
  const [isCreateNewCustomer, setIsCreateNewCustomer] = useState<boolean>(true)
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
  const formikCreateUser = useFormik({
    initialValues: {
      extendDay: 0,
      lineId: '',
      lineUrl: '',
      email: '',
    },
    validationSchema: Yup.object().shape({
      extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
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
            formikLinkUser.handleSubmit()
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
      extendDay: 0,
      accountId,
    },
    validationSchema: Yup.object().shape({
      userId: Yup.string().max(255).required('กรุณาเลือกลูกค้า'),
      extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        linkUserToYoutubeAccount(
          {
            userId: values.userId,
            extendDay: values.extendDay,
          } as UpdateLinkUserYoutubeRequest,
          accountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            formikLinkUser.resetForm()
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
    formikLinkUser.setFieldValue('extendDay', value)
    formikCreateUser.setFieldValue('extendDay', value)
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
                  value={formikCreateUser.values.extendDay}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikCreateUser.touched.extendDay && formikCreateUser.errors.extendDay
                  )}
                  helperText={
                    formikCreateUser.touched.extendDay && formikCreateUser.errors.extendDay
                  }
                  InputLabelProps={{ shrink: true }}
                >
                  {youtubeNewPackageOption.data?.map((option) => (
                    <MenuItem key={option.packageDay} value={option.packageDay}>
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
            <Button color="primary" variant="contained" type="submit">
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
                  value={formikLinkUser.values.extendDay}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikLinkUser.touched.extendDay && formikLinkUser.errors.extendDay
                  )}
                  helperText={formikLinkUser.touched.extendDay && formikLinkUser.errors.extendDay}
                  InputLabelProps={{ shrink: true }}
                >
                  {youtubeExtendPackageOption.data?.map((option) => (
                    <MenuItem key={option.packageDay} value={option.packageDay}>
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
    </Dialog>
  )
}
