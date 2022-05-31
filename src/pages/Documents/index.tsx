import dayjs from 'dayjs'
import styled from 'styled-components'
import { useState } from 'react'
import { useQuery } from 'react-query'
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
import { Edit as EditIcon, Search as SearchIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Page } from 'layout/LayoutRoute'
import { getList } from 'services/web-bff/document'

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`

export default function Documents(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [page] = useState<number>(1)
  const [size] = useState<number>(10)

  const { data: response } = useQuery('documents', () => getList({ page, size }))

  const rows = response?.documents?.map((document) => document) || []

  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
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
              <TableCell>{t('documents.overview.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.nameTh}</TableCell>
                <TableCell>{row.nameEn}</TableCell>
                <TableCell>{row.codeName}</TableCell>
                <TableCell>{row.version}</TableCell>
                <TableCell>{dayjs(row.updatedDate).format(DEFAULT_DATETIME_FORMAT)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      history.push(`/documents/${row.codeName}/versions/${row.version}`)
                    }
                  >
                    <SearchIcon />
                  </IconButton>
                  <IconButton onClick={() => history.push(`/documents/${row.codeName}/versions`)}>
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
