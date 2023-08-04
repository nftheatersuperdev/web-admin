import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  createFilterOptions,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { GridTextField } from 'components/Styled'
import {
  createAndLinkAdditionalAccounts,
  getAvailableAdditionalAccounts,
  linkAdditionalAccounts,
} from 'services/web-bff/netflix'
import { AvailableAddition, CreateAdditionAccountRequest } from 'services/web-bff/netflix.type'

interface AddNewAdditionalScreenDialogProps {
  open: boolean
  accountId: string
  accountName: string
  onClose: () => void
}

export default function AddNewAdditionalScreenDialog(
  props: AddNewAdditionalScreenDialogProps
): JSX.Element {
  const useStyles = makeStyles({
    createButton: {
      textAlign: 'right',
    },
    hideObject: {
      display: 'none',
    },
  })
  const classes = useStyles()
  const { open, accountId, accountName, onClose } = props
  const { t } = useTranslation()
  const [isCreateNewAdditional, setIsCreateNewAdditional] = useState<boolean>(false)
  const { data: additionalOptionList } = useQuery('additional-option', () =>
    getAvailableAdditionalAccounts()
  )
  const additionalOptions = additionalOptionList || []
  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: AvailableAddition) => option.email,
  })
  const formikCreateAdditional = useFormik({
    initialValues: {
      accountId,
      email: '',
      password: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().max(255).required('กรุณาระบุอีเมลล์เสริม'),
      password: Yup.string().max(255).required('กรุณาระบุรหัสผ่าน'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        createAndLinkAdditionalAccounts(
          {
            email: values.email,
            password: values.password,
          } as CreateAdditionAccountRequest,
          accountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            formikCreateAdditional.resetForm()
            onClose()
            return 'เพิ่มบัญชีเสริม ' + values.email + ' สำเร็จ'
          },
          error: () => {
            return 'เพิ่มบัญชีเสริมไม่สำเร็จ'
          },
        }
      )
    },
  })
  const formikAddAdditional = useFormik({
    initialValues: {
      accountId,
      additionalId: '',
    },
    validationSchema: Yup.object().shape({
      additionalId: Yup.string().max(255).required('กรุณาเลือกอีเมลล์เสริม'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(linkAdditionalAccounts(values.accountId, values.additionalId), {
        loading: t('toast.loading'),
        success: () => {
          formikAddAdditional.resetForm()
          onClose()
          return 'เพิ่มบัญชีเสริม ' + values.additionalId + ' สำเร็จ'
        },
        error: () => {
          return 'เพิ่มบัญชีเสริม ' + values.additionalId + ' ไม่สำเร็จ'
        },
      })
    },
  })
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            {t('netflix.addScreen')}
          </Grid>
          <GridTextField item xs={6} sm={6} className={classes.createButton}>
            <Button
              className={!isCreateNewAdditional ? '' : classes.hideObject}
              variant="contained"
              onClick={() => setIsCreateNewAdditional(true)}
            >
              สร้างบัญชีเสริมใหม่
            </Button>
            <Button
              className={isCreateNewAdditional ? '' : classes.hideObject}
              variant="contained"
              onClick={() => setIsCreateNewAdditional(false)}
            >
              เลือกบัญชีเสริม
            </Button>
          </GridTextField>
        </Grid>
      </DialogTitle>
      {isCreateNewAdditional ? (
        <form onSubmit={formikCreateAdditional.handleSubmit}>
          <DialogContent>
            <Grid container spacing={1}>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  disabled
                  name="accountName"
                  id="netflix_add_account_name"
                  label={t('netflix.mainInfo.accountName')}
                  fullWidth
                  variant="outlined"
                  value={accountName}
                />
              </GridTextField>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="email"
                  name="email"
                  placeholder="กรุณาระบุอีเมลล์ของจอเสริม"
                  id="netflix_add_email"
                  label={t('netflix.mainInfo.email')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateAdditional.values.email}
                  error={Boolean(
                    formikCreateAdditional.touched.email && formikCreateAdditional.errors.email
                  )}
                  helperText={
                    formikCreateAdditional.touched.email && formikCreateAdditional.errors.email
                  }
                  onChange={({ target }) =>
                    formikCreateAdditional.setFieldValue('email', target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
              <GridTextField item xs={12}>
                <TextField
                  type="text"
                  name="password"
                  placeholder="กรุณาระบุรหัสผ่านของจอเสริม"
                  id="netflix_add_password"
                  label={t('netflix.mainInfo.password')}
                  fullWidth
                  variant="outlined"
                  value={formikCreateAdditional.values.password}
                  error={Boolean(
                    formikCreateAdditional.touched.password &&
                      formikCreateAdditional.errors.password
                  )}
                  helperText={
                    formikCreateAdditional.touched.password &&
                    formikCreateAdditional.errors.password
                  }
                  onChange={({ target }) =>
                    formikCreateAdditional.setFieldValue('password', target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </GridTextField>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose()
              }}
              color="primary"
            >
              {t('button.cancel')}
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {t('button.create')}
            </Button>
          </DialogActions>
        </form>
      ) : (
        <form onSubmit={formikAddAdditional.handleSubmit}>
          <DialogContent>
            <Grid container spacing={1}>
              <GridTextField item xs={12} sm={12}>
                <TextField
                  type="text"
                  disabled
                  name="accountName"
                  id="netflix_add_account_name"
                  label={t('netflix.mainInfo.accountName')}
                  fullWidth
                  variant="outlined"
                  value={accountName}
                />
              </GridTextField>
              <GridTextField item xs={12} sm={12}>
                <Autocomplete
                  options={additionalOptions}
                  getOptionLabel={(option) => (option ? option.email : '')}
                  filterOptions={filterOptions}
                  noOptionsText="ไม่พบอีเมลล์บัญชีเสริม"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="อีเมลล์"
                      variant="outlined"
                      placeholder="สามารถค้นหาด้วยอีเมลล์"
                      error={Boolean(
                        formikAddAdditional.touched.additionalId &&
                          formikAddAdditional.errors.additionalId
                      )}
                      helperText={
                        formikAddAdditional.touched.additionalId &&
                        formikAddAdditional.errors.additionalId
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                  onChange={(_event, value) =>
                    formikAddAdditional.setFieldValue('additionalId', value?.additionalId)
                  }
                />
              </GridTextField>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                onClose()
              }}
              color="primary"
            >
              {t('button.cancel')}
            </Button>
            <Button color="primary" variant="contained" type="submit">
              {t('button.add')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  )
}
