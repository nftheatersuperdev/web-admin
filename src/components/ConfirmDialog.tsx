/* eslint-disable react/no-danger */
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Button,
} from '@material-ui/core'

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
        <DialogActions>
          <Button onClick={onCancel} color="primary" aria-label="cancel">
            {cancelText || 'Cancel'}
          </Button>
          <Button onClick={onConfirm} color="primary" variant="contained" aria-label="confirm">
            {confirmText || 'Confirm'}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
