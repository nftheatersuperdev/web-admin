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
import toast from 'react-hot-toast'
import { useState } from 'react'
import { GridTextField } from 'components/Styled'
import { getCustomerOptionList, createCustomer } from 'services/web-bff/customer'
import {
  CreateCustomerRequest,
  CreateCustomerResponseAPI,
  CustomerOption,
} from 'services/web-bff/customer.type'
import { linkUserToNetflixAccount } from 'services/web-bff/netflix'
import { UpdateLinkUserNetflixRequest } from 'services/web-bff/netflix.type'
import { getNFPackageOptions } from './PackageOption'

interface AddNewUserDialogProps {
  open: boolean
  accountId: string
  accountType?: string
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
  const { open, accountId, accountType, onClose } = props
  const { t } = useTranslation()
  const [isCreateNewCustomer, setIsCreateNewCustomer] = useState<boolean>(false)
  const { data: customerOptionList } = useQuery('customer-option', () => getCustomerOptionList())
  const customerOptions = customerOptionList || []
  const netflixPackageOption = getNFPackageOptions()
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: CustomerOption) => option.filterLabel,
  })
  const handlePackageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formikLinkUser.setFieldValue('extendDay', value)
    formikCreateUser.setFieldValue('extendDay', value)
  }
  const formikCreateUser = useFormik({
    initialValues: {
      extendDay: 0,
      // customerName: '',
      // email: '',
      // phoneNumber: '',
      lineId: '',
      lineUrl: '',
    },
    validationSchema: Yup.object().shape({
      extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
      // customerName: Yup.string().max(255).required('กรุณาระบุชื่อลูกค้า'),
      lineId: Yup.string().max(255).required('กรุณาระบุ Line Id'),
      lineUrl: Yup.string().max(255).required('กรุณาระบุ Line URL'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        createCustomer({
          lineId: values.lineId,
          lineUrl: values.lineUrl,
        } as CreateCustomerRequest),
        {
          loading: t('toast.loading'),
          success: (res: CreateCustomerResponseAPI) => {
            formikLinkUser.setFieldValue('userId', res.data.userId)
            formikCreateUser.resetForm()
            formikLinkUser.handleSubmit()
            return 'สร้างลูกค้า ' + values.lineId + ' สำเร็จ'
          },
          error: () => {
            return 'สร้างลูกค้า ' + values.lineId + ' ไม่สำเร็จ'
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
      accountType,
    },
    validationSchema: Yup.object().shape({
      userId: Yup.string().max(255).required('กรุณาเลือกลูกค้า'),
      extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        linkUserToNetflixAccount(
          {
            userId: values.userId,
            extendDay: values.extendDay,
            accountType: values.accountType,
          } as UpdateLinkUserNetflixRequest,
          accountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            formikLinkUser.resetForm()
            onClose()
            return 'เพิ่มลูกค้า ' + values.userId + ' สำเร็จ'
          },
          error: () => {
            return 'เพิ่มลูกค้า ' + values.userId + ' ไม่สำเร็จ'
          },
        }
      )
    },
  })
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
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
              <GridTextField item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="แพ็คเก็ต/ราคา"
                  onChange={handlePackageChange}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikCreateUser.touched.extendDay && formikCreateUser.errors.extendDay
                  )}
                  helperText={
                    formikCreateUser.touched.extendDay && formikCreateUser.errors.extendDay
                  }
                  InputLabelProps={{ shrink: true }}
                >
                  {netflixPackageOption?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
                  label="แพ็คเก็ต/ราคา"
                  onChange={handlePackageChange}
                  placeholder="กรุณาเลือกแพ็คเก็ต/ราคา"
                  error={Boolean(
                    formikLinkUser.touched.extendDay && formikLinkUser.errors.extendDay
                  )}
                  helperText={formikLinkUser.touched.extendDay && formikLinkUser.errors.extendDay}
                  InputLabelProps={{ shrink: true }}
                >
                  {netflixPackageOption?.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
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
