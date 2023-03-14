import {
  Box,
  Button,
  Card,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import styled from 'styled-components'
import { useState } from 'react'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import CarDetailDialog from './CarDetailDialog'
import CarReplacementDialog from './CarReplacementDialog'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const TableWrapper = styled.div`
  margin: 10px 0;
`

export default function SubscriptionDetail(): JSX.Element {
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: 'Dashboard',
      link: '/',
    },
    {
      text: 'Subscription',
      link: '/subscription',
    },
    {
      text: 'Subscription Detail',
      link: '/subscription/5454',
    },
  ]

  const rows = [
    {
      id: '63e53ade-e844-4f27-b145-d55f74b81d7a',
      amount: 12929,
      updatedDate: '17/02/2566 00:00',
      paymentType: 'Refund',
      purpose: '3ds Charge',
      status: 'Success',
      statusMessage: 'Paid',
      a: 1,
      b: 2,
      c: 3,
    },
  ]

  const [selectedRow, setSelectedRow] = useState({})
  const [carDetailDialogOpen, setCarDetailDialogOpen] = useState<boolean>(false)
  const [carReplacementDialogOpen, setCarReplacementlogOpen] = useState<boolean>(false)

  return (
    <Page>
      <PageTitle title="Subscription Detail" breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h5" component="h2">
            Booking Details
          </Typography>

          {/* First Name and Last Name */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__firstName"
                label="First Name"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="Krissada"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__lastName"
                label="Last Name"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="Boontrigratn"
              />
            </Grid>
          </Grid>

          {/* Email and Phone number */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__email"
                label="Email"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="im@tzv.me"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__phoneNumber"
                label="Phone Number"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="+66854995454"
              />
            </Grid>
          </Grid>

          {/* Price and Duration */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__price"
                label="Price (THB)"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={Number(5400).toLocaleString()}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__duration"
                label="Duration"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="1 Week"
              />
            </Grid>
          </Grid>

          {/* Status and Subscription ID */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__status"
                label="Status"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="Accepted"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__id"
                label="Subscription ID"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="fed1f82b-52e0-4c9a-bfa4-9bc04782c220"
              />
            </Grid>
          </Grid>

          {/* Created Date and Updated Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__createdDate"
                label="Created Date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="27/07/2022 15:37"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__updatedDate"
                label="Updated Date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="27/07/2022 15:37"
              />
            </Grid>
          </Grid>

          {/* Start Date and End Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__startDate"
                label="Start Date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="27/07/2022 15:37"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__endDate"
                label="End Date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="27/07/2022 15:37"
              />
            </Grid>
          </Grid>

          {/* Voucher */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__voucher"
                label="Voucher"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value="No data"
              />
            </Grid>
          </Grid>
        </ContentSection>

        <ContentSection>
          <Typography variant="h5" component="h2">
            Payment History
          </Typography>
          <TableWrapper>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Amount (THB)</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Status Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.amount.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.updatedDate || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.paymentType || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.purpose || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.status || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.statusMessage || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableWrapper>
        </ContentSection>

        <ContentSection>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                Car Details
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCarReplacementlogOpen(true)}
                >
                  Replacement
                </Button>
              </Box>
            </Grid>
          </Grid>
          <TableWrapper>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Amount (THB)</TableCell>
                    <TableCell>Updated Date</TableCell>
                    <TableCell>Payment Type</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Status Message</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      onClick={() => {
                        setSelectedRow(row)
                        setCarDetailDialogOpen(true)
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.amount.toLocaleString() || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.updatedDate || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.paymentType || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.purpose || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.status || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.statusMessage || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableWrapper>
        </ContentSection>
      </Wrapper>

      <CarDetailDialog
        open={carDetailDialogOpen}
        car={selectedRow}
        onClose={() => {
          setSelectedRow({})
          setCarDetailDialogOpen(false)
        }}
      />
      <CarReplacementDialog
        open={carReplacementDialogOpen}
        onClose={() => setCarReplacementlogOpen(false)}
      />
    </Page>
  )
}
