/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/forbid-component-props */
import styled from 'styled-components'
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AppBar, Box, Breadcrumbs, Card, Grid, Tab, Tabs, Typography } from '@material-ui/core'
import { Page } from 'layout/LayoutRoute'
import { VoucherCreateEditParams } from 'pages/VoucherCreateEdit/types'
import { useVoucherById } from 'services/evme'
import GeneralInformation from 'pages/VoucherCreateEdit/GeneralInformation'

const CardSpacing = styled(Card)`
  margin: 20px 0;
`

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`voucher-create-edit-tab-${index}`}
      aria-labelledby={`voucher-create-edit-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `voucher-create-edit-tab-${index}`,
    'aria-controls': `voucher-create-edit-tab-${index}`,
  }
}

export default function VoucherCreateEdit(): JSX.Element {
  const { voucherId } = useParams<VoucherCreateEditParams>()
  const isEdit = !!voucherId
  const [tabIndex, setTabIndex] = useState<number>(0)

  const { data: voucher, refetch } = useVoucherById(voucherId)

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue)
  }

  return (
    <Page>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <Link color="textPrimary" to="/vouchers">
              Vouchers
            </Link>
            <Typography>{isEdit ? `Edit ${voucher?.code}` : 'Create'}</Typography>
          </Breadcrumbs>
        </Grid>
        {/* <Grid item xs={12} sm={6} style={{ textAlign: 'right' }}>
          Right
        </Grid> */}
      </Grid>
      <CardSpacing>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIndex}
            onChange={handleChange}
            aria-label="voucher-create-edit-tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="General Information" {...a11yProps(0)} />
            <Tab label="Package Prices" {...a11yProps(1)} disabled={!isEdit} />
          </Tabs>
        </AppBar>
        <TabPanel value={tabIndex} index={0}>
          <GeneralInformation voucher={voucher} isEdit={isEdit} refetch={refetch} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          Item Two
        </TabPanel>
      </CardSpacing>
    </Page>
  )
}
