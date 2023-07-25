import { useTranslation } from 'react-i18next'
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import { useQuery } from 'react-query'
import { useEffect, useState } from 'react'
import { DEFAULT_DATETIME_FORMAT, formatDate } from 'utils'
import PageTitle from 'components/PageTitle'
import { ContentSection, DataWrapper, TextLineClamp, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import { getSystemConfigList } from 'services/web-bff/setting-config'
import {
  SystemConfigInputRequest,
  SystemConfigListProps,
} from 'services/web-bff/setting-config.type'
import DataTableBody from 'components/DataTableBody'

export default function SettingConfig(): JSX.Element {
  const [t] = useTranslation()
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [configFilter] = useState<SystemConfigInputRequest>()
  const headerSettingColumn: TableHeaderProps[] = [
    { text: 'ลำดับ' },
    { text: 'ชื่อ Config' },
    { text: 'ค่า' },
    { text: 'ปรับปรุงล่าสุด' },
    { text: 'ปรับปรุงโดย' },
  ]
  const {
    data: configList,
    refetch,
    isFetching: isFetchingConfig,
  } = useQuery(
    'setting-config',
    () =>
      getSystemConfigList({
        data: configFilter,
        page,
        size: pageSize,
      } as SystemConfigListProps),
    {
      cacheTime: 10 * (60 * 1000),
      staleTime: 5 * (60 * 1000),
    }
  )
  const configs =
    (configList &&
      configList.data?.config.length > 0 &&
      configList.data.config.map((config, index) => {
        // Build Table Body
        return (
          <TableRow id={`config-${index}`} key={config.configId}>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{index}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{config.configName}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{config.configValue}</TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>
                  {formatDate(config.updatedDate, DEFAULT_DATETIME_FORMAT)}
                </TextLineClamp>
              </DataWrapper>
            </TableCell>
            <TableCell>
              <DataWrapper>
                <TextLineClamp>{config.updatedBy}</TextLineClamp>
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
    if (configList?.data.pagination) {
      setPage(configList.data.pagination.page)
      setPageSize(configList.data.pagination.size)
      setTotalPages(configList.data.pagination.totalPage)
    }
  }, [configList, refetch])
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [configFilter, totalPages, page, pageSize, refetch])
  return (
    <Page>
      <PageTitle title={t('sidebar.settingConfig')} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('settingConfig.searchPanel')}
          </Typography>
        </ContentSection>
        <TableContainer>
          <Table id="netflix_account_list___table">
            <DataTableHeader headers={headerSettingColumn} />
            {isFetchingConfig ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <DataTableBody data={configs} numberOfColumns={5} />
            )}
          </Table>
        </TableContainer>
      </Wrapper>
    </Page>
  )
}
