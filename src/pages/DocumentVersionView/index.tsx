/* eslint-disable react/no-danger */
import dayjs from 'dayjs'
import styled from 'styled-components'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Breadcrumbs, Divider, Grid, Link, Typography, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Page } from 'layout/LayoutRoute'
import { getDetail, getVersionDetail } from 'services/web-bff/document'

interface DocumentVersionViewParams {
  documentCode: string
  version: string
}

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`
const ContentDiv = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #ccc;
`

export default function DocumentVersionView(): JSX.Element {
  const { documentCode, version } = useParams<DocumentVersionViewParams>()
  const { t, i18n } = useTranslation()
  const currentVersion = +version
  const currentLanguage = i18n.language

  const { data: documentDetail } = useQuery('document-detail', () =>
    getDetail({ code: documentCode })
  )
  const { data: document } = useQuery('document', () =>
    getVersionDetail({ code: documentCode, version: currentVersion })
  )

  const documentName = currentLanguage === 'th' ? documentDetail?.nameTh : documentDetail?.nameEn
  const title = `${documentName} (${t('documents.versions.title')} ${version})`

  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {title}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Link underline="hover" color="inherit" component={RouterLink} to="/documents">
          {t('documents.header')}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to={`/documents/${documentCode}/versions`}
        >
          {t('documents.overviewAndVersions')}
        </Link>
        <Typography color="textPrimary">{title}</Typography>
      </BreadcrumbsWrapper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('documents.addEdit.effectiveDate')}
            id="effectiveDate"
            name="effectiveDate"
            variant="outlined"
            value={
              document?.effectiveDate
                ? dayjs(document?.effectiveDate).format(DEFAULT_DATETIME_FORMAT)
                : '-'
            }
            InputLabelProps={{
              shrink: true,
              'aria-readonly': true,
            }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('documents.addEdit.revisionSummary')}
            id="remark"
            name="remark"
            variant="outlined"
            value={document?.remark || '-'}
            InputLabelProps={{
              shrink: true,
              'aria-readonly': true,
            }}
            InputProps={{
              readOnly: true,
            }}
            multiline
            rows={5}
          />
        </Grid>
      </Grid>
      <DividerSpace />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" color="inherit" component="h2">
            {t('documents.addEdit.contentTh')}
          </Typography>
          <ContentDiv dangerouslySetInnerHTML={{ __html: document?.contentTh || '' }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" color="inherit" component="h2">
            {t('documents.addEdit.contentEn')}
          </Typography>
          <ContentDiv dangerouslySetInnerHTML={{ __html: document?.contentEn || '' }} />
        </Grid>
      </Grid>
    </Page>
  )
}
