import { useEffect, useState } from 'react'
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
import { useCreateUserGroup, useChangeUserGroup } from 'services/evme'
import { UserGroupInput, UserGroup } from 'services/evme.types'

interface CreateDialogProps {
  open: boolean
  userGroup?: UserGroup | null
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

// eslint-disable-next-line complexity
export default function UserGroupCreateUpdateDialog({
  open,
  userGroup,
  onClose,
}: CreateDialogProps): JSX.Element {
  const isUpdate = !!userGroup

  const { t } = useTranslation()
  const createUserGroup = useCreateUserGroup()
  const changeUserGroup = useChangeUserGroup()
  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[a-zA-Z0-9]+$/, t('validation.invalidName'))
      .required(t('validation.required')),
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isNoChange, setIsNoChange] = useState<boolean>(true)

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: userGroup?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)
      const userGroupId = userGroup?.id

      const requestBody: UserGroupInput = {
        name: values.name,
      }

      const mutateFunction = isUpdate ? changeUserGroup : createUserGroup
      const mutateObject = isUpdate ? { id: userGroupId, ...requestBody } : requestBody
      const toastMessages = {
        success: isUpdate
          ? t('userGroups.dialog.update.success')
          : t('userGroups.dialog.create.success'),
        error: isUpdate ? t('userGroups.dialog.update.error') : t('userGroups.dialog.create.error'),
      }

      toast.promise(mutateFunction.mutateAsync(mutateObject), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          setIsLoading(false)
          onClose()
          return toastMessages.success
        },
        error: () => {
          setIsLoading(false)
          return toastMessages.error
        },
      })
    },
  })

  useEffect(() => {
    if (isUpdate) {
      if (userGroup?.name !== formik.values.name) {
        setIsNoChange(false)
      } else {
        setIsNoChange(true)
      }
    } else {
      if (formik.values.name.length > 0) {
        setIsNoChange(false)
      } else {
        setIsNoChange(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.name])

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isUpdate ? t('userGroups.dialog.update.title') : t('userGroups.dialog.create.title')}
      </DialogTitle>
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
              helperText={t('validation.allowOnlyLettersAndNumbers')}
              error={formik.touched.name && Boolean(formik.errors.name)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace
          onClick={() => {
            onClose()
            setIsNoChange(false)
            formik.resetForm()
          }}
          color="primary"
          disabled={isLoading}
        >
          {t('button.cancel')}
        </ButtonSpace>
        <ButtonSpace
          disabled={isLoading || isNoChange}
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
        >
          {t(isUpdate ? 'button.update' : 'button.create')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
