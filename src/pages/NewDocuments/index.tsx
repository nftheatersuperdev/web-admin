import { Fragment, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
// import { useStyles } from 'theme/theme-style'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
// import { ContentSection, TableContainerWithNoBorder, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import { getList } from 'services/web-bff/document'
import Paginate from 'components/Paginate'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const GridSearchSection = styled(Grid)`
  padding-top: 20px !important;
  align-items: left !important;
  min-height: 100px !important;
`
const TextSmallLineClamp = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  overflow-wrap: break-word;
  width: 85px;
  -line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
`
const TextLineClamp = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  overflow-wrap: break-word;
  width: 125px;
  -line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
`

const DataWrapper = styled.div`
  padding: 0 17px;
`

export default function NewDocuments(): JSX.Element {
  const useStyles = makeStyles({
    table: {
      border: 0,
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const {
    data: documentList,
    refetch,
    isFetching: isFetchingDocument,
  } = useQuery('documents', () => getList({ page, size }))
  const documents =
    (documentList &&
      documentList.documents.length > 0 &&
      documentList.documents.map((doc, index) => {
        // Build Table Body
        return (
          <TableRow id={`documents__index-${index}`} key={doc.id}>
            <TableCell id="documents__document_code_name">
              <DataWrapper>
                <TextLineClamp>{doc.codeName}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="documents__document_name_en">
              <DataWrapper>
                <TextLineClamp>{doc.nameEn}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="documents__document_name_th">
              <DataWrapper>
                <TextLineClamp>{doc.nameTh}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="documents__version">
              <DataWrapper>
                <TextSmallLineClamp>{doc.version}</TextSmallLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="documents__document_updated_date">
              <DataWrapper>
                <TextLineClamp>
                  {formaDateStringWithPattern(doc.updatedDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
                </TextLineClamp>
              </DataWrapper>
            </TableCell>
          </TableRow>
        )
      })) ||
    []
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (documentList?.pagination) {
      setPage(documentList.pagination.page)
      setSize(documentList.pagination.size)
    }
  }, [documentList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [page, size, refetch])
  const isNoData = documents.length > 0
  const generateTableBody = () => {
    if (isNoData) {
      return <TableBody>{documents}</TableBody>
    }
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={5}>
            <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
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
        <Fragment>
          <TableContainer className={classes.table}>
            <Table id="documents_list___table">
              <DataTableHeader headers={headerText} />
              {isFetchingDocument ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                generateTableBody()
              )}
            </Table>
          </TableContainer>
          <GridSearchSection container>
            <Grid item xs={12}>
              <Paginate
                pagination={documentList?.pagination}
                page={page}
                pageSize={size}
                setPage={setPage}
                setPageSize={setSize}
                refetch={refetch}
              />
            </Grid>
          </GridSearchSection>
        </Fragment>
      </Wrapper>
    </Page>
  )
}
