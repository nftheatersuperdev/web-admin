import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { DEFAULT_CHANGE_DATE_FORMAT, formatDateStringWithPattern } from 'utils'
import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { useState } from 'react'
import DatePicker from 'components/DatePicker'
import { GridTextField } from 'components/Styled'
import {
  CreateNetflixAccountRequest,
  CreateNetflixAccountResponseAPI,
} from 'services/web-bff/netflix.type'
import { createNetflixAccount } from 'services/web-bff/netflix'

interface AddNewNetflixDialogProps {
  open: boolean
  onClose: () => void
}

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const initDate = dayjs().tz(config.timezone).startOf('day').add(7, 'day').toDate()

export default function AddNewNetflixDialog(props: AddNewNetflixDialogProps): JSX.Element {
  const useStyles = makeStyles({
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16.5px 14px',
        fontSize: '13px',
      },
    },
  })
  const classes = useStyles()
  const { open, onClose } = props
  const { t } = useTranslation()
  const [selectedChangeDate, setSelectedChangeDate] = useState(initDate)
  const [selectedBillDate, setSelectedBillDate] = useState(initDate)
  const formik = useFormik({
    initialValues: {
      changeDate: '',
      billDate: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      changeDate: Yup.string()
        .max(255)
        .matches(/^[1-31/0-12]/, 'กรุณาระบุวันสลับให้ตรงรูปแบบเช่น 29/09')
        .required('กรุณาระบุวันสลับ'),
      billDate: Yup.string()
        .max(255)
        .matches(/^[1-31/0-12]/, 'กรุณาระบุรอบบิลให้ตรงรูปแบบเช่น 29/09')
        .required('กรุณาระบุรอบบิล'),
      password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
      email: Yup.string().email('อีเมลล์ไม่ถูกต้อง').max(255).required('กรุณาระบุอีเมลล์'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(createNetflixAccount(values as CreateNetflixAccountRequest), {
        loading: t('toast.loading'),
        success: (res: CreateNetflixAccountResponseAPI) => {
          formik.resetForm()
          onClose()
          return 'สร้างบัญชี ' + res.data.accountName + ' สำเร็จ'
        },
        error: (err) => {
          return 'สร้างบัญชีไม่สำเร็จ เนื่องจาก' + err.data.message
        },
      })
    },
  })
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('netflix.addNetflix')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={1}>
            <GridTextField item xs={12} sm={12}>
              <TextField
                type="text"
                disabled
                name="accountName"
                placeholder="ระบบจะ Generate ชื่อบัญชี Netflix ให้อัตโนมัติ"
                id="netflix_add_account_name"
                label={t('netflix.mainInfo.accountName')}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={12}>
              <TextField
                type="email"
                name="email"
                placeholder="กรุณาระบุอีเมลล์"
                id="netflix_add_email"
                label={t('netflix.mainInfo.email')}
                fullWidth
                variant="outlined"
                value={formik.values.email}
                error={Boolean(formik.touched.email && formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                onChange={({ target }) => formik.setFieldValue('email', target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={12}>
              <TextField
                type="text"
                name="password"
                placeholder="กรุณาระบุรหัสผ่าน"
                id="netflix_add_password"
                label={t('netflix.mainInfo.password')}
                fullWidth
                variant="outlined"
                value={formik.values.password}
                error={Boolean(formik.touched.password && formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                onChange={({ target }) => formik.setFieldValue('password', target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={12} className={classes.datePickerFromTo}>
              <DatePicker
                disablePast
                label="วันสลับ"
                id="netflix_account__search_input"
                name="selectedChangeDate"
                format={DEFAULT_CHANGE_DATE_FORMAT}
                value={selectedChangeDate}
                inputVariant="outlined"
                placeholder="กรุณาระบุวันสลับในตรงรูปแบบที่กำหนดเช่น 29/09"
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.touched.changeDate && formik.errors.changeDate)}
                helperText={formik.touched.changeDate && formik.errors.changeDate}
                onChange={(date) => {
                  date && setSelectedChangeDate(date.toDate())
                  formik.setFieldValue(
                    'changeDate',
                    formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                  )
                }}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={12} className={classes.datePickerFromTo}>
              <DatePicker
                disablePast
                label="รอบบิล"
                name="selectedChangeDate"
                format={DEFAULT_CHANGE_DATE_FORMAT}
                value={selectedBillDate}
                inputVariant="outlined"
                placeholder="กรุณาระบุรอบบิลในตรงรูปแบบที่กำหนดเช่น 29/09"
                InputLabelProps={{ shrink: true }}
                error={Boolean(formik.touched.billDate && formik.errors.billDate)}
                helperText={formik.touched.billDate && formik.errors.billDate}
                onChange={(date) => {
                  date && setSelectedBillDate(date.toDate())
                  formik.setFieldValue(
                    'billDate',
                    formatDateStringWithPattern(date?.toString(), DEFAULT_CHANGE_DATE_FORMAT)
                  )
                }}
              />
            </GridTextField>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              formik.resetForm()
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
    </Dialog>
  )
}
