import config from 'config'
import styled from 'styled-components'
import { FormControl, Select, MenuItem, Pagination } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Pagination as IPagination } from 'services/web-bff/response.type'

const PaginateContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-ttems: center;
  justify-content: flex-end;
  padding: 20px;
`
const FormControlInline = styled(FormControl)`
  display: inline-flex !important;
`

interface PaginateProps {
  pagination: IPagination
  page: number
  pageSize: number
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  refetch: () => void
}

export default function Paginate({
  pagination,
  page,
  pageSize,
  setPage,
  setPageSize,
  refetch,
}: PaginateProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <PaginateContainer>
      {t('pagination.rowsPerPage')}:{' '}
      <FormControlInline variant="standard">
        <Select
          value={pagination.size || pageSize}
          defaultValue={pagination.size || pageSize}
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
      </FormControlInline>{' '}
      {pagination.page} {t('booking.of')} {pagination.totalPage}
      <Pagination
        count={pagination.totalPage}
        page={pagination.page || page}
        defaultPage={pagination.page || page}
        variant="text"
        color="primary"
        onChange={(_event: React.ChangeEvent<unknown>, selectedPage: number) => {
          if (page !== selectedPage) {
            setPage(selectedPage)
          } else {
            refetch()
          }
        }}
      />
    </PaginateContainer>
  )
}
