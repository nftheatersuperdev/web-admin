import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@material-ui/core'
import { GridColDef, GridPageChangeParams } from '@material-ui/data-grid'
import { Refresh as RefreshIcon } from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { formatDates, DEFAULT_DATE_FORMAT } from 'utils'
import styled from 'styled-components'
import config from 'config'
import { useUsers } from 'services/evme'
import { UserFilter, SortDirection, UserSortFields } from 'services/evme.types'
import { Page } from 'layout/LayoutRoute'
import DataGridLocale from 'components/DataGridLocale'
import DatePicker from 'components/DatePicker'
import PageToolbar from 'layout/PageToolbar'

const CardInputContainer = styled(Card)`
  margin-bottom: 10px;
`

interface InputFilter {
  email?: string
  phoneNumber?: string
  kycStatus: string
  submitDate?: Date | null
}

const kycStatuses = ['pending', 'verified', 'rejected']

const transformToUserFilter = (inputFilter: InputFilter): UserFilter => {
  const { email, phoneNumber, kycStatus, submitDate } = inputFilter

  const userFilter: UserFilter = {
    // filter only "user"
    role: {
      eq: 'user',
    },
  }

  if (email) {
    userFilter.email = { iLike: `%${email}%` }
  }

  if (phoneNumber) {
    userFilter.phoneNumber = { iLike: `%${phoneNumber}%` }
  }

  if (kycStatus) {
    userFilter.kycStatus = { eq: kycStatus }
  }

  if (submitDate) {
    userFilter.createdAt = {
      between: {
        upper: dayjs(submitDate).startOf('day').toDate(),
        lower: dayjs(submitDate).endOf('day').toDate(),
      },
    }
  }

  return userFilter
}

export default function User(): JSX.Element {
  const { t } = useTranslation()
  const [pageSize, setPageSize] = useState(config.tableRowsDefaultPageSize)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const [filter, setFilter] = useState<InputFilter>({
    email: '',
    phoneNumber: '',
    kycStatus: '',
    submitDate: null,
  })

  const { data, refetch, fetchNextPage, fetchPreviousPage } = useUsers(
    pageSize,
    transformToUserFilter(filter),
    [{ direction: SortDirection.Asc, field: UserSortFields.CreatedAt }]
  )

  useEffect(() => {
    refetch()
  }, [filter, refetch])

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [event.target.name]: event.target.value || '',
    }))
  }

  const handleClearSearchClick = () => {
    setFilter({
      email: '',
      phoneNumber: '',
      kycStatus: '',
      submitDate: null,
    })
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: t('user.id'), description: t('user.id'), flex: 1, hide: true },
    {
      field: 'createdAt',
      headerName: t('user.createdDate'),
      description: t('user.createdDate'),
      valueFormatter: formatDates,
      flex: 1,
    },
    { field: 'fullName', headerName: t('user.fullName'), description: t('user.fullName'), flex: 1 },
    { field: 'email', headerName: t('user.email'), description: t('user.email'), flex: 1 },
    { field: 'phoneNumber', headerName: t('user.phone'), description: t('user.phone'), flex: 1 },
    {
      field: 'kycStatus',
      headerName: t('user.kycStatus'),
      description: t('user.kycStatus'),
      flex: 1,
    },
    {
      field: 'verifyDate',
      headerName: t('user.verifyDate'),
      description: t('user.verifyDate'),
      valueFormatter: formatDates,
      flex: 1,
      hide: true,
    },
    {
      field: 'note',
      headerName: t('user.note'),
      description: t('user.note'),
      flex: 1,
      hide: true,
    },
    {
      field: 'rejectedReason',
      headerName: t('user.rejectedReason'),
      description: t('user.rejectedReason'),
      flex: 1,
      hide: true,
    },
    {
      field: 'updatedAt',
      headerName: t('user.updatedDate'),
      description: t('user.updatedDate'),
      valueFormatter: formatDates,
      flex: 1,
    },
  ]

  const rows =
    data?.pages[currentPageIndex]?.edges?.map(({ node }) => {
      return {
        id: node?.id,
        fullName: `${node?.firstName || ''} ${node?.lastName || ''}`,
        email: node?.email,
        phoneNumber: node?.phoneNumber,
        kycStatus: node?.kycStatus,
        // verify date not support from backend
        verifyDate: null,
        note: '',
        rejectedReason: '',
        createdAt: node?.createdAt,
        updatedAt: node?.updatedAt,
      }
    }) || []

  return (
    <Page>
      <PageToolbar>
        <a href="https://api.sumsub.com/" target="_blank" rel="noreferrer">
          <Button color="primary" variant="contained">
            SumSub
          </Button>
        </a>
      </PageToolbar>

      <CardInputContainer>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={2}>
              <TextField
                fullWidth
                label={t('user.email')}
                id="email"
                name="email"
                value={filter.email}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label={t('user.phone')}
                id="phoneNumber"
                name="phoneNumber"
                value={filter.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={2}>
              <DatePicker
                label={t('user.createdDate')}
                id="submitDate"
                name="submitDate"
                format={DEFAULT_DATE_FORMAT}
                defaultValue={undefined}
                value={filter.submitDate}
                onChange={(date) => {
                  if (date) {
                    setFilter((prevFilter) => ({
                      ...prevFilter,
                      submitDate: date.toDate(),
                    }))
                  }
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <FormControl fullWidth>
                <InputLabel id="kycStatus">{t('user.kycStatus')}</InputLabel>
                <Select
                  labelId="kycStatus"
                  id="kycStatus"
                  name="kycStatus"
                  displayEmpty
                  value={filter.kycStatus}
                  onChange={(
                    event: React.ChangeEvent<{ name?: string; value: unknown }>,
                    _child: React.ReactNode
                  ) => {
                    setFilter((prevFilter) => ({
                      ...prevFilter,
                      kycStatus: event.target.value ? (event.target.value as string) : '',
                    }))
                  }}
                >
                  <MenuItem value="">&nbsp;</MenuItem>
                  {kycStatuses.map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={3}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearSearchClick}
                startIcon={<RefreshIcon />}
              >
                {t('button.clear')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </CardInputContainer>

      <Card>
        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={data?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onFetchNextPage={fetchNextPage}
          onFetchPreviousPage={fetchPreviousPage}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableSelectionOnClick
        />
      </Card>
    </Page>
  )
}
