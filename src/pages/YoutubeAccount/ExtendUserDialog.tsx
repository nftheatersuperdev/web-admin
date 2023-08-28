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
import { useQuery } from 'react-query'
import { DisabledField, GridSearchSection, GridTextField } from 'components/Styled'
import { ExtendDayCustomerRequest } from 'services/web-bff/customer.type'
import { extendCustomerExpiredDay } from 'services/web-bff/customer'
import { getYoutubePackageByType } from 'services/web-bff/youtube'

interface ExtendUserDialogProps {
  open: boolean
  userId: string
  lineId: string
  onClose: () => void
}

export default function ExtendUserDialog(props: ExtendUserDialogProps): JSX.Element {
  const { open, userId, lineId, onClose } = props
  const { t } = useTranslation()
  const youtubePackageOption = useQuery('youtube-package-option', () =>
    getYoutubePackageByType('EXTEND')
  )
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
                id="extend_user_dialog_line_id"
                label="Line Id"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
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
                {youtubePackageOption.data?.map((option) => (
                  <MenuItem key={option.packageDay} value={option.packageDay}>
                    {option.packageName + ' ' + option.packagePrice + ' บาท'}
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
