import styled from 'styled-components'
import { Button, Card, Grid, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useParams, useHistory, Link } from 'react-router-dom'
import { useFormik } from 'formik'
import dayjs from 'dayjs'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, validatePrivileges } from 'utils'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ROUTE_PATHS } from 'routes'
import { useAuth } from 'auth/AuthContext'
import { Page } from 'layout/LayoutRoute'
import Backdrop from 'components/Backdrop'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { searchCustomerGroup } from 'services/web-bff/customer'
import { updateUserGroup } from 'services/web-bff/user'

const Wrapper = styled.div`
  padding: 20px;
`
const DisableTextField = styled(TextField)`
  background: #f5f5f5 !important;
`
const ButtonSpace = styled(Button)`
  margin: 20px 10px 0 0 !important;
`

export default function Booking(): JSX.Element {
  const { t } = useTranslation()
  const { getPrivileges } = useAuth()
  const userPrivileges = getPrivileges()
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const pageTitle = t('voucherManagement.userGroup.detail.title')

  const { data, isFetching, isFetched } = useQuery(
    `user-group-detail-${id}`,
    () =>
      searchCustomerGroup({
        data: {
          id,
        },
      }),
    {
      refetchOnWindowFocus: false,
      cacheTime: 0,
    }
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const isDisabledButton =
    isLoading || isFetching || !validatePrivileges(userPrivileges, 'PERM_CUSTOMER_GROUP_EDIT')

  const customerGroup = data?.data.customerGroups[0]

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values, actions) => {
      setIsLoading(true)
      toast.promise(
        updateUserGroup({
          id,
          ...values,
        }),
        {
          loading: t('toast.loading'),
          success: () => {
            actions.setSubmitting(true)
            setIsLoading(false)
            history.push(ROUTE_PATHS.USER_GROUPS)
            return t('voucherManagement.userGroup.detail.formEdit.success')
          },
          error: (error) => {
            actions.setSubmitting(false)
            setIsLoading(false)
            return error.message || t('voucherManagement.userGroup.detail.formEdit.error')
          },
        }
      )
    },
  })

  useEffect(() => {
    if (isFetched && customerGroup && !formik.values.name) {
      formik.setFieldValue('name', customerGroup.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched])

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.voucherManagement.title'),
      link: ROUTE_PATHS.ROOT,
    },
    {
      text: t('voucherManagement.userGroup.title'),
      link: ROUTE_PATHS.USER_GROUPS,
    },
    {
      text: pageTitle,
      link: `${ROUTE_PATHS.USER_GROUPS}/${id}`,
    },
  ]

  return (
    <Page>
      <PageTitle title={pageTitle} breadcrumbs={breadcrumbs} />
      <form onSubmit={formik.handleSubmit}>
        <Card>
          <Wrapper>
            <Typography id="user_group_title_table" variant="h6">
              <strong>{pageTitle}</strong>
            </Typography>
            <br />
            <Grid container spacing={6}>
              <Grid item xs={12} sm={6} md={6}>
                <DisableTextField
                  fullWidth
                  label={t('voucherManagement.userGroup.detail.id')}
                  id="id"
                  name="id"
                  value={customerGroup?.id}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  label={t('voucherManagement.userGroup.detail.name')}
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={isDisabledButton}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DisableTextField
                  fullWidth
                  label={t('voucherManagement.userGroup.detail.createdDate')}
                  id="createdDate"
                  name="createdDate"
                  value={dayjs(customerGroup?.createdDate).format(
                    DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                  )}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <DisableTextField
                  fullWidth
                  label={t('voucherManagement.userGroup.detail.updatedDate')}
                  id="updatedDate"
                  name="updatedDate"
                  value={dayjs(customerGroup?.updatedDate).format(
                    DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                  )}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
          </Wrapper>
        </Card>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <ButtonSpace
              type="submit"
              color="primary"
              variant="contained"
              size="large"
              disabled={isDisabledButton}
            >
              {t('button.save').toUpperCase()}
            </ButtonSpace>
            <Link to="/user-groups">
              <ButtonSpace
                onClick={() => formik.resetForm()}
                color="primary"
                variant="outlined"
                size="large"
                disabled={isDisabledButton}
              >
                {t('button.cancel').toUpperCase()}
              </ButtonSpace>
            </Link>
          </Grid>
        </Grid>
      </form>
      <Backdrop open={isFetching} />
    </Page>
  )
}
