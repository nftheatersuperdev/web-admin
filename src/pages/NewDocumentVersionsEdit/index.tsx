import { InputAdornment, TextField, Typography } from '@mui/material'
import { useState } from 'react'
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
import HTMLEditor from 'components/HTMLEditor'

export default function NewDocumentVersionsEdit(): JSX.Element {
  const { t, i18n } = useTranslation()
  const { documentCode, version } = useParams<DocumentVersionsEditParams>()
  const [contentThTemp, setContentThTemp] = useState<string | undefined>()
  const [contentEnTemp, setContentEnTemp] = useState<string | undefined>()
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
  const handleOnDescriptionChange = (value: string, language: string) => {
    if (language === 'th') {
      setContentThTemp(value)
    }
    setContentEnTemp(value)
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.documentsManagement.newDocument')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          {!isEdit ? (
            <Typography id="document_detail_title" variant="h6" component="h2">
              {t('newDocuments.views.title', { docName })}
            </Typography>
          ) : (
            <Typography variant="h6" component="h2">
              {t('newDocuments.addEdit.titles.edit', { docName })}
            </Typography>
          )}
          <GridSearchSection container spacing={1}>
            <GridTextField item xs={6} sm={6}>
              <TextField
                fullWidth
                label={t('newDocuments.addEdit.effectiveDate')}
                id="document_detail_effectiveDate"
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
            </GridTextField>

            <GridTextField item xs={12} sm={12}>
              <TextField
                fullWidth
                disabled={!isEdit}
                label={t('newDocuments.addEdit.revisionSummary')}
                id="document_detail_remark"
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
                id="document_detail_contentTh"
                disabled={!isEdit}
                label={t('newDocuments.addEdit.contentTh')}
                initialValue={currentDocument?.contentTh || contentThTemp}
                handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'th')}
              />
            </GridTextField>
            <GridTextField xs={12} sm={12}>
              <HTMLEditor
                id="document_detail_contentEn"
                disabled={!isEdit}
                label={t('newDocuments.addEdit.contentEn')}
                initialValue={currentDocument?.contentEn || contentEnTemp}
                handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'en')}
              />
            </GridTextField>
          </GridSearchSection>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
