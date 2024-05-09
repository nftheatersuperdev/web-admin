import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField,
} from '@mui/material'
import { useFormik } from 'formik'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import { useAuth } from 'auth/AuthContext'
import { GridSearchSection, GridTextField } from 'components/Styled'
import { Package, UpdatePackage } from 'services/web-bff/package-type'
import { updatePackage } from 'services/web-bff/packages'
import ConfirmDialog from 'components/ConfirmDialog'

interface EditPackageDialogProps {
  open: boolean
  packageDetail: Package
  onClose: () => void
}

export default function EditPackageDialog(props: EditPackageDialogProps): JSX.Element {
  const { open, packageDetail, onClose } = props
  const { getUsername } = useAuth()
  const [visibleUpdateConfirmationDialog, setVisibleUpdateConfirmationDialog] =
    useState<boolean>(false)
  const formik = useFormik({
    initialValues: {
      packageId: packageDetail?.id,
      name: packageDetail?.name,
      day: packageDetail?.day,
      price: packageDetail?.price,
      isActive: packageDetail?.isActive,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        updatePackage(values.packageId, {
          name: values.name,
          day: values.day,
          price: values.price,
          isActive: values.isActive,
          updatedBy: getUsername(),
        } as unknown as UpdatePackage),
        {
          loading: 'กำลังอัพเดตข้อมูล',
          success: () => {
            onClose()
            return 'อัพเดตข้อมูลสำเร็จ'
          },
          error: () => {
            onClose()
            return 'อัพเดตข้อมูลไม่สำเร็จ'
          },
        }
      )
    },
  })
  return (
    <Dialog open={open} fullWidth aria-labelledby="form_edit_package_dialog_title">
      <DialogTitle id="form_edit_package_dialog_title">อัพเดตข้อมูลแพ็คเก็ต</DialogTitle>
      <form>
        <DialogContent>
          <GridSearchSection container spacing={1}>
            <GridTextField item xs={12}>
              <TextField
                type="text"
                name="packageName"
                id="package_detail__package_name_input"
                label="ชื่อแพ็คเก็ต"
                fullWidth
                variant="outlined"
                value={formik.values.name}
                onChange={({ target }) => formik.setFieldValue('name', target.value)}
              />
            </GridTextField>
            <GridTextField item xs={4}>
              <TextField
                type="number"
                name="packageDay"
                label="จำนวนวัน"
                id="package_detail__package_day_input"
                fullWidth
                variant="outlined"
                value={formik.values.day}
                InputProps={{
                  endAdornment: <InputAdornment position="end">วัน</InputAdornment>,
                }}
                onChange={({ target }) => formik.setFieldValue('day', target.value)}
              />
            </GridTextField>
            <GridTextField item xs={4}>
              <TextField
                type="number"
                name="packagePrice"
                id="package_detail__package_price_input"
                label="ราคาแพ็คเก็ต"
                fullWidth
                variant="outlined"
                value={formik.values.price}
                InputProps={{
                  endAdornment: <InputAdornment position="end">บาท</InputAdornment>,
                }}
                onChange={({ target }) => formik.setFieldValue('price', target.value)}
              />
            </GridTextField>
            <GridTextField item xs={4}>
              <TextField
                select
                name="packageStatus"
                id="package_detail__package_status_input"
                label="สถานะการใช้งาน"
                fullWidth
                variant="outlined"
                value={formik.values.isActive}
                onChange={({ target }) => formik.setFieldValue('isActive', target.value)}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="true">เปิดการใช้งาน</MenuItem>
                <MenuItem value="false">ปิดการใช้งาน</MenuItem>
              </TextField>
            </GridTextField>
          </GridSearchSection>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose()
            }}
            variant="contained"
            color="primary"
          >
            ยกเลิก
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setVisibleUpdateConfirmationDialog(true)}
          >
            ยืนยัน
          </Button>
        </DialogActions>
      </form>
      <ConfirmDialog
        open={visibleUpdateConfirmationDialog}
        title="อัพเดตข้อมูลแพ็คเก็ต"
        message="คุณแน่ใจหรือว่าต้องการอัพเดตข้อมูลแพ็คเก็ต"
        confirmText="ยืนยัน"
        cancelText="ยกเลิก"
        onConfirm={() => formik.handleSubmit()}
        onCancel={() => setVisibleUpdateConfirmationDialog(false)}
      />
    </Dialog>
  )
}
