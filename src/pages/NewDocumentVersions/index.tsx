import { Card, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageTitle from 'components/PageTitle'
import styled from 'styled-components'
import { Page } from 'layout/LayoutRoute'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`

export default function NewDocumentVersions(): JSX.Element {
  const { t } = useTranslation()
  return (
    <Page>
      <PageTitle title={t('sidebar.documentsManagement.newDocument')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('newDocuments.header')}
          </Typography>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
