import { Fragment, useEffect, useState } from 'react'
import {
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import config from 'config'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { CookieConsentLogListProps } from 'services/web-bff/cookie-consent-log.type'
import { getList } from 'services/web-bff/cookie-consent-log'

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
const TableHeaderColumn = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: bold;
  padding-left: 10px;
`

export default function CookieConsentLogPage(): JSX.Element {
  const useStyles = makeStyles({
    table: {
      border: 0,
    },
    chipGreen: {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '64px',
    },
    chipLightGrey: {
      backgroundColor: '#E0E0E0',
      color: 'black',
      borderRadius: '64px',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    paginationContainer: {
      display: 'flex',
      listStyleType: 'none',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '20px',
      round: 'true',
    },
    inlineElement: {
      display: 'inline-flex',
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [cookieConsentFilter] = useState<CookieConsentLogListProps>()
  const {
    data: cookieConsentList,
    refetch,
    isFetching: isFetchingActivities,
  } = useQuery(
    'cookie-consent-list',
    () => getList({ data: cookieConsentFilter } as CookieConsentLogListProps),
    {
      cacheTime: 10 * (60 * 1000),
      staleTime: 5 * (60 * 1000),
    }
  )
  const cookieConsent =
    (cookieConsentList &&
      cookieConsentList.data?.cookieConsents.length > 0 &&
      cookieConsentList.data.cookieConsents.map((cookie, index) => {
        // Build Table Body
        return (
          <TableRow id={`cookie_consent_log__index-${index}`} key={index}>
            <TableCell id="cookie_consent_log__sessionId">
              <DataWrapper>
                <TextLineClamp>{cookie.sessionId}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="cookie_consent_log__ipAddress">
              <DataWrapper>
                <TextSmallLineClamp>{cookie.ipAddress}</TextSmallLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="cookie_consent_log__cookieCategoryName">
              <DataWrapper>
                <TextLineClamp>{cookie.cookieContent.nameEn}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="cookie_consent_log__date">
              <DataWrapper>
                <TextLineClamp>
                  {formaDateStringWithPattern(
                    cookie.createdDate,
                    DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                  )}
                </TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell id="cookie_consent_log__cookieStatus" width={50}>
              {!cookie.isAccepted ? (
                <Chip
                  size="small"
                  label={t('cookieConsentLog.documentStatus.decline')}
                  className={classes.chipLightGrey}
                />
              ) : (
                <Chip
                  size="small"
                  label={t('cookieConsentLog.documentStatus.accept')}
                  className={classes.chipGreen}
                />
              )}
            </TableCell>
            <TableCell id="cookie_consent_log__version">
              <DataWrapper>
                <TextLineClamp>{cookie.cookieContent.version}</TextLineClamp>
              </DataWrapper>
            </TableCell>
          </TableRow>
        )
      })) ||
    []
  const isNoData = cookieConsent.length > 0
  const generateDataToTable = () => {
    if (isNoData) {
      return <TableBody>{cookieConsent}</TableBody>
    }
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9}>
            <div className={classes.noResultMessage}>{t('warning.noResultList')}</div>
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }
  const generateTableHeader = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell align="left">
            <TableHeaderColumn>{t('cookieConsentLog.sessionId')}</TableHeaderColumn>
          </TableCell>
          <TableCell align="left">
            <TableHeaderColumn>{t('cookieConsentLog.ipAddress')}</TableHeaderColumn>
          </TableCell>
          <TableCell align="left">
            <TableHeaderColumn>{t('cookieConsentLog.categoryName')}</TableHeaderColumn>
          </TableCell>
          <TableCell align="left">
            <TableHeaderColumn>{t('cookieConsentLog.createdDate')}</TableHeaderColumn>
          </TableCell>
          <TableCell align="left">
            <TableHeaderColumn>{t('cookieConsentLog.status')}</TableHeaderColumn>
          </TableCell>
          <TableCell align="left">
            <TableHeaderColumn>{t('cookieConsentLog.version')}</TableHeaderColumn>
          </TableCell>
        </TableRow>
      </TableHead>
    )
  }
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.documentsManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.documentsManagement.cookieConsentLog'),
      link: '/consents-log',
    },
  ]
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (cookieConsentList?.data.pagination) {
      setPage(cookieConsentList.data.pagination.page)
      setPageSize(cookieConsentList.data.pagination.size)
      setPages(cookieConsentList.data.pagination.totalPage)
    }
  }, [cookieConsentList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [cookieConsentFilter, pages, page, pageSize, refetch])
  return (
    <Page>
      <PageTitle
        title={t('sidebar.documentsManagement.cookieConsentLog')}
        breadcrumbs={breadcrumbs}
      />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('cookieConsentLog.header')}
          </Typography>
          <Fragment>
            <GridSearchSection container spacing={1}>
              <Grid item xs={9} sm={3} />
            </GridSearchSection>
            <TableContainer className={classes.table}>
              <Table id="cookie_consent_log___table">
                {generateTableHeader()}
                {isFetchingActivities ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  generateDataToTable()
                )}
              </Table>
            </TableContainer>
            <GridSearchSection container>
              <Grid item xs={12}>
                {!isFetchingActivities ? (
                  <div className={classes.paginationContainer}>
                    {t('table.rowPerPage')}:&nbsp;
                    <FormControl className={classes.inlineElement}>
                      <Select
                        value={cookieConsentList?.data.pagination?.size || pageSize}
                        defaultValue={cookieConsentList?.data.pagination?.size || pageSize}
                        onChange={(event) => {
                          setPage(1)
                          setPages(event.target.value as number)
                          setPageSize(event.target.value as number)
                        }}
                      >
                        {config.tableRowsPerPageOptions?.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    &nbsp;&nbsp;{cookieConsentList?.data.pagination?.page || pages}{' '}
                    {t('staffProfile.of')}
                    &nbsp;
                    {cookieConsentList?.data.pagination?.totalPage || pages}
                    <Pagination
                      count={cookieConsentList?.data.pagination?.totalPage || pages}
                      page={cookieConsentList?.data.pagination?.page || page}
                      defaultPage={cookieConsentList?.data.pagination?.page || page}
                      variant="text"
                      color="primary"
                      onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                        setPage(value)
                      }}
                    />
                  </div>
                ) : (
                  ''
                )}
              </Grid>
            </GridSearchSection>
          </Fragment>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
