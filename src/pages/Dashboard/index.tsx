import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'
import PageTitle from 'components/PageTitle'
import { ContentSection, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'

export default function Dashboard(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Page>
      <PageTitle title={t('sidebar.dashboard')} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2" />
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
