import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { GridTextField } from 'components/Styled'
import { CreateRewardRequest } from 'services/web-bff/reward-type'
import { createReward } from 'services/web-bff/reward'

interface AddNewRewardDialogProps {
  open: boolean
  onClose: () => void
}

export default function AddNewRewardDialog(props: AddNewRewardDialogProps): JSX.Element {
  const { open, onClose } = props
  const { t } = useTranslation()
  const formik = useFormik({
    initialValues: {
      name: '',
      point: 0,
      value: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().max(255).required('กรุณาระบุชื่อรางวัล'),
      point: Yup.number()
        .min(1, 'กรุณาระบุคะแนนที่ใช้แลกมากกว่า 0')
        .required('กรุณาระบุคะแนนที่ใช้แลก'),
      value: Yup.string().max(255).required('กรุณามูลค่าของรางวัล'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        createReward({
          rewardName: values.name,
          redeemPoint: values.point,
          rewardValue: values.value,
        } as CreateRewardRequest),
        {
          loading: t('toast.loading'),
          success: () => {
            formik.resetForm()
            onClose()
            return 'สร้างรางวัล ' + formik.values.name + ' สำเร็จ'
          },
          error: (err) => {
            return 'สร้างรางวัลไม่สำเร็จ เนื่องจาก' + err.data.message
          },
        }
      )
    },
  })
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">สร้างรายการรางวัล</DialogTitle>
      <DialogContent>
        <GridTextField item xs={12}>
          <TextField
            type="text"
            name="name"
            placeholder="กรุณาระบุชื่อรางวัล"
            label="ชื่อรางวลั"
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
            type="number"
            name="point"
            placeholder="กรุณาระบุคะแนนที่ใช้แลก"
            label="คะแนนที่ใช้แลก"
            fullWidth
            variant="outlined"
            value={formik.values.point}
            error={Boolean(formik.touched.point && formik.errors.point)}
            helperText={formik.touched.point && formik.errors.point}
            onChange={({ target }) => formik.setFieldValue('point', target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </GridTextField>
        <GridTextField item xs={12}>
          <TextField
            type="text"
            name="value"
            placeholder="กรุณามูลค่าของรางวัล"
            label="มูลค่าของรางวัล"
            fullWidth
            variant="outlined"
            value={formik.values.value}
            error={Boolean(formik.touched.value && formik.errors.value)}
            helperText={formik.touched.value && formik.errors.value}
            onChange={({ target }) => formik.setFieldValue('value', target.value)}
            InputLabelProps={{ shrink: true }}
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
        <Button color="primary" variant="contained" onClick={() => formik.handleSubmit()}>
          {t('button.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
