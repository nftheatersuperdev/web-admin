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
  CreateYoutubeAccountRequest,
  CreateYoutubeAccountResponse,
} from 'services/web-bff/youtube.type'
import { createYoutubeAccount } from 'services/web-bff/youtube'

interface AddNewYoutubeDialogProps {
  open: boolean
  onClose: () => void
}

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const initSelectedChangeDate = dayjs().tz(config.timezone).startOf('day').add(7, 'day').toDate()

export default function AddNewYoutubeDialog(props: AddNewYoutubeDialogProps): JSX.Element {
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
  const [selectedChangeDate, setSelectedChangeDate] = useState(initSelectedChangeDate)
  const formik = useFormik({
    initialValues: {
      changeDate: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      changeDate: Yup.string()
        .max(255)
        .matches(/^[1-31/0-12]/, 'กรุณาระบุวันสลับให้ตรงรูปแบบเช่น 29/09')
        .required('กรุณาระบุวันสลับ'),
      password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
      email: Yup.string().email('อีเมลล์ไม่ถูกต้อง').max(255).required('กรุณาระบุอีเมลล์'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(createYoutubeAccount(values as CreateYoutubeAccountRequest), {
        loading: t('toast.loading'),
        success: (res: CreateYoutubeAccountResponse) => {
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
      <DialogTitle id="form-dialog-title">{t('youtube.addYoutube')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={1}>
            <GridTextField item xs={12} sm={12}>
              <TextField
                type="text"
                disabled
                name="accountName"
                placeholder="ระบบจะ Generate ชื่อบัญชี youtube ให้อัตโนมัติ"
                id="youtube_add_account_name"
                label={t('youtube.mainInfo.accountName')}
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
                id="youtube_add_email"
                label={t('youtube.mainInfo.email')}
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
                id="youtube_add_password"
                label={t('youtube.mainInfo.password')}
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
                id="youtube_account__search_input"
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
