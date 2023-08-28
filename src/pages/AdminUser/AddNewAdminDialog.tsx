import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useAuth } from 'auth/AuthContext'
import { useState } from 'react'
import { EnabledTextField, GridTextField } from 'components/Styled'
import { createNewUser } from 'services/firebase-rest'
import ConfirmDialog from 'components/ConfirmDialog'

interface AddNewAdminDialogProps {
  open: boolean
  onClose: () => void
}

export default function AddNewAdminDialog(props: AddNewAdminDialogProps): JSX.Element {
  const accessToken = useAuth().getToken() || ''
  const { open, onClose } = props
  const [visibleConfirmationDialog, setVisibleConfirmationDialog] = useState(false)
  const roleOptions = [
    { value: 'NETFLIX_ADMIN', label: 'แอดมิน Netflix' },
    { value: 'NETFLIX_AUTHOR', label: 'หัวหน้าแอดมิน Netflix' },
    { value: 'YOUTUBE_ADMIN', label: 'แอดมิน Youtube' },
    { value: 'YOUTUBE_AUTHOR', label: 'หัวหน้าแอดมิน Youtube' },
  ]
  const { t } = useTranslation()
  const formik = useFormik({
    initialValues: {
      name: '',
      role: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(255).required('กรุณาระบุชื่อแอดมิน'),
      role: Yup.string().max(255).required('กรุณาเลือกระดับผู้ใช้งาน'),
      password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
      email: Yup.string().email('อีเมลล์ไม่ถูกต้อง').max(255).required('กรุณาระบุอีเมลล์'),
    }),
    enableReinitialize: true,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true)
      toast
        .promise(
          createNewUser({
            accessToken,
            name: values.name,
            email: values.email,
            password: values.password,
            role: values.role,
          }),
          {
            loading: t('toast.loading'),
            success: 'สร้างผู้ใช้งานสำเร็จ',
            error: (error) => 'สร้างผู้ใช้งานไม่สำเร็จ เนื่องจาก ' + error.message,
          }
        )
        .finally(() => {
          actions.resetForm()
          actions.setSubmitting(false)
          setVisibleConfirmationDialog(false)
          onClose()
        })
    },
  })
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('netflix.addNetflix')}</DialogTitle>
      <DialogContent>
        <GridTextField item xs={12}>
          <TextField
            type="text"
            name="name"
            placeholder="กรุณาระบุชื่อแอดมิน"
            label={t('adminUser.mainInfo.name')}
            fullWidth
            variant="outlined"
            value={formik.values.name}
            error={Boolean(formik.touched.name && formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            onChange={({ target }) => formik.setFieldValue('name', target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </GridTextField>
        <GridTextField item xs={12}>
          <TextField
            type="email"
            name="email"
            placeholder="กรุณาระบุอีเมลล์"
            id="netflix_add_email"
            label={t('adminUser.mainInfo.email')}
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
            label={t('adminUser.mainInfo.password')}
            fullWidth
            variant="outlined"
            value={formik.values.password}
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            onChange={({ target }) => formik.setFieldValue('password', target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </GridTextField>
        <GridTextField item xs={12}>
          <Autocomplete
            autoHighlight
            options={roleOptions || []}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value || value.value === ''
            }
            renderInput={(params) => {
              return (
                <EnabledTextField
                  /* eslint-disable react/jsx-props-no-spreading */
                  {...params}
                  label="ระดับผู้ใช้งาน"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(formik.touched.role && formik.errors.role)}
                  helperText={formik.touched.role && formik.errors.role}
                />
              )
            }}
            onChange={(_event, item) => {
              formik.setFieldValue('role', item?.value)
            }}
          />
        </GridTextField>
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
        <Button
          color="primary"
          variant="contained"
          onClick={() => setVisibleConfirmationDialog(true)}
        >
          {t('button.create')}
        </Button>
      </DialogActions>
      <ConfirmDialog
        open={visibleConfirmationDialog}
        title="สร้างผู้ใช้งานแอดมินใหม่"
        message="คุณแน่ใจหรือว่าต้องการสร้างผู้ใช้งานแอดมินใหม่"
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => formik.handleSubmit()}
        onCancel={() => setVisibleConfirmationDialog(false)}
      />
    </Dialog>
  )
}
