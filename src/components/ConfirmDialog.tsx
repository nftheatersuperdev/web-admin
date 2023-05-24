/* eslint-disable react/no-danger */
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Button,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message?: string
  htmlContent?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export default function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
  const { open, title, message, htmlContent, confirmText, cancelText, onConfirm, onCancel } = props

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {htmlContent ? <div dangerouslySetInnerHTML={{ __html: htmlContent }} /> : message}
        </DialogContentText>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginLeft: '-8px',
            marginTop: '14px',
          }}
        >
          {' '}
          <Button onClick={onConfirm} color="primary" variant="contained" aria-label="confirm">
            {confirmText || 'Confirm'}
          </Button>
          <Button onClick={onCancel} color="primary" variant="outlined" aria-label="cancel">
            {cancelText || 'Cancel'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
