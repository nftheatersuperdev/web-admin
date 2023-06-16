import { Fragment, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { CloseOutlined, Search as SearchIcon } from '@mui/icons-material'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import config from 'config'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  validateIpAddress,
} from 'utils'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import {
  CookieConsentInputRequest,
  CookieConsentLogListProps,
} from 'services/web-bff/cookie-consent-log.type'
import { getCategories, getCookieConsentLogList } from 'services/web-bff/cookie-consent-log'
import { SelectOption } from './utils'

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

const SearchButton = styled(Button)`
  font-weight: bold;
  display: inline-flexbox;
  box-shadow: none;
  padding: 14px 12px !important;
  width: 107px;
`

const DataWrapper = styled.div`
  padding: 0 17px;
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
    buttonClear: {
      cursor: 'pointer',
      padding: '4px 4px',
    },
    buttonWithoutShadow: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      width: '107px',
    },
    paddingRightBtnClear: {
      marginRight: '10px',
      cursor: 'pointer',
      padding: '4px 4px',
    },
  })
  const classes = useStyles()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [pages, setPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [cookieConsentFilter, setCookieConsentFilter] = useState<CookieConsentInputRequest>()
  const [filterSearchIpAddress, setFilterSearchIpAddress] = useState<string>('')
  const [filterSearchIpAddressError, setFilterSearchIpAddressError] = useState<string>('')
  const [filterSearchCategory, setFilterSearchCategory] = useState<string>('')
  const [filterSearchStatus, setFilterSearchStatus] = useState<string>('')
  const [isEnableFilterButton, setIsEnableFilterButton] = useState<boolean>(true)
  const { data: consentCategoryList } = useQuery('consent-category-list', () => getCategories())
  const {
    data: cookieConsentList,
    refetch,
    isFetching: isFetchingActivities,
  } = useQuery(
    'cookie-consent-list',
    () =>
      getCookieConsentLogList({
        data: cookieConsentFilter,
        page,
        size: pageSize,
      } as CookieConsentLogListProps),
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
          <TableRow id={`cookie_consent_log__index-${index}`} key={cookie.id}>
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
  const headerText: TableHeaderProps[] = [
    {
      text: t('cookieConsentLog.sessionId'),
    },
    {
      text: t('cookieConsentLog.ipAddress'),
    },
    {
      text: t('cookieConsentLog.categoryName'),
    },
    {
      text: t('cookieConsentLog.createdDate'),
    },
    {
      text: t('cookieConsentLog.status'),
    },
    {
      text: t('cookieConsentLog.version'),
    },
  ]
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
  const categoryOptions: SelectOption[] =
    consentCategoryList?.map((category) => {
      return {
        key: category.category,
        label: category.nameEn,
        value: category.category,
        isDefault: false,
      } as SelectOption
    }) || []
  const formik = useFormik({
    initialValues: {
      ipAddress: '',
      category: '',
      isAccepted: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      let updateObj: CookieConsentLogListProps = {
        ...cookieConsentFilter,
      }
      if (value.ipAddress) {
        updateObj = {
          ...updateObj,
          ipAddress: value.ipAddress,
        }
      } else {
        delete updateObj.ipAddress
      }
      if (value.category) {
        updateObj = {
          ...updateObj,
          category: value.category,
        }
      } else {
        delete updateObj.category
      }
      if (value.isAccepted !== '') {
        updateObj = {
          ...updateObj,
          isAccepted: value.isAccepted,
        }
      } else {
        delete updateObj.isAccepted
      }
      setCookieConsentFilter(updateObj)
      setPage(1)
    },
  })
  const handleOnSearchIpAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFilterSearchIpAddress(value)
    const isValidEmailSearchField = validateIpAddress(value)
    if (!isValidEmailSearchField || value.length < 2) {
      setFilterSearchIpAddressError(t('cookieConsentLog.invalidIpAddress'))
      setIsEnableFilterButton(false)
    } else {
      setFilterSearchIpAddressError('')
      formik.setFieldValue('ipAddress', value)
      setIsEnableFilterButton(true)
    }
  }
  const handleSearchIpAddressClear = () => {
    setFilterSearchIpAddress('')
    setFilterSearchIpAddressError('')
    formik.setFieldValue('ipAddress', '')
    setIsEnableFilterButton(true)
  }
  const handleOnSearchCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('category', value)
    setFilterSearchCategory(value)
    setIsEnableFilterButton(true)
  }
  const handleSearchCategoryClear = () => {
    setFilterSearchCategory('')
    formik.setFieldValue('category', '')
    setIsEnableFilterButton(true)
  }
  const handleOnSearchStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('isAccepted', value)
    setFilterSearchStatus(value)
    setIsEnableFilterButton(true)
  }
  const handleSearchStatusClear = () => {
    setFilterSearchStatus('')
    formik.setFieldValue('isAccepted', '')
    setIsEnableFilterButton(true)
  }
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
              <Grid item xs={9} sm={3}>
                <TextField
                  disabled={isFetchingActivities}
                  fullWidth
                  label={t('cookieConsentLog.searchLabel')}
                  id="cookie-consents-log__ipaddress_search_input"
                  name="searchIpAddressInput"
                  value={filterSearchIpAddress}
                  error={!!filterSearchIpAddressError}
                  helperText={filterSearchIpAddressError}
                  onChange={handleOnSearchIpAddressChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.ipAddress !== '' ? (
                          <CloseOutlined
                            className={classes.buttonClear}
                            onClick={handleSearchIpAddressClear}
                          />
                        ) : (
                          <SearchIcon />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={9} sm={3}>
                <TextField
                  fullWidth
                  select
                  value={filterSearchCategory}
                  onChange={handleOnSearchCategoryChange}
                  disabled={isFetchingActivities}
                  label={t('consentLog.documentTypeLabel')}
                  id="cookie-consents-log__category_name_select"
                  name="categoryName"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.category !== '' ? (
                          <CloseOutlined
                            className={classes.paddingRightBtnClear}
                            onClick={handleSearchCategoryClear}
                          />
                        ) : (
                          ''
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  {categoryOptions?.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={9} sm={3}>
                <TextField
                  fullWidth
                  select
                  value={filterSearchStatus}
                  onChange={handleOnSearchStatusChange}
                  disabled={isFetchingActivities}
                  label={t('cookieConsentLog.statusNameLabel')}
                  id="cookie-consents-log__status_select"
                  name="documentStatus"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.isAccepted !== '' ? (
                          <CloseOutlined
                            className={classes.paddingRightBtnClear}
                            onClick={handleSearchStatusClear}
                          />
                        ) : (
                          ''
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="true">{t('cookieConsentLog.documentStatus.accept')}</MenuItem>
                  <MenuItem value="false">{t('cookieConsentLog.documentStatus.decline')}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={9} sm={2}>
                <SearchButton
                  id="cookie-consents-log__search_btn"
                  variant="contained"
                  disabled={!isEnableFilterButton}
                  onClick={() => formik.handleSubmit()}
                >
                  {t('carAvailability.searchBtn').toUpperCase()}
                </SearchButton>
                {/* <Button
                  id="cookie-consents-log__search_btn"
                  className={classes.buttonWithoutShadow}
                  variant="contained"
                  disabled={!isEnableFilterButton}
                  onClick={() => formik.handleSubmit()}
                >
                  {t('carAvailability.searchBtn').toUpperCase()}
                </Button> */}
              </Grid>
            </GridSearchSection>
            <TableContainer className={classes.table}>
              <Table id="cookie_consent_log___table">
                <DataTableHeader headers={headerText} />
                {isFetchingActivities ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} align="center">
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
