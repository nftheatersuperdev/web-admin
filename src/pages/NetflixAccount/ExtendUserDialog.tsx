import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { DisabledField, GridSearchSection, GridTextField } from 'components/Styled'
import { ExtendDayCustomerRequest } from 'services/web-bff/customer.type'
import { extendCustomerExpiredDay } from 'services/web-bff/customer'
import { getNFPackageOptions } from './PackageOption'

interface ExtendUserDialogProps {
  open: boolean
  userId: string
  customerName: string
  lineId: string
  onClose: () => void
}

export default function ExtendUserDialog(props: ExtendUserDialogProps): JSX.Element {
  const { open, userId, customerName, lineId, onClose } = props
  const { t } = useTranslation()
  const netflixPackageOption = getNFPackageOptions()
  const handlePackageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('extendDay', value)
  }
  const formik = useFormik({
    initialValues: {
      userId,
      extendDay: 0,
    },
    validationSchema: Yup.object().shape({
      extendDay: Yup.number().integer().min(1, 'กรุณาเลือกแพ็คเกจการต่ออายุ'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        extendCustomerExpiredDay(
          {
            extendDay: values.extendDay,
          } as ExtendDayCustomerRequest,
          userId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            formik.resetForm()
            onClose()
            return 'ต่ออายุลูกค้า ' + values.userId + ' สำเร็จ'
          },
          error: () => {
            return 'ต่ออายุลูกค้า ' + values.userId + ' ไม่สำเร็จ'
          },
        }
      )
    },
  })
  return (
    <Dialog open={open} fullWidth aria-labelledby="form_extend_user_dialog_title">
      <DialogTitle id="form_extend_user_dialog_title">{t('netflix.extendUser')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <GridSearchSection container spacing={1}>
            <GridTextField item xs={12}>
              <DisabledField
                type="text"
                id="extend_user_dialog_user_name"
                label="ชื่อลูกค้า"
                fullWidth
                variant="outlined"
                value={customerName}
              />
            </GridTextField>
            <GridTextField item xs={12}>
              <DisabledField
                type="text"
                id="extend_user_dialog_line_id"
                label="Line Id"
                fullWidth
                variant="outlined"
                value={lineId}
              />
            </GridTextField>
            <GridTextField item xs={12}>
              <TextField
                fullWidth
                select
                label="แพ็คเก็ต/ราคา"
                onChange={handlePackageChange}
                error={Boolean(formik.touched.extendDay && formik.errors.extendDay)}
                helperText={formik.touched.extendDay && formik.errors.extendDay}
              >
                {netflixPackageOption?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </GridTextField>
          </GridSearchSection>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              formik.resetForm()
              onClose()
            }}
            variant="contained"
            color="primary"
          >
            {t('button.cancel')}
          </Button>
          <Button color="primary" variant="contained" type="submit">
            {t('button.extendUser')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
