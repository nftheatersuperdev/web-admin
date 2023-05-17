import { Fragment, useEffect, useState } from 'react'
import {
  Button,
  Card,
  Grid,
  InputAdornment,
  MenuItem,
  TableBody,
  TableCell,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  Select,
  Pagination,
  Chip,
} from '@mui/material'
import { CloseOutlined, Search as SearchIcon } from '@mui/icons-material'
import styled from 'styled-components'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import config from 'config'
import {
  convertPhoneNumber,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  formaDateStringWithPattern,
  validateKeywordTextWithSpecialChar,
} from 'utils'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { ConsentInputRequest, ConsentLogListProps } from 'services/web-bff/consent-log.type'
import { getConsentLogList } from 'services/web-bff/consent-log'
import { getTypeList } from 'services/web-bff/document'
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
export default function ConsentsLog(): JSX.Element {
  const useStyles = makeStyles({
    table: {
      border: 0,
    },
    hideObject: {
      display: 'none',
    },
    buttonWithoutShadow: {
      fontWeight: 'bold',
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '14px 12px',
      width: '107px',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    columnHeader: {
      borderLeft: '2px solid #E0E0E0',
      fontWeight: '500',
      paddingLeft: '16px',
    },
    w120: {
      width: '120px',
    },
    w160: {
      width: '160px',
    },
    rowOverflowSmall: {
      paddingLeft: '20px',
      width: '80px',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      'line-clamp': 2,
      '-webkit-box-orient': 'vertical',
    },
    rowOverflow: {
      paddingLeft: '20px',
      width: '115px',
      overflowWrap: 'break-word',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      'line-clamp': 2,
      '-webkit-box-orient': 'vertical',
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
    buttonClear: {
      cursor: 'pointer',
      padding: '4px 4px',
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
  const [consentFilter, setConsentFilter] = useState<ConsentInputRequest>()
  const [filterSearchEmail, setFilterSearchEmail] = useState<string>('')
  const [filterSearchDocumentType, setFilterSearchDocumentType] = useState<string>('')
  const [filterSearchStatus, setFilterSearchStatus] = useState<string>('')
  const [filterSearchEmailError, setFilterSearchEmailError] = useState<string>('')
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [isEnableFilterButton, setIsEnableFilterButton] = useState<boolean>(false)
  const { data: documentTypeList } = useQuery('document-type-list', () => getTypeList())
  const {
    data: consentList,
    refetch,
    isFetching: isFetchingActivities,
  } = useQuery(
    'consent-list',
    () => getConsentLogList({ data: consentFilter, page, size: pageSize } as ConsentLogListProps),
    {
      cacheTime: 10 * (60 * 1000),
      staleTime: 5 * (60 * 1000),
    }
  )
  const consent =
    (consentList &&
      consentList.data?.agreements.length > 0 &&
      consentList.data.agreements.map((agreement) => {
        // Build Table Body
        return (
          <TableRow key={agreement.id}>
            <TableCell>
              <div className={classes.rowOverflowSmall}>{agreement.customer.firstName}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflowSmall}>{agreement.customer.lastName}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflowSmall}>{agreement.customer.email}</div>
            </TableCell>
            <TableCell>
              <div>{convertPhoneNumber(agreement.customer.phoneNumber)}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflow}>{agreement.documentContent.nameEn}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflow}>{agreement.documentContent.version}</div>
            </TableCell>
            <TableCell>
              <div className={classes.rowOverflow}>
                {!agreement.isAccepted ? (
                  <Chip
                    size="small"
                    label={t('consentLog.documentStatus.decline')}
                    className={classes.chipLightGrey}
                  />
                ) : (
                  <Chip
                    size="small"
                    label={t('consentLog.documentStatus.accept')}
                    className={classes.chipGreen}
                  />
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                {formaDateStringWithPattern(
                  agreement.documentContent.updatedDate,
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              </div>
            </TableCell>
          </TableRow>
        )
      })) ||
    []
  const isNoData = consent.length > 0
  const generateDataToTable = () => {
    if (isNoData) {
      return <TableBody>{consent}</TableBody>
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
  const formik = useFormik({
    initialValues: {
      email: '',
      codeName: '',
      isAccepted: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      console.log('Value : ' + JSON.stringify(value.isAccepted))
      let updateObj: ConsentInputRequest = {
        ...consentFilter,
      }
      if (value.email) {
        updateObj = {
          ...updateObj,
          email: value.email,
        }
      } else {
        delete updateObj.email
      }
      if (value.codeName) {
        updateObj = {
          ...updateObj,
          codeName: value.codeName,
        }
      } else {
        delete updateObj.codeName
      }
      if (value.isAccepted !== '') {
        updateObj = {
          ...updateObj,
          isAccepted: value.isAccepted,
        }
      } else {
        delete updateObj.isAccepted
      }
      console.log('Request : ' + JSON.stringify(updateObj))
      setConsentFilter(updateObj)
      setPage(1)
    },
  })
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.documentsManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.documentsManagement.consentLog'),
      link: '/consents-log',
    },
  ]
  const documents: SelectOption[] =
    documentTypeList?.documents.map((doc) => {
      return {
        key: doc.codeName,
        label: doc.nameEn,
        value: doc.codeName,
        isDefault: false,
      } as SelectOption
    }) || []
  /**
   * Init pagination depends on data from the API.
   */
  useEffect(() => {
    if (consentList?.data.pagination) {
      setPage(consentList.data.pagination.page)
      setPageSize(consentList.data.pagination.size)
      setPages(consentList.data.pagination.totalPage)
    }
  }, [consentList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [consentFilter, pages, page, pageSize, refetch])
  const handleOnSearchEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFilterSearchEmail(value)
    const isValidEmailSearchField = validateKeywordTextWithSpecialChar(value)
    if (!isValidEmailSearchField || value.length < 2) {
      setFilterSearchEmailError(t('user.searchField.invalidSearchEmailFormat'))
      setIsEnableFilterButton(false)
    } else {
      setFilterSearchEmailError('')
      formik.setFieldValue('email', value)
      setIsEnableFilterButton(true)
    }
  }
  const handleClear = () => {
    setFilterSearchEmail('')
    setFilterSearchEmailError('')
    setFilterSearchDocumentType('')
    setFilterSearchStatus('')
    setIsEnableFilterButton(false)
    formik.setFieldValue('email', '')
    formik.setFieldValue('codeName', '')
    formik.setFieldValue('isAccepted', '')
    formik.handleSubmit()
  }
  const handleOnSearchDocumentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('codeName', value)
    setFilterSearchDocumentType(value)
    setIsEnableFilterButton(true)
  }
  const handleOnSearchStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('isAccepted', value)
    setFilterSearchStatus(value)
    setIsEnableFilterButton(true)
  }

  return (
    <Page>
      <PageTitle title={t('sidebar.documentsManagement.consentLog')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('consentLog.header')}
          </Typography>
          <Fragment>
            <GridSearchSection container spacing={1}>
              <Grid item xs={9} sm={3}>
                <TextField
                  disabled={isFetchingActivities}
                  fullWidth
                  label={t('consentLog.searchLabel')}
                  id="consents-log__email_search_input"
                  name="searchEmailInput"
                  value={filterSearchEmail}
                  error={!!filterSearchEmailError}
                  helperText={filterSearchEmailError}
                  onChange={handleOnSearchEmailChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.email !== '' ? (
                          <CloseOutlined className={classes.buttonClear} onClick={handleClear} />
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
                  disabled={isFetchingActivities}
                  fullWidth
                  select
                  value={filterSearchDocumentType}
                  onChange={handleOnSearchDocumentTypeChange}
                  label={t('consentLog.documentTypeLabel')}
                  id="consents-log__category_name_select"
                  name="codeName"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.codeName !== '' ? (
                          <CloseOutlined
                            className={classes.paddingRightBtnClear}
                            onClick={handleClear}
                          />
                        ) : (
                          ''
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  {documents?.map((option) => (
                    <MenuItem key={option.key} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={9} sm={3}>
                <TextField
                  disabled={isFetchingActivities}
                  fullWidth
                  select
                  value={filterSearchStatus}
                  onChange={handleOnSearchStatusChange}
                  label={t('consentLog.statusNameLabel')}
                  id="consents-log__status_select"
                  name="status"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {formik.values.isAccepted !== '' ? (
                          <CloseOutlined
                            className={classes.paddingRightBtnClear}
                            onClick={handleClear}
                          />
                        ) : (
                          ''
                        )}
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="true">{t('consentLog.documentStatus.accept')}</MenuItem>
                  <MenuItem value="false">{t('consentLog.documentStatus.decline')}</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={9} sm={2}>
                <Button
                  id="staff_profile__search_btn"
                  className={classes.buttonWithoutShadow}
                  variant="contained"
                  disabled={!isEnableFilterButton}
                  onClick={() => formik.handleSubmit()}
                >
                  {t('carAvailability.searchBtn').toUpperCase()}
                </Button>
              </Grid>
            </GridSearchSection>
            <TableContainer className={classes.table}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.firstName')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.lastName')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.email')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.phoneNumber')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.documentNameEn')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.documentVersion')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.status')}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={[classes.columnHeader].join(' ')}>
                        {t('consentLog.updatedDate')}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
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
                        value={consentList?.data.pagination?.size || pageSize}
                        defaultValue={consentList?.data.pagination?.size || pageSize}
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
                    &nbsp;&nbsp;{consentList?.data.pagination?.page || pages} {t('staffProfile.of')}
                    &nbsp;
                    {consentList?.data.pagination?.totalPage || pages}
                    <Pagination
                      count={consentList?.data.pagination?.totalPage || pages}
                      page={consentList?.data.pagination?.page || page}
                      defaultPage={consentList?.data.pagination?.page || page}
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
