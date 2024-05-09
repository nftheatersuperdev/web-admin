import { useQuery } from 'react-query'
import { useState } from 'react'
import {
  TableRow,
  TableCell,
  CircularProgress,
  Table,
  TableBody,
  TableContainer,
  Chip,
} from '@mui/material'
import { DEFAULT_DATETIME_FORMAT, formatDate } from 'utils'
import { makeStyles } from '@mui/styles'
import DataTableHeader, { TableHeaderProps } from 'components/DataTableHeader'
import PageTitle from 'components/PageTitle'
import { Page } from 'layout/LayoutRoute'
import { getAllPackage } from 'services/web-bff/packages'
import { ContentSection, DataWrapper, TextLineClamp, Wrapper } from 'components/Styled'
import DataTableBody from 'components/DataTableBody'
import EditPackageDialog from './EditPackageDialog'

export default function Package(): JSX.Element {
  const [isEditPackageDialogOpen, setIsEditPackageDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState()
  const useStyles = makeStyles({
    chipGreen: {
      backgroundColor: '#4CAF50',
      color: 'white',
      borderRadius: '64px',
    },
    chipRed: {
      backgroundColor: '#979797',
      color: 'white',
      borderRadius: '64px',
    },
  })
  const classes = useStyles()
  const headerPackageColumn: TableHeaderProps[] = [
    { text: 'ลำดับ' },
    { text: 'ชื่อแพ็คเก็ต' },
    { text: 'จำนวนวัน' },
    { text: 'ราคา' },
    { text: 'สถานะ' },
    { text: 'อัพเดตล่าสุด' },
  ]
  const {
    data: packageList,
    refetch,
    isFetching,
  } = useQuery('package-list', () => getAllPackage(), {
    cacheTime: 10 * (60 * 1000),
    staleTime: 5 * (60 * 1000),
  })
  const packages =
    packageList &&
    packageList.length > 0 &&
    packageList.map((p, index) => {
      return (
        <TableRow
          hover
          id={`package-${index}`}
          key={p.id}
          onClick={() => {
            setSelectedPackage(p)
            setIsEditPackageDialogOpen(true)
          }}
        >
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{p.module}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{p.name}</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{p.day} วัน</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{p.price} บาท</TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>
                {p.isActive ? (
                  <Chip size="small" label="กำลังใช้งานอยู่" className={classes.chipGreen} />
                ) : (
                  <Chip size="small" label="ปิดการใช้งาน" className={classes.chipRed} />
                )}
              </TextLineClamp>
            </DataWrapper>
          </TableCell>
          <TableCell>
            <DataWrapper>
              <TextLineClamp>{formatDate(p.updatedDate, DEFAULT_DATETIME_FORMAT)}</TextLineClamp>
            </DataWrapper>
          </TableCell>
        </TableRow>
      )
    })
  return (
    <Page>
      <PageTitle title="แพ็คเก็ต" />
      <Wrapper>
        <ContentSection>
          <TableContainer>
            <Table id="netflix_account_list___table">
              <DataTableHeader headers={headerPackageColumn} />
              {isFetching ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <DataTableBody data={packages} numberOfColumns={6} />
              )}
            </Table>
          </TableContainer>
        </ContentSection>
      </Wrapper>
      <EditPackageDialog
        open={isEditPackageDialogOpen}
        packageDetail={selectedPackage}
        onClose={() => {
          refetch()
          setIsEditPackageDialogOpen(false)
        }}
      />
    </Page>
  )
}
