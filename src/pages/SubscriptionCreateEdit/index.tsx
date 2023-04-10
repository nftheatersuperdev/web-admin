/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-component-props */
import styled from 'styled-components'
import { Breadcrumbs, Divider, Typography } from '@material-ui/core'
import { Stack } from '@mui/material'
import { Page } from 'layout/LayoutRoute'
import PackageDetail from 'pages/SubscriptionCreateEdit/PackageDetail'
// import { useTranslation } from 'react-i18next'
// import { useHistory } from 'react-router-dom'

const PageSpacing = styled(Page)`
  margin: 0px 20px 0px 20px;
`
const TitleTypography = styled(Typography)`
  margin-top: 20px;
  margin-bottom: 2px;
`

const TitleBreadcrumbs = styled(Breadcrumbs)`
  margin-bottom: 24px;
`

const DividerSpace = styled(Divider)`
  margin-bottom: 24px;
`

export default function VoucherCreateEdit(): JSX.Element {
  // const { t } = useTranslation()
  // const history = useHistory()
  return (
    <PageSpacing>
      <TitleTypography variant="h5">Package Management</TitleTypography>
      <TitleBreadcrumbs>
        <Typography variant="body1">Subscription Management</Typography>
        <Typography variant="body1">Package Management</Typography>
        <Typography variant="body1" color="textPrimary">
          Package Detail
        </Typography>
      </TitleBreadcrumbs>
      <DividerSpace />
      <Stack spacing={6}>
        <PackageDetail />
        {/* <Card>
            <Button type="submit" color="primary" variant="outlined" onClick={() => formik.handleSubmit()}>
              {t('button.save')}
            </Button>
            &nbsp;&nbsp;
            <Button variant="outlined" onClick={() => history.goBack()}>
              {t('button.cancel')}
            </Button>
        </Card> */}
      </Stack>
    </PageSpacing>
  )
}
