import React, { useState, useEffect, Fragment } from 'react'
import toast from 'react-hot-toast'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Paper,
  Typography,
} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Alert, { Color as AlertSeverity } from '@material-ui/lab/Alert'
import {
  AttachFileRounded as AttachmentIcon,
  CloudUpload as CloudUploadIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons'
import { validateEmail } from 'utils'
import { useAddEmailsToUserGroup } from 'services/evme'

interface UploadCSVDialogProps {
  userGroupId: string
  open: boolean
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`
const AlertSpace = styled(Alert)`
  margin-bottom: 20px;
`
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      listStyle: 'none',
      padding: theme.spacing(0.5),
      margin: 0,
    },
    input: {
      display: 'none',
    },
    inputLabel: {
      marginTop: '-10px',
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
)

export default function UploadCSVDialog({
  userGroupId,
  open,
  onClose,
}: UploadCSVDialogProps): JSX.Element {
  const { t } = useTranslation()
  const classes = useStyles()
  const addEmailsToUserGroup = useAddEmailsToUserGroup()
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [enableToUploadFile, setEnableToUploadFile] = useState<boolean>(false)
  const [selectedFile, setSelectedFile] = useState<boolean>(false)
  const [invalidEmails, setInvalidEmails] = useState<string[]>([])
  const [validEmails, setValidEmails] = useState<string[]>([])

  const handleOnClose = () => {
    onClose()
    setOpenAlert(false)
    setAlertMessage('')
    setAlertSeverity('info')
    setSelectedFile(false)
    setEnableToUploadFile(false)
    setInvalidEmails([])
    setValidEmails([])
  }
  const handleOnFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAlert(false)

    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(true)

      const file = event.target.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        const emails = String(reader.result).split('\r\n')
        const newValidEmails: string[] = []
        const newInvalidEmails: string[] = []

        emails.forEach((email) => {
          if (validateEmail(email)) {
            newValidEmails.push(email)
          } else {
            const trimmed = email.trim()
            if (trimmed) {
              newInvalidEmails.push(trimmed)
            }
          }
        })

        setOpenAlert(true)
        setValidEmails(newValidEmails)
        setInvalidEmails(newInvalidEmails)

        if (newInvalidEmails.length > 0 && newValidEmails.length > 0) {
          setAlertSeverity('warning')
          setAlertMessage(t('userGroups.dialog.csvUpload.validation.email.warning'))
        } else if (newInvalidEmails.length > 0 && newValidEmails.length === 0) {
          setAlertSeverity('error')
          setAlertMessage(t('userGroups.dialog.csvUpload.validation.email.error'))
        } else {
          setAlertSeverity('success')
          setAlertMessage(t('userGroups.dialog.csvUpload.validation.email.success'))
        }
      }

      reader.readAsText(file)
    }
  }
  const handleUploadEmails = () => {
    toast.promise(addEmailsToUserGroup.mutateAsync({ id: userGroupId, values: validEmails }), {
      loading: t('toast.loading'),
      success: () => {
        handleOnClose()
        return t('userGroups.dialog.csvUpload.success')
      },
      error: t('userGroups.dialog.csvUpload.error'),
    })
  }

  useEffect(() => {
    if (validEmails.length > 0) {
      setEnableToUploadFile(true)
    } else {
      setEnableToUploadFile(false)
    }
  }, [validEmails, invalidEmails])

  const renderAlert = openAlert ? (
    <AlertSpace severity={alertSeverity} onClose={() => setOpenAlert(false)}>
      {alertMessage}
    </AlertSpace>
  ) : (
    ''
  )

  const renderChips = (emails: string[]) => {
    return (
      <Paper component="ul" className={classes.root}>
        {emails.map((email, index) => (
          <li key={index}>
            <Chip label={email} className={classes.chip} />
          </li>
        ))}
      </Paper>
    )
  }
  const renderAccordion = (headerTitle: string, emails: string[]) => {
    return (
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{headerTitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {emails.length > 0 ? (
            renderChips(emails)
          ) : (
            <Typography variant="caption">
              {t('userGroups.dialog.csvUpload.thereAreNoEmails')}
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    )
  }
  const uploadCSVButton = (
    <Fragment>
      <input
        id="contained-button-file"
        className={classes.input}
        type="file"
        onChange={handleOnFileChange}
        accept=".csv"
      />
      <label htmlFor="contained-button-file" className={classes.inputLabel}>
        <Button
          startIcon={<AttachmentIcon />}
          variant="outlined"
          color="primary"
          component="span"
          fullWidth
        >
          {t('userGroups.dialog.csvUpload.selectFileButton')}
        </Button>
      </label>
    </Fragment>
  )
  const renderContent = !selectedFile ? (
    uploadCSVButton
  ) : (
    <Fragment>
      {renderAccordion(
        t('userGroups.dialog.csvUpload.accordion.valid', { length: validEmails.length }),
        validEmails
      )}
      {renderAccordion(
        t('userGroups.dialog.csvUpload.accordion.invalid', { length: invalidEmails.length }),
        invalidEmails
      )}
    </Fragment>
  )

  const renderSelectNewFile = selectedFile ? uploadCSVButton : ''

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title" scroll="paper">
      <DialogTitle id="form-dialog-title">{t('userGroups.dialog.csvUpload.title')}</DialogTitle>
      <DialogContent>
        {renderAlert}
        {renderContent}
      </DialogContent>
      <DialogActions>
        <ButtonSpace color="default" variant="outlined" onClick={handleOnClose}>
          {t('button.cancel')}
        </ButtonSpace>
        {renderSelectNewFile}
        <ButtonSpace
          startIcon={<CloudUploadIcon />}
          color="primary"
          variant="outlined"
          disabled={!enableToUploadFile}
          onClick={handleUploadEmails}
        >
          {t('userGroups.dialog.csvUpload.uploadButton', { length: validEmails.length })}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
