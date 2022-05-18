import styled from 'styled-components'
import { useHistory, Link as RouterLink } from 'react-router-dom'
import {
  Breadcrumbs,
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
} from '@material-ui/core'
import { Edit as EditIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { Page } from 'layout/LayoutRoute'

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`

const createData = (
  id: string,
  nameEn: string,
  nameTh: string,
  code: string,
  activeVersion: string,
  lastUpdated: string
) => {
  return {
    id,
    nameEn,
    nameTh,
    code,
    activeVersion,
    lastUpdated,
  }
}

export default function Documents(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()

  const rows = [
    createData(
      'document_001',
      'Terms and Conditions',
      'ข้อกำหนดและเงื่อนไข',
      'TermsAndCondition',
      '1.2',
      '16/04/2022'
    ),
  ]

  return (
    <Page>
      <Typography variant="h3" color="inherit" component="h1">
        {t('documents.header')}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Typography color="textPrimary">{t('documents.header')}</Typography>
      </BreadcrumbsWrapper>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{t('documents.overview.nameTH')}</TableCell>
              <TableCell>{t('documents.overview.nameEN')}</TableCell>
              <TableCell>{t('documents.overview.codeName')}</TableCell>
              <TableCell>{t('documents.overview.activeVersion')}</TableCell>
              <TableCell>{t('documents.overview.lastUpdated')}</TableCell>
              <TableCell>&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.nameTh}</TableCell>
                <TableCell>{row.nameEn}</TableCell>
                <TableCell>{row.code}</TableCell>
                <TableCell>{row.activeVersion}</TableCell>
                <TableCell>{row.lastUpdated}</TableCell>
                <TableCell>
                  <IconButton onClick={() => history.push(`/documents/${row.id}/versions`)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Page>
  )
}
