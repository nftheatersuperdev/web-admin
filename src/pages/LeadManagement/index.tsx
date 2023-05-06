import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react'
import { useFormik } from 'formik'
import {
  Breadcrumbs,
  Typography,
  Divider,
  Card,
  Grid,
  TextField,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  FormControl,
  Select,
  Pagination,
  TableBody,
  CircularProgress,
  Autocomplete,
  InputAdornment,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import styled from 'styled-components'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formaDateStringWithPattern } from 'utils'
import config from 'config'
import { useQuery } from 'react-query'
import { Search } from '@mui/icons-material'
import PageTitleWithoutLine from 'components/PageTitleWithoutLine'
import { Page } from 'layout/LayoutRoute'
import { getLeadList } from 'services/web-bff/lead-management'
import { LeadSearchBodyProps } from 'services/web-bff/lead-management.type'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SelectOption {
  label: string
  value: string
}

const useStyles = makeStyles({
  breadcrumText: {
    color: '#000000DE',
  },
  headerTopic: {
    padding: '20px',
    paddingBottom: 0,
  },
  headerTopicText: {
    fontSize: '20px',
  },
  searchBar: {
    marginTop: '10px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'left',
    padding: '10px 20px 10px 20px',
  },
  filter: {
    height: '90px',
  },
  paddingLeft: {
    paddingLeft: '16px',
  },
  searchTextField: {
    width: '200px',
  },
  hideObject: {
    display: 'none',
  },
  textBoldBorder: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: 'bold',
  },
  width120: {
    paddingLeft: '5px',
    width: '120px',
  },
  paginationContrainer: {
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
  noResultMessage: {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    padding: '48px 0',
  },
})

const DividerCustom = styled(Divider)`
  margin: 10px 0;
`

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function LeadManagement() {
  const classes = useStyles()
  const { t } = useTranslation()
  const [filterSearchField, setFilterSearchField] = useState<LeadSearchBodyProps>()
  const [searchValue, setSearchValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(config.tableRowsDefaultPageSize)
  const [selectedSearch, setSelectedSearch] = useState<SelectOption | null>()
  // const defaultSelect = {
  //   label: t('all'),
  //   value: 'all',
  // }

  const searchOptions: SelectOption[] = [
    {
      label: t('leadManagement.searchBar.selectSearch.table.leadName'),
      value: 'leadName',
    },
  ]

  const defaultSelect = searchOptions[0]

  const formik = useFormik({
    initialValues: {
      searchInput: '',
    },
    enableReinitialize: true,
    onSubmit: (value) => {
      setPage(1)
      setFilterSearchField({
        page,
        size: pageSize,
        nameContain: value.searchInput,
      })
    },
  })

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>, value?: string) => {
    const { value: eventVal } = event.target
    const searchText = value ? value : eventVal
    setSearchValue(searchText)
    formik.setFieldValue('searchInput', searchText)
    if (searchText.length >= 2 || searchText.length < 1) {
      formik.handleSubmit()
    }
  }

  const onEnterSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && searchValue?.length >= 1) {
      formik.setFieldValue('searchInput', searchValue)
      formik.handleSubmit()
    }
  }

  const onSetSelectedSearch = (value: SelectOption | null) => {
    if (value) {
      setSelectedSearch(value)
    } else {
      setFilterSearchField({})
      setSelectedSearch(defaultSelect)
    }
    setSearchValue('')
  }

  const {
    data: leadData,
    refetch,
    isFetching,
  } = useQuery('leads', () =>
    getLeadList({
      sortBy: 'createdDate',
      sortDirection: 'DESC',
      nameContain: filterSearchField?.nameContain,
      page,
      size: pageSize,
    })
  )

  const userData =
    leadData?.data.leads && leadData?.data.leads.length > 0
      ? leadData?.data.leads.map((item) => {
          return (
            <TableRow hover key={`leadName-${item.id}`}>
              <TableCell>{item.titleTh}</TableCell>
              <TableCell>
                {formaDateStringWithPattern(item.createdDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </TableCell>
            </TableRow>
          )
        })
      : []

  const isNoData = userData.length > 0

  const generateDataToTable = () => {
    if (isNoData) {
      return <TableBody>{userData}</TableBody>
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

  useEffect(() => {
    refetch()
  }, [filterSearchField, page, pageSize, refetch])

  return (
    <Page>
      <PageTitleWithoutLine title={t('sidebar.leadManagement')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>
          <strong>{t('sidebar.leadManagement')}</strong>
        </Typography>
      </Breadcrumbs>
      <br />
      <DividerCustom />
      <br />
      <Card>
        <Grid className={classes.headerTopic}>
          <Typography className={classes.headerTopicText} variant="h6">
            {t('leadManagement.leadList.title')}
          </Typography>
        </Grid>
        <Grid className={classes.searchBar} container spacing={3}>
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} item xs={3}>
            <Autocomplete
              autoHighlight
              id="search_select_list"
              options={searchOptions}
              getOptionLabel={(option) => option.label}
              renderInput={(params) => {
                return (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    label={t('leadManagement.searchBar.selectSearch.title')}
                    variant="outlined"
                    placeholder={t('all')}
                  />
                )
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === 'all'
              }
              value={selectedSearch || defaultSelect}
              defaultValue={selectedSearch || defaultSelect}
              onChange={(_e, value) => {
                onSetSelectedSearch(value)
              }}
            />
          </Grid>
          <Grid className={[classes.filter, classes.paddingLeft].join(' ')} item xs={3}>
            <TextField
              fullWidth
              // className={selectedSearch?.value === 'leadName' ? '' : classes.hideObject}
              label={t('carAvailability.searchField.label')}
              id="lead_list_search_input"
              name="searchVal"
              onChange={onSearchChange}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onKeyDown={onEnterSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Search
                      color={
                        !selectedSearch ||
                        selectedSearch?.value === 'all' ||
                        selectedSearch?.value === ''
                          ? 'disabled'
                          : 'action'
                      }
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                    {t('leadManagement.searchBar.selectSearch.table.leadName')}
                  </div>
                </TableCell>
                <TableCell align="left">
                  <div className={[classes.textBoldBorder, classes.width120].join(' ')}>
                    {t('leadManagement.searchBar.selectSearch.table.createDate')}
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              generateDataToTable()
            )}
          </Table>
        </TableContainer>
        <Card>
          <div className={classes.paginationContrainer}>
            {t('table.rowPerPage')}:&nbsp;
            <FormControl className={classes.inlineElement}>
              <Select
                value={leadData?.data.pagination.size || pageSize}
                defaultValue={leadData?.data.pagination.size || pageSize}
                onChange={(event) => {
                  setPage(1)
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
            &nbsp;&nbsp;{leadData?.data.pagination.page || pageSize} {t('staffProfile.of')}
            &nbsp;
            {leadData?.data.pagination.totalPage}
            <Pagination
              count={leadData?.data.pagination.totalPage}
              page={leadData?.data.pagination.page || page}
              defaultPage={leadData?.data.pagination.page || page}
              variant="text"
              color="primary"
              onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                setPage(value)
              }}
            />
          </div>
        </Card>
      </Card>
    </Page>
  )
}
