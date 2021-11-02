import { useState } from 'react'
import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import { useFormik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useCreateUserGroup } from 'services/evme'
import { UserGroupCreateInput } from 'services/evme.types'

interface CreateDialogProps {
  open: boolean
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

// eslint-disable-next-line complexity
export default function UserGroupCreateDialog({ open, onClose }: CreateDialogProps): JSX.Element {
  const { t } = useTranslation()
  const createUserGroup = useCreateUserGroup()
  const validationSchema = yup.object({
    name: yup.string().required(t('validation.required')),
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)

      const object: UserGroupCreateInput = {
        name: values.name,
      }

      toast.promise(createUserGroup.mutateAsync(object), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          setIsLoading(false)
          onClose()
          return t('userGroups.dialog.create.success')
        },
        error: () => {
          setIsLoading(false)
          return t('userGroups.dialog.create.error')
        },
      })
    },
  })

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('userGroups.dialog.create.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('userGroups.name')}
              id="name"
              name="name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace
          onClick={() => {
            onClose()
            formik.resetForm()
          }}
          color="primary"
          disabled={isLoading}
        >
          {t('button.cancel')}
        </ButtonSpace>
        <ButtonSpace
          disabled={isLoading}
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
        >
          {t('button.create')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
