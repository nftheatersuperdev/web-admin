import React, { KeyboardEvent } from 'react'
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Divider,
  Chip,
  TextField,
} from '@material-ui/core'

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
  const [chipEmails, setChipEmails] = React.useState<string[]>([])

  function handleClose() {
    setChipEmails([])
    onClose()
  }

  function handleDelete(chipEmail: string) {
    setChipEmails(chipEmails.filter((email) => email !== chipEmail))
  }

  function handleEmailInput(event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { value: email } = event.target as HTMLTextAreaElement
    if (event.key === 'Enter' && !chipEmails.includes(email) && validateEmail(email)) {
      setChipEmails([...chipEmails, email])
    }
  }

  function handleOnClickSendButton() {
    onSubmitSend(chipEmails)
  }

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Send All Data via Email</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {chipEmails.length < 1
            ? 'Please enter atleast one email to get the data'
            : 'There are emails will retrieve the data'}
          {chipEmails.map((chipEmail, index) => {
            return (
              <li key={index}>
                <Chip label={chipEmail} onDelete={() => handleDelete(chipEmail)} />
              </li>
            )
          })}
        </DialogContentText>
        <Divider />
        <br />
        <TextField
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          size="small"
          required
          inputProps={{
            onKeyDown: handleEmailInput,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOnClickSendButton} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  )
}
