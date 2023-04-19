/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-component-props */
import styled from 'styled-components'
import { Breadcrumbs, Divider, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { Page } from 'layout/LayoutRoute'
import PackageDetail from 'pages/SubscriptionCreateEdit/PackageDetail'

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
  const { t } = useTranslation()
  return (
    <PageSpacing>
      <TitleTypography variant="h5">{t('newSubcription.createEdit.title')}</TitleTypography>
      <TitleBreadcrumbs>
        <Typography variant="body1">
          {t('newSubcription.createEdit.subscriptionManagement')}
        </Typography>
        <Typography variant="body1">{t('newSubcription.createEdit.packageManagement')}</Typography>
        <Typography variant="body1" color="textPrimary">
          {t('newSubcription.createEdit.packageDetail')}
        </Typography>
      </TitleBreadcrumbs>
      <DividerSpace />
      <PackageDetail />
    </PageSpacing>
  )
}
