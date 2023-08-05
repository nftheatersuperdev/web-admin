import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageTitle from 'components/PageTitle'
import { ContentSection, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'

export default function Youtube(): JSX.Element {
  const { t } = useTranslation()
  return (
    <Page>
      <PageTitle title={t('sidebar.youtubeAccount.title')} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('youtube.searchPanel')}
          </Typography>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
