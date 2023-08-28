import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { DisabledField, GridSearchSection, GridTextField } from 'components/Styled'
import { ExtendDayCustomerRequest } from 'services/web-bff/customer.type'
import { extendCustomerExpiredDay } from 'services/web-bff/customer'
import { getNetflixPackage } from 'services/web-bff/netflix'
import { getYoutubePackageByType } from 'services/web-bff/youtube'

interface ExtendUserDialogProps {
  open: boolean
  userId: string
  lineId: string
  account: string
  accountType: string
  onClose: () => void
}

export default function ExtendUserDialog(props: ExtendUserDialogProps): JSX.Element {
  const { open, userId, lineId, account, accountType, onClose } = props
  const { t } = useTranslation()
  const [showPackage, setShowPackage] = useState(false)
  const device = accountType === 'OTHER' ? 'OTHER' : 'TV'
  const netflixPackageOption = useQuery('netflix-package-option', () => getNetflixPackage(device), {
    enabled: account === 'NETFLIX',
  })
  const youtubePackageOption = useQuery(
    'youtube-package-option',
    () => getYoutubePackageByType('EXTEND'),
    {
      enabled: account === 'YOUTUBE',
    }
  )
  const packageOption = account === 'YOUTUBE' ? youtubePackageOption : netflixPackageOption
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target)
  }
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
                value={lineId}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={12}>
              <RadioGroup
                row
                aria-labelledby="deeplink-radio-group-id"
                onChange={handleRadioChange}
                defaultValue={showPackage}
              >
                <FormControlLabel
                  value="false"
                  control={<Radio />}
                  onClick={() => {
                    setShowPackage(false)
                  }}
                  label="ระบุวัน"
                />
                <FormControlLabel
                  value="true"
                  control={<Radio />}
                  onClick={() => {
                    setShowPackage(true)
                  }}
                  label="เลือก Package"
                />
              </RadioGroup>
            </GridTextField>
            <GridTextField item xs={12}>
              {showPackage ? (
                <TextField
                  fullWidth
                  select
                  label="แพ็คเก็ต/ราคา"
                  onChange={handlePackageChange}
                  error={Boolean(formik.touched.extendDay && formik.errors.extendDay)}
                  helperText={formik.touched.extendDay && formik.errors.extendDay}
                >
                  {packageOption.data?.map((option) => (
                    <MenuItem key={option.packageDay} value={option.packageDay}>
                      {option.packageName + ' ' + option.packagePrice + ' บาท'}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  type="text"
                  name="extendDay"
                  placeholder="ระบุวันที่ต้องการต่ออายุ"
                  id="extend_customer__day_input"
                  label={t('customer.extendDays')}
                  fullWidth
                  value={formik.values.extendDay}
                  onChange={({ target }) => formik.setFieldValue('extendDay', target.value)}
                  variant="outlined"
                />
              )}
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
