/* eslint-disable array-callback-return */
/* eslint-disable react/forbid-component-props */
import {
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material'
import { AccountBalance, AccountCircle as UserIcon, Forward } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { getAllYoutubeAccounts, transferUsers } from 'services/web-bff/youtube'
import ConfirmDialog from 'components/ConfirmDialog'
import { TransferUsersRequest } from 'services/web-bff/youtube.type'

interface TransferUserProps {
  open: boolean
  userIds: string[]
  accountId: string
  accountName: string
  onClose: () => void
}

export default function TransferUserDialog(props: TransferUserProps): JSX.Element {
  const useStyles = makeStyles({
    fromAccountCard: {
      backgroundColor: '#fefde0',
      padding: '10px 10px 0px 10px',
      height: '270px',
      width: '200px',
    },
    toAccountCard: {
      backgroundColor: '#fefde0',
      padding: '10px 10px 0px 10px',
      height: '270px',
      width: '200px',
    },
  })
  const classes = useStyles()
  const { open, userIds, accountId, accountName, onClose } = props
  const { data: allNetflixAccounts } = useQuery(
    'all-youtube-accounts',
    () => getAllYoutubeAccounts(),
    {
      refetchOnWindowFocus: false,
    }
  )
  const { t } = useTranslation()
  const [confirmMessage, setConfirmMessage] = useState<string>()
  const [isUpdate, setIsUpdate] = useState<boolean>(false)
  const [visibleUpdateConfirmationDialog, setVisibleUpdateConfirmationDialog] =
    useState<boolean>(false)
  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const toAccountName = allNetflixAccounts?.filter((account) => account.accountId === value)[0]
      .accountName
    formikTransfer.setFieldValue('toAccountId', value)
    setIsUpdate(true)
    setConfirmMessage(
      `คุณแน่ใจหรือว่าต้องการย้ายข้อมูลลูกค้าจากบัญชี ` +
        accountName +
        ` ไปยังบัญชี ` +
        toAccountName
    )
  }
  const formikTransfer = useFormik({
    initialValues: {
      fromAccountId: accountId,
      userIds,
      toAccountId: '',
    },
    validationSchema: Yup.object().shape({
      fromAccountId: Yup.string().max(255).required('กรุณาเลือกบัญชีที่ต้องการย้าย'),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      toast.promise(
        transferUsers(
          {
            fromAccountId: values.fromAccountId,
            userIds: values.userIds,
          } as TransferUsersRequest,
          values.toAccountId
        ),
        {
          loading: t('toast.loading'),
          success: () => {
            onClose()
            return 'ย้ายลูกค้าสำเร็จ'
          },
          error: (err) => {
            onClose()
            return 'ย้ายลูกค้าไม่สำเร็จ เนื่องจาก ' + err.data.message
          },
        }
      )
    },
  })
  const fromAccount = (
    <Card className={classes.fromAccountCard}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        title={t('netflix.fromAccount') + ' ' + accountName}
        avatar={<AccountBalance />}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {userIds.map((userId: string) => {
          return (
            <ListItem key={userId} role="listitem">
              <ListItemIcon>
                <UserIcon />
              </ListItemIcon>
              <ListItemText id={userId} primary={`${userId}`} />
            </ListItem>
          )
        })}
      </List>
    </Card>
  )
  const toAccount = (
    <Card className={classes.toAccountCard}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        title={t('netflix.toAccount')}
        avatar={<AccountBalance />}
      />
      <Divider />
      <br />
      <TextField
        fullWidth
        select
        style={{ backgroundColor: 'white' }}
        value={formikTransfer.values.toAccountId}
        error={Boolean(formikTransfer.touched.toAccountId && formikTransfer.errors.toAccountId)}
        helperText={formikTransfer.touched.toAccountId && formikTransfer.errors.toAccountId}
        onChange={handleAccountChange}
      >
        {allNetflixAccounts?.map((account) => {
          if (account.accountId !== accountId) {
            return (
              <MenuItem key={account.accountId} value={account.accountId}>
                {account.accountName}
              </MenuItem>
            )
          }
        })}
      </TextField>
    </Card>
  )
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Grid container spacing={1}>
          <Grid item xs={6} sm={6}>
            {t('netflix.transferUser')}
          </Grid>
        </Grid>
      </DialogTitle>
      <form>
        <DialogContent>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{fromAccount}</Grid>
            <Grid item>
              <Grid container direction="column" alignItems="center">
                <IconButton disabled>
                  <Forward />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item>{toAccount}</Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onClose()
            }}
            color="primary"
          >
            {t('button.cancel')}
          </Button>
          <Button
            color="primary"
            disabled={!isUpdate}
            variant="contained"
            onClick={() => setVisibleUpdateConfirmationDialog(true)}
          >
            {t('button.transfer')}
          </Button>
        </DialogActions>
      </form>
      <ConfirmDialog
        open={visibleUpdateConfirmationDialog}
        title="ย้ายลูกค้า Netflix"
        message={confirmMessage}
        confirmText={t('button.confirm')}
        cancelText={t('button.cancel')}
        onConfirm={() => formikTransfer.handleSubmit()}
        onCancel={() => setVisibleUpdateConfirmationDialog(false)}
      />
    </Dialog>
  )
}
