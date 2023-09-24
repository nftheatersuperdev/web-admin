import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Chip,
  Grid,
  Button,
} from '@mui/material'
import styled from 'styled-components'
import PageTitle from 'components/PageTitle'
import { ContentSection, DataWrapper, TextLineClamp, Wrapper } from 'components/Styled'
import { Page } from 'layout/LayoutRoute'
import { getRewardList } from 'services/web-bff/reward'
import DataTableBody from 'components/DataTableBody'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import AddNewRewardDialog from './AddNewRewardDialog'

const AlignRight = styled.div`
  text-align: right;
`

export default function Reward(): JSX.Element {
  const [t] = useTranslation()
  const [openAddRewardDialog, setOpenAddRewardDialog] = useState(false)
  const headerRewardColumn: TableHeaderProps[] = [
    { text: 'ลำดับ' },
    { text: 'ชื่อรางวัล' },
    { text: 'คะแนน' },
    { text: 'สถานะ' },
    { text: 'ค่า' },
  ]
  const {
    data: rewardList,
    refetch,
    isFetching,
  } = useQuery('reward-list', () => getRewardList(), {
    cacheTime: 10 * (60 * 1000),
    staleTime: 5 * (60 * 1000),
  })
  const rewards =
    rewardList &&
    rewardList.length > 0 &&
    rewardList.map((r, index) => {
      return (
        <TableRow id={`config-${index}`} key={r.id}>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{index + 1}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{r.rewardName}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{r.redeemPoint} คะแนน</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              {r.isActive ? (
                <Chip label="สามารถแลกได้" color="success" />
              ) : (
                <Chip label="ไม่สามาถแลกได้" color="error" />
              )}
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{r.rewardValue}</TextLineClamp>
            </DataWrapper>
          </TableCell>
        </TableRow>
      )
    })
  /**
   * Managing the pagination variables that will send to the API.
   */
  useEffect(() => {
    refetch()
  }, [refetch])
  return (
    <Page>
      <PageTitle title={t('sidebar.reward')} />
      <Wrapper>
        <ContentSection>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={9} />
            <Grid item xs={12} sm={3}>
              <AlignRight>
                <Button
                  id="reward__add_btn"
                  variant="contained"
                  onClick={() => setOpenAddRewardDialog(true)}
                >
                  สร้างรายการรางวัลใหม่
                </Button>
              </AlignRight>
            </Grid>
          </Grid>
          <TableContainer>
            <Table id="netflix_account_list___table">
              <DataTableHeader headers={headerRewardColumn} />
              {isFetching ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <DataTableBody data={rewards} numberOfColumns={5} />
              )}
            </Table>
          </TableContainer>
        </ContentSection>
      </Wrapper>
      <AddNewRewardDialog
        open={openAddRewardDialog}
        onClose={() => {
          refetch()
          setOpenAddRewardDialog(false)
        }}
      />
    </Page>
  )
}
