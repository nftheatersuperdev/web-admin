import { useTranslation } from 'react-i18next'
import { Table, Typography } from '@mui/material'
// import { useStyles } from 'theme/theme-style'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { ContentSection, TableContainerWithNoBorder, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import { CustomChip } from 'components/CustomChip'

export default function NewDocuments(): JSX.Element {
  const { t } = useTranslation()
  const headerText: TableHeaderProps[] = [
    {
      text: t('newDocuments.overview.codeName'),
    },
    {
      text: t('newDocuments.overview.nameEN'),
    },
    {
      text: t('newDocuments.overview.nameTH'),
    },
    {
      text: t('newDocuments.overview.activeVersion'),
    },
    {
      text: t('newDocuments.overview.lastUpdated'),
    },
  ]
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.documentsManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.documentsManagement.newDocument'),
      link: '/consents-log',
    },
  ]
  return (
    <Page>
      <PageTitle title={t('sidebar.documentsManagement.newDocument')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('newDocuments.header')}
          </Typography>
        </ContentSection>
        <TableContainerWithNoBorder>
          <CustomChip label={t('newDocuments.statuses.active')} color="green" />
          <Table id="documents_list___table">
            <DataTableHeader headers={headerText} />
          </Table>
        </TableContainerWithNoBorder>
      </Wrapper>
    </Page>
  )
}
