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
// import { GridTextField } from "components/Styled"
import { AccountBalance, AccountCircle as UserIcon, Forward } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { backgrounds } from 'polished'
import { getAllNetflixAccounts } from 'services/web-bff/netflix'

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
  console.log(accountId)
  const { data: allNetflixAccounts } = useQuery('all-netflix-accounts', () =>
    getAllNetflixAccounts()
  )
  console.log(allNetflixAccounts)
  const { t } = useTranslation()
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
      <TextField fullWidth select style={{ backgroundColor: 'white' }}>
        {allNetflixAccounts?.map((account) => (
          <MenuItem key={account.accountId} value={account.accountId}>
            {account.accountName}
          </MenuItem>
        ))}
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
          <Button color="primary" variant="contained" type="submit">
            {t('button.transfer')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
