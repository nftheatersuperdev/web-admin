import React from 'react'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import ChipInput from 'material-ui-chip-input'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const MarginActionButtons = styled.div`
  margin: 10px 15px;
`
const MarginAlertDialog = styled.div`
  margin: 10px 0 0 0;
`

export interface SendDataDialogProps {
  open: boolean
  onClose: () => void
  onSubmitSend: (emails: string[]) => void
}

function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

export default function SendDataDialog({
  open,
  onClose,
  onSubmitSend,
}: SendDataDialogProps): JSX.Element {
  const { t } = useTranslation()
  const [chipEmails, setChipEmails] = React.useState<string[]>([])
  const [validateEmailError, setValidateEmailError] = React.useState<boolean>(false)
  const [timeoutToHideAlert, setTimeoutToHideAlert] = React.useState<boolean>(false)

  const setAutoHideAlert = (ms = 5000) => {
    if (!timeoutToHideAlert) {
      setTimeoutToHideAlert(true)
      setTimeout(() => {
        setValidateEmailError(false)
        setTimeoutToHideAlert(false)
      }, ms)
    }
  }

  function handleClose() {
    setChipEmails([])
    onClose()
  }

  function handleDeleteEmail(email: string) {
    setChipEmails(chipEmails.filter((chipEmail) => chipEmail !== email))
  }

  function handleAddEmail(email: string) {
    if (!validateEmail(email)) {
      setValidateEmailError(true)
      setAutoHideAlert()
      return false
    }
    setValidateEmailError(false)
    setChipEmails([...chipEmails, email])
  }

  function handleOnClickSendButton() {
    onSubmitSend(chipEmails)
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true}>
      <DialogTitle id="form-dialog-title">{t('subscription.sendAllData.dialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>{t('subscription.sendAllData.dialog.description')}</p>
        </DialogContentText>
        <ChipInput
          fullWidth={true}
          variant="outlined"
          size="small"
          label={t('subscription.sendAllData.dialog.inputBox.label')}
          placeholder={t('subscription.sendAllData.dialog.inputBox.placeholder')}
          value={chipEmails}
          onAdd={handleAddEmail}
          onDelete={handleDeleteEmail}
          InputProps={{
            inputProps: { style: { minWidth: '100%' } },
          }}
        />
        {validateEmailError && (
          <MarginAlertDialog>
            <Alert severity="error" onClose={() => setValidateEmailError(false)}>
              {t('subscription.sendAllData.dialog.alertBox.errorInvalidEmail')}
            </Alert>
          </MarginAlertDialog>
        )}
      </DialogContent>
      <DialogActions>
        <MarginActionButtons>
          <Button onClick={handleClose} color="primary">
            {t('subscription.sendAllData.dialog.actionButton.cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={chipEmails.length < 1}
            onClick={handleOnClickSendButton}
          >
            {t('subscription.sendAllData.dialog.actionButton.send')}
          </Button>
        </MarginActionButtons>
      </DialogActions>
    </Dialog>
  )
}
