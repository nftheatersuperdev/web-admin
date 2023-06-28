import { Fragment, useEffect, useState } from 'react'
import {
  Chip,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useHistory, useParams } from 'react-router'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { getVersionList } from 'services/web-bff/document'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { Page } from 'layout/LayoutRoute'
import Paginate from 'components/Paginate'
import {
  ContentSection,
  DataWrapper,
  DisabledField,
  GridSearchSection,
  GridTextField,
  TextLineClamp,
  TextSmallLineClamp,
  Wrapper,
} from 'components/Styled'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import { DocumentVersionsParams, defaultDocumentOverview } from './utils'

export default function NewDocumentVersions(): JSX.Element {
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
    chipGreen: {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '64px',
    },
    chipRed: {
      backgroundColor: '#F44336',
      color: 'white',
      borderRadius: '64px',
    },
    chipGrey: {
      backgroundColor: '#424E63',
      color: 'white',
      borderRadius: '64px',
    },
    chipLightGrey: {
      backgroundColor: '#E0E0E0',
      color: 'black',
      borderRadius: '64px',
    },
  })
  const classes = useStyles()
  const history = useHistory()
  const { documentCode } = useParams<DocumentVersionsParams>()
  const { t, i18n } = useTranslation()
  const [page, setPage] = useState<number>(0)
  const [size, setSize] = useState<number>(10)
  const {
    data: documents,
    isFetching: isFetchingDocumentVersion,
    refetch,
  } = useQuery(
    'document-version',
    () => getVersionList({ code: documentCode, page: page + 1, size }),
    {
      cacheTime: 10 * (60 * 1000),
      staleTime: 5 * (60 * 1000),
    }
  )
  const headerColumn: TableHeaderProps[] = [
    {
      text: t('newDocuments.versions.no'),
    },
    {
      text: t('newDocuments.versions.version'),
    },
    {
      text: t('newDocuments.versions.status'),
    },
    {
      text: t('newDocuments.versions.effectiveDate'),
    },
    {
      text: t('newDocuments.versions.revisionSummary'),
    },
    {
      text: t('newDocuments.versions.createdDate'),
    },
    {
      text: t('newDocuments.versions.createdBy'),
    },
  ]
  const showChipStatus = (status: string) => {
    if (status.toLowerCase() === 'active') {
      return (
        <Chip
          size="small"
          label={t('newDocuments.statuses.active')}
          className={classes.chipGreen}
        />
      )
    }
    return status.toLowerCase() === 'inactive' ? (
      <Chip size="small" label={t('newDocuments.statuses.inactive')} className={classes.chipGrey} />
    ) : (
      <Chip size="small" label={t('newDocuments.statuses.schedule')} className={classes.chipRed} />
    )
  }
  let docOverview = defaultDocumentOverview
  const docVer =
    documents?.versions.map((ver, index) => {
      docOverview = {
        id: ver.id,
        codeName: ver.codeName,
        nameEn: ver.nameEn,
        nameTh: ver.nameTh,
        contentEn: ver.contentEn,
        contentTh: ver.contentTh,
        version: ver.version.toString(),
      }
      // Build Table Body
      return (
        <TableRow
          hover
          onClick={() => history.push(`/new-documents/${ver.codeName}/versions`)}
          id={`documents__index-${index}`}
          key={ver.id}
        >
          <TableCell id="documents_version__no">
            <DataWrapper>
              <TextSmallLineClamp>{index + 1}</TextSmallLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="documents_version__version">
            <DataWrapper>
              <TextSmallLineClamp>{ver.version}</TextSmallLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="documents_version__status">
            <DataWrapper>
              <TextLineClamp>
                {ver.status === null ? ver.status : showChipStatus(ver.status)}
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="documents_version__effectiveDate">
            <DataWrapper>
              <TextLineClamp>
                {formaDateStringWithPattern(ver.effectiveDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="documents_version__revisionSummary">
            <DataWrapper>
              <TextLineClamp>{ver.remark}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="documents_version__createdDate">
            <DataWrapper>
              <TextLineClamp>
                {formaDateStringWithPattern(ver.createdDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell id="documents_version__createdBy">
            <DataWrapper>
              <TextLineClamp>{ver.createdBy}</TextLineClamp>
            </DataWrapper>
          </TableCell>
        </TableRow>
      )
    }) || []

  const breadcrumbName = () => {
    if (isFetchingDocumentVersion) {
      return documentCode
    }
    return i18n.language === 'th' ? docOverview.nameTh : docOverview.nameEn
  }
  const documentOverview = isFetchingDocumentVersion ? defaultDocumentOverview : docOverview
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
      text: breadcrumbName(),
      link: '',
    },
  ]
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (documents?.pagination) {
      setPage(documents.pagination.page)
      setSize(documents.pagination.size)
    }
  }, [documents, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [refetch, page, size])
  const isNoData = docVer.length > 0
  const generateTableBody = () => {
    if (isNoData) {
      return <TableBody>{docVer}</TableBody>
    }
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7}>
            <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.documentsManagement.newDocument')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('newDocuments.overview.title')}
          </Typography>
          <GridSearchSection container spacing={1}>
            <GridTextField item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="document_version__documentId"
                label={t('newDocuments.overview.id')}
                fullWidth
                disabled
                variant="outlined"
                value={documentOverview.id}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="document_version__documentCodeName"
                label={t('newDocuments.overview.codeName')}
                fullWidth
                disabled
                variant="outlined"
                value={documentOverview.codeName}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="document_version__documentNameEn"
                label={t('newDocuments.overview.nameEN')}
                fullWidth
                disabled
                variant="outlined"
                value={documentOverview.nameEn}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="document_version__documentNameTh"
                label={t('newDocuments.overview.nameTH')}
                fullWidth
                disabled
                variant="outlined"
                value={documentOverview.nameTh}
              />
            </GridTextField>
            <GridTextField item xs={12} sm={6}>
              <DisabledField
                type="text"
                id="document_version__activeVersion"
                label={t('newDocuments.overview.activeVersion')}
                fullWidth
                disabled
                variant="outlined"
                value={documentOverview.version}
              />
            </GridTextField>
          </GridSearchSection>
        </ContentSection>
      </Wrapper>
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('newDocuments.versions.title')}
          </Typography>
        </ContentSection>
        <Fragment>
          <TableContainer className={classes.table}>
            <Table id="document_version___table">
              <DataTableHeader headers={headerColumn} />
              {isFetchingDocumentVersion ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={7} align="center">
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
                pagination={documents?.pagination}
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
