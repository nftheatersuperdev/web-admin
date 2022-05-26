/* eslint-disable react/forbid-component-props */
import dayjs from 'dayjs'
import styled from 'styled-components'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useHistory, Link as RouterLink, useParams } from 'react-router-dom'
import {
  Button,
  Breadcrumbs,
  Card,
  IconButton,
  Link,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
} from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Page } from 'layout/LayoutRoute'
import { getDetail, getVersionList } from 'services/web-bff/document'

interface DocumentVersionsParams {
  documentCode: string
}

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const CardWrapper = styled(Card)`
  padding: 20px;
  margin: 20px 0;
`
const ToolbarWrapper = styled(Toolbar)`
  padding: 0;
`
const TableWrapper = styled.div``
const UiOverviewWrapper = styled.ul`
  list-style: none;
`
const UiLiOverviewWrapper = styled.li`
  width: 100%;
  display: inline-block;
`
const DivOverviewTitle = styled.div`
  width: 220px;
  float: left;
  font-weight: bold;
`
const DivOverviewValue = styled.div`
  float: left;
`

export default function DocumentVersions(): JSX.Element {
  const { documentCode } = useParams<DocumentVersionsParams>()
  const history = useHistory()
  const { t, i18n } = useTranslation()
  const [page] = useState<number>(1)
  const [size] = useState<number>(1000)
  const isThaiLanguage = i18n.language === 'th'

  const { data: documentDetail } = useQuery('document-detail', () =>
    getDetail({ code: documentCode })
  )
  const { data: documents } = useQuery('documents', () =>
    getVersionList({ code: documentCode, page, size })
  )

  const rows = documents?.versions?.map((document) => document) || []

  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {t('documents.overviewAndVersions')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Link underline="hover" color="inherit" component={RouterLink} to="/documents">
          {t('documents.header')}
        </Link>
        <Typography color="textPrimary">
          {isThaiLanguage ? documentDetail?.nameTh : documentDetail?.nameEn}
        </Typography>
      </BreadcrumbsWrapper>

      <Typography variant="h6" color="inherit" component="h2">
        {t('documents.overview.title')}
      </Typography>
      <CardWrapper>
        <UiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.id')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.id}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.nameEN')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.nameEn}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.nameTH')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.nameTh}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.codeName')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.codeName}</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.activeVersion')}</DivOverviewTitle>
            <DivOverviewValue>{documentDetail?.version}</DivOverviewValue>
          </UiLiOverviewWrapper>
        </UiOverviewWrapper>
      </CardWrapper>

      <ToolbarWrapper>
        <Typography variant="h6" color="inherit" component="h2" style={{ flex: 1 }}>
          {t('documents.versions.title')}
        </Typography>
        <div>
          <Button
            color="primary"
            variant="contained"
            onClick={() => history.push(`/documents/${documentCode}/versions/add`)}
          >
            {t('documents.versions.buttons.addNewVersion')}
          </Button>
        </div>
      </ToolbarWrapper>
      <TableWrapper>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>{t('documents.versions.no')}</TableCell>
                <TableCell>{t('documents.versions.createdDate')}</TableCell>
                <TableCell>{t('documents.versions.createdBy')}</TableCell>
                <TableCell>{t('documents.versions.version')}</TableCell>
                <TableCell>{t('documents.versions.status')}</TableCell>
                <TableCell>{t('documents.versions.effectiveDate')}</TableCell>
                <TableCell>{t('documents.versions.revisionSummary')}</TableCell>
                <TableCell>{t('documents.overview.action')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${documentCode}-${row.id}`}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{dayjs(row.createdDate).format(DEFAULT_DATETIME_FORMAT)}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell>{row.version}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{dayjs(row.effectiveDate).format(DEFAULT_DATETIME_FORMAT)}</TableCell>
                  <TableCell>{row.remark || '-'}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        history.push(`/documents/${documentCode}/versions/${row.version}`)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TableWrapper>
    </Page>
  )
}
