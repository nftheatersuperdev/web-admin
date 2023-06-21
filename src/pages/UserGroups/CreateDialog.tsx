import { useEffect, useState } from 'react'
import { Grid, TextField, Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { UserGroupInput, UserGroup } from 'services/evme.types'
import { creatUserGroup } from 'services/web-bff/user'
import { UserGroupResponse } from 'services/web-bff/user.type'

interface CreateDialogProps {
  open: boolean
  userGroup?: UserGroup | null
  onClose: (reload: boolean) => void
}

const InputWrapper = styled.div`
  margin-top: 10px;
`
const ButtonSpace = styled(Button)`
  margin: 20px 10px 0 0 !important;
`

// eslint-disable-next-line complexity
export default function UserGroupCreateDialog({
  open,
  userGroup,
  onClose,
}: CreateDialogProps): JSX.Element {
  const { t } = useTranslation()
  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[a-zA-Z0-9]+$/, t('validation.invalidName'))
      .required(t('validation.required')),
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isNoChange, setIsNoChange] = useState<boolean>(true)

  const createUserGroup = (param: UserGroupInput): Promise<UserGroupResponse> => {
    return creatUserGroup(param)
  }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      name: userGroup?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)
      const requestBody: UserGroupInput = {
        name: values.name,
      }

      toast.promise(createUserGroup(requestBody), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          setIsLoading(false)
          onClose(true)
          return t('userGroups.dialog.create.success')
        },
        error: () => {
          setIsLoading(false)
          return t('userGroups.dialog.create.error')
        },
      })
    },
  })

  useEffect(() => {
    if (formik.values.name.length > 0) {
      setIsNoChange(false)
    } else {
      setIsNoChange(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.name])

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <InputWrapper>{t('userGroups.dialog.create.title')}</InputWrapper>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <InputWrapper>
              <TextField
                fullWidth
                label={t('userGroups.name')}
                id="name"
                name="name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                helperText={t('validation.allowOnlyLettersAndNumbers')}
                error={formik.touched.name && Boolean(formik.errors.name)}
              />
            </InputWrapper>
          </Grid>
        </Grid>
        <Box textAlign="left">
          <ButtonSpace
            disabled={isLoading || isNoChange}
            onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
            size="large"
          >
            {t('button.create').toUpperCase()}
          </ButtonSpace>
          <ButtonSpace
            onClick={() => {
              onClose(false)
              setIsNoChange(false)
              formik.resetForm()
            }}
            color="primary"
            variant="outlined"
            size="large"
            disabled={isLoading}
          >
            {t('button.cancel').toUpperCase()}
          </ButtonSpace>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
