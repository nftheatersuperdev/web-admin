/* eslint-disable react/forbid-component-props */
import styled from 'styled-components'
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
import { Page } from 'layout/LayoutRoute'

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

const createData = (
  id: string,
  no: number,
  createdDate: string,
  createdBy: string,
  version: string,
  status: string,
  effectiveDate: string,
  revisionSummary: string
) => {
  return {
    id,
    no,
    createdDate,
    createdBy,
    version,
    status,
    effectiveDate,
    revisionSummary,
  }
}

export default function DocumentVersions(): JSX.Element {
  const { documentCode } = useParams<DocumentVersionsParams>()
  const history = useHistory()
  const { t } = useTranslation()

  const rows = [
    createData(
      'version_002',
      2,
      '10/05/2022 13:00',
      'SuperAdmin',
      '1.2',
      'Scheduled',
      '15/05/2022 12:00',
      'Fix typo'
    ),
    createData(
      'version_001',
      1,
      '10/05/2022 12:00',
      'SuperAdmin',
      '1.1',
      'Scheduled',
      '15/05/2022 12:00',
      'Update accoring to new regulation blah blah'
    ),
  ]

  return (
    <Page>
      <Typography variant="h3" color="inherit" component="h1">
        {t('documents.overviewAndVersions')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Link underline="hover" color="inherit" component={RouterLink} to="/documents">
          {t('documents.header')}
        </Link>
        <Typography color="textPrimary">ข้อกำหนดและเงื่อนไข (Terms & Condition)</Typography>
      </BreadcrumbsWrapper>

      <Typography variant="h4" color="inherit" component="h2">
        {t('documents.overview.title')}
      </Typography>
      <CardWrapper>
        <UiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.id')}</DivOverviewTitle>
            <DivOverviewValue>document_001</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.nameEN')}</DivOverviewTitle>
            <DivOverviewValue>Terms & Condition</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.nameTH')}</DivOverviewTitle>
            <DivOverviewValue>ข้อกำหนดและเงื่อนไข</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.codeName')}</DivOverviewTitle>
            <DivOverviewValue>TermsAndCondition</DivOverviewValue>
          </UiLiOverviewWrapper>
          <UiLiOverviewWrapper>
            <DivOverviewTitle>{t('documents.overview.activeVersion')}</DivOverviewTitle>
            <DivOverviewValue>1.2</DivOverviewValue>
          </UiLiOverviewWrapper>
        </UiOverviewWrapper>
      </CardWrapper>

      <ToolbarWrapper>
        <Typography variant="h4" color="inherit" component="h2" style={{ flex: 1 }}>
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
                <TableCell>&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={`${documentCode}-${row.id}`}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.createdDate}</TableCell>
                  <TableCell>{row.createdBy}</TableCell>
                  <TableCell>{row.version}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>{row.effectiveDate}</TableCell>
                  <TableCell>{row.revisionSummary}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => history.push(`/documents/${documentCode}/versions/${row.id}`)}
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
