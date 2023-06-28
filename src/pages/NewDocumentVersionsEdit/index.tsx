import { InputAdornment, TextField, Typography } from '@mui/material'
import { CalendarMonth } from '@mui/icons-material'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { DocumentVersionsEditParams, defaultDocumentOverview } from 'utils/document'
import { useQuery } from 'react-query'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT } from 'utils'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { Wrapper, ContentSection, GridSearchSection, GridTextField } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import { getVersionDetail } from 'services/web-bff/document'
import DateTimePicker from 'components/DateTimePicker'
import HTMLEditor from 'components/HTMLEditor'

export default function NewDocumentVersionsEdit(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { documentCode, version } = useParams<DocumentVersionsEditParams>()
  const currentVersion = +version
  const { data: currentDocument, isFetching: isFetchingCurrentDoc } = useQuery(
    'document-current-version',
    () => getVersionDetail({ code: documentCode, version: currentVersion }),
    {
      cacheTime: 0,
    }
  )
  const isEdit = currentDocument?.status.toLowerCase() === 'schedule' ? true : false
  const currentDocumentVersion = isFetchingCurrentDoc ? defaultDocumentOverview : currentDocument
  const getBreadcrumbName = () => {
    if (isFetchingCurrentDoc) {
      return documentCode
    }
    return i18n.language === 'th' ? currentDocumentVersion?.nameTh : currentDocumentVersion?.nameEn
  }
  const docName = getBreadcrumbName()
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.documentsManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.documentsManagement.newDocument'),
      link: '/new-documents',
    },
    {
      text: docName || '',
      link: '/new-documents/' + documentCode + '/versions',
    },
    {
      text: t('newDocuments.detail', { docName }) || '',
      link: '/',
    },
  ]
  const effectiveDate = dayjs(currentDocument?.effectiveDate) || dayjs()
  return (
    <Page>
      <PageTitle title={t('sidebar.documentsManagement.newDocument')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          {!isEdit ? (
            <Typography variant="h6" component="h2">
              {t('newDocuments.views.title', { docName })}
            </Typography>
          ) : (
            <Typography variant="h6" component="h2">
              {t('newDocuments.addEdit.titles.edit', { docName })}
            </Typography>
          )}
          <GridSearchSection container spacing={1}>
            <GridTextField item xs={6} sm={6}>
              {!isEdit ? (
                <TextField
                  fullWidth
                  label={t('newDocuments.addEdit.effectiveDate')}
                  id="effectiveDate"
                  name="effectiveDate"
                  variant="outlined"
                  value={
                    currentDocument?.effectiveDate
                      ? dayjs(currentDocument?.effectiveDate).format(
                          DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                        )
                      : '-'
                  }
                  InputLabelProps={{
                    shrink: true,
                    'aria-readonly': true,
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <CalendarMonth />
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <DateTimePicker
                  inputVariant="outlined"
                  fullWidth
                  disabled={isEdit}
                  value={effectiveDate}
                  format={DEFAULT_DATETIME_FORMAT_MONTH_TEXT}
                  onChange={(date) => {
                    console.log(date)
                  }}
                  label={t('newDocuments.addEdit.effectiveDate')}
                />
              )}
            </GridTextField>

            <GridTextField item xs={12} sm={12}>
              <TextField
                fullWidth
                disabled={!isEdit}
                label={t('newDocuments.addEdit.revisionSummary')}
                id="remark"
                name="remark"
                variant="outlined"
                value={currentDocument?.remark || '-'}
                InputLabelProps={{
                  shrink: true,
                  'aria-readonly': true,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </GridTextField>
            <GridTextField xs={12} sm={12}>
              <HTMLEditor
                id="document_version_contentTh___id"
                disabled={!isEdit}
                label={t('newDocuments.addEdit.contentTh')}
                initialValue={currentDocument?.contentTh || '-'}
                handleOnEditChange={(value: string) => console.log(value)}
              />
            </GridTextField>
            <GridTextField xs={12} sm={12}>
              <HTMLEditor
                id="document_version_contentEn___id"
                disabled={!isEdit}
                label={t('newDocuments.addEdit.contentEn')}
                initialValue={currentDocument?.contentEn || '-'}
                handleOnEditChange={(value: string) => console.log(value)}
              />
            </GridTextField>
          </GridSearchSection>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
