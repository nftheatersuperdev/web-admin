/* eslint-disable react/forbid-component-props */
import config from 'config'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { useHistory } from 'react-router-dom'
import { useState, KeyboardEvent, useEffect } from 'react'
import {
  Button,
  Box,
  Card,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TextField,
  Typography,
  Pagination,
  Select,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { ROUTE_PATHS } from 'routes'
import { formatStringForInputText } from 'utils'
import { getList } from 'services/web-bff/car'
import { Page } from 'layout/LayoutRoute'
import { CarListFilterRequest } from 'services/web-bff/car.type'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'

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
const ExportButton = styled(Button)`
  background-color: #424e63 !important;
  font-weight: bold !important;
  padding: 14px 12px !important;
  width: 110px;
`
const TableHeaderColumn = styled.div`
  border-left: 2px solid #e0e0e0;
  font-weight: bold;
  padding-left: 10px;
`
const DataWrapper = styled.div`
  padding: 0 17px;
`
const PaginationBox = styled(Box)`
  padding: 20px 0;
`
const PaginationWrapper = styled(Pagination)`
  padding: 14px 0;
`
const PageSize = styled(Box)`
  padding: 5px 0;
`

const formatDate = (date: string): string => dayjs(date).format('DD MMM YYYY')
const formatTime = (date: string): string => dayjs(date).format('HH:mm')

export default function ModelAndPricing(): JSX.Element {
  const history = useHistory()
  const { t } = useTranslation()
  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(config.tableRowsDefaultPageSize)
  const [searchField, setSearchField] = useState<string>()
  const [searchValue, setSearchValue] = useState<string>()
  const [filter, setFilter] = useState<CarListFilterRequest>({})

  const {
    data: carData,
    refetch,
    isFetching,
  } = useQuery('model-and-pricing', () => getList({ filter, page, size: pageSize }), {
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    refetch()
  }, [refetch, page, pageSize])

  const cars =
    carData?.data.cars?.map((car) => ({
      id: car?.id || '-',
      modelId: car?.carSku?.carModel?.id,
      brand: car?.carSku?.carModel?.brand?.name || '-',
      name: car?.carSku?.carModel?.name || '-',
      createdDate: car?.createdDate || '-',
      updatedDate: car?.updatedDate || '-',
    })) || []

  const handleSubmitSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event?.key.toLocaleLowerCase() === 'enter') {
      setFilter({
        [searchField as string]: searchValue,
      })
      setTimeout(() => refetch(), 250)
    }
  }

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '',
    },
    {
      text: t('sidebar.carManagement.carModelAndPricing'),
      link: ROUTE_PATHS.MODEL_AND_PRICING,
    },
  ]

  return (
    <Page>
      <PageTitle title={t('sidebar.carManagement.carModelAndPricing')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            Model & Pricing List
          </Typography>

          <GridSearchSection container spacing={1}>
            <Grid item xs={9} sm={3}>
              <TextField
                fullWidth
                select
                label="Select Search"
                id="model-and-pricing__search_field"
                name="searchField"
                value={searchField}
                variant="outlined"
                onChange={(event) => setSearchField(() => event.target.value)}
              >
                <MenuItem value="carId">ID</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={9} sm={3}>
              <TextField
                id="model-and-pricing__search_value"
                name="searchValue"
                value={searchValue}
                fullWidth
                onChange={(event) => setSearchValue(() => event.target.value)}
                onKeyPress={handleSubmitSearch}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchField && isFetching ? <CircularProgress size={20} /> : <SearchIcon />}
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter Search"
                disabled={!searchField || isFetching}
              />
            </Grid>
            <Grid item xs={9} sm={2} />
            <Grid item xs={9} sm={2} />
            <Grid item xs={9} sm={2}>
              <Box display="flex" justifyContent="flex-end">
                <ExportButton
                  id="model-and-pricing__export_button"
                  color="primary"
                  variant="contained"
                >
                  {/* <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename="EVme Admin Dashboard.csv"
                    className={classes.noUnderLine}
                  >
                    {t('button.export').toUpperCase()}
                  </CSVLink> */}
                  {t('button.export').toUpperCase()}
                </ExportButton>
              </Box>
            </Grid>
          </GridSearchSection>

          <GridSearchSection container>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <TableHeaderColumn>Car Brand</TableHeaderColumn>
                      </TableCell>
                      <TableCell align="left">
                        <TableHeaderColumn>Car Model</TableHeaderColumn>
                      </TableCell>
                      <TableCell align="left">
                        <TableHeaderColumn>Created Date</TableHeaderColumn>
                      </TableCell>
                      <TableCell align="left">
                        <TableHeaderColumn>Updated Date</TableHeaderColumn>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {isFetching ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : (
                      cars.map((car) => {
                        return (
                          <TableRow
                            hover
                            key={`car-${car.id}`}
                            onClick={() => history.push(`/model-and-pricing/${car.modelId}/edit`)}
                          >
                            <TableCell>
                              <DataWrapper>{formatStringForInputText(car.brand)}</DataWrapper>
                            </TableCell>
                            <TableCell>
                              <DataWrapper>{formatStringForInputText(car.name)}</DataWrapper>
                            </TableCell>
                            <TableCell>
                              <DataWrapper>
                                {formatDate(car.createdDate)}
                                <br />
                                {formatTime(car.createdDate)}
                              </DataWrapper>
                            </TableCell>
                            <TableCell>
                              <DataWrapper>
                                {formatDate(car.updatedDate)}
                                <br />
                                {formatTime(car.updatedDate)}
                              </DataWrapper>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </GridSearchSection>
          <PaginationBox display="flex" justifyContent="flex-end">
            <PageSize>
              {t('table.rowPerPage')}:{' '}
              <Select
                disabled={isFetching}
                value={carData?.data.pagination.size}
                defaultValue={carData?.data.pagination.size}
                onChange={(event) => {
                  setPage(0)
                  setPageSize(event.target.value as number)
                }}
              >
                {config.tableRowsPerPageOptions?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              &nbsp;&nbsp;{carData?.data.pagination?.page} {t('staffProfile.of')}
              &nbsp;
              {carData?.data.pagination?.totalPage}
            </PageSize>
            <PaginationWrapper
              disabled={isFetching}
              count={carData?.data.pagination.totalPage}
              page={carData?.data.pagination.page}
              defaultPage={carData?.data.pagination.page}
              variant="text"
              shape="circular"
              color="primary"
              onChange={(_event: React.ChangeEvent<unknown>, newPage: number) =>
                setPage(newPage - 1)
              }
            />
          </PaginationBox>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
