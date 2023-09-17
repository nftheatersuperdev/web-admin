/* eslint-disable react/jsx-props-no-spreading */
import {
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
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { CreateCustomerRequest, CreateCustomerResponseAPI } from 'services/web-bff/customer.type'
import { GridTextField } from 'components/Styled'
import { createCustomer, isUrlDeplicate } from 'services/web-bff/customer'

interface AddNewUserDialogProps {
  open: boolean
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
  const { open, onClose } = props
  const [openAlertModal, setOpenAlertModal] = useState(false)
  const { t } = useTranslation()
  const [isDup, setIsDup] = useState(false)
  const checkUrlDuplicate = async (url: string) => {
    const isDup = isUrlDeplicate(url)
    const val = (await isDup).data
    setIsDup(val)
  }
  const handleCloseModal = () => {
    setOpenAlertModal(false)
  }
  const handleCreate = () => {
    if (isDup) {
      setOpenAlertModal(true)
    } else {
      formikCreateUser.handleSubmit()
    }
  }
  const formikCreateUser = useFormik({
    initialValues: {
      lineId: '',
      lineUrl: '',
      email: '',
      account: '',
    },
    validationSchema: Yup.object().shape({
      lineId: Yup.string().max(255).required('กรุณาระบุ Line Id'),
      lineUrl: Yup.string().max(255).required('กรุณาระบุ Line URL'),
      account: Yup.string().max(255).required('กรุณาระบุบัญชี'),
      email: Yup.string()
        .email()
        .when('account', {
          is: 'YOUTUBE',
          then: Yup.string().required('กรุณาระบุอีเมลล์ของลูกค้า'),
        }),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        createCustomer({
          lineId: values.lineId,
          lineUrl: values.lineUrl,
          email: values.email,
          account: values.account,
        } as CreateCustomerRequest),
        {
          loading: t('toast.loading'),
          success: (res: CreateCustomerResponseAPI) => {
            formikCreateUser.resetForm()
            onClose()
            return 'สร้างลูกค้า ' + values.lineId + ' สำเร็จ'
          },
          error: (err) => {
            return 'สร้างลูกค้า ' + values.lineId + ' ไม่สำเร็จ เนื่องจาก ' + err.data.message
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
            สร้างลูกค้า
          </Grid>
        </Grid>
      </DialogTitle>
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
                error={Boolean(formikCreateUser.touched.lineUrl && formikCreateUser.errors.lineUrl)}
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
                label="บัญชี"
                value={formikCreateUser.values.account}
                placeholder="กรุณาเลือกบัญชี"
                onChange={({ target }) => formikCreateUser.setFieldValue('account', target.value)}
                error={Boolean(formikCreateUser.touched.account && formikCreateUser.errors.account)}
                helperText={formikCreateUser.touched.account && formikCreateUser.errors.account}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="NETFLIX">Netflix</MenuItem>
                <MenuItem value="YOUTUBE">Youtube</MenuItem>
              </TextField>
            </GridTextField>
            <GridTextField item xs={12} sm={12}>
              <TextField
                className={formikCreateUser.values.account === 'YOUTUBE' ? '' : classes.hideObject}
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
            เนื่องจาก URL {formikCreateUser.values.lineUrl} มีอยู่ในระบบแล้ว คุณต้องการสร้างซ้ำหรือไม่?
          </Typography>
          <br />
          <div className={classes.alignRight}>
            <Button color="primary" variant="contained" onClick={handleCloseModal}>
              {t('button.cancel')}
            </Button>&nbsp;&nbsp;
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
    </Dialog>
  )
}
