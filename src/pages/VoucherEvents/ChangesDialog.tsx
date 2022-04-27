/* eslint-disable react/no-danger */
import * as Diff from 'diff'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import { VoucherEvents as VoucherEventsType } from 'services/evme.types'

interface ChangesDialogProps {
  open: boolean
  onClose: () => void
  firstCompareObject: VoucherEventsType
  secondCompareObject: VoucherEventsType
}

const style = {
  added: 'background-color: #cce7cc; color: #003700; padding: 10px; border-radius: 0 0 4px 4px;',
  removed:
    'background-color: #feb3b3; color: #370000; padding: 10px; text-decoration: line-through; border-radius: 4px 4px 0 0',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
    },
    htmlSpace: {
      margin: '10px 0',
    },
  })
)

export default function ChangesDialog({
  open,
  onClose,
  firstCompareObject,
  secondCompareObject,
}: ChangesDialogProps): JSX.Element {
  const { t } = useTranslation()
  const classes = useStyles()
  const handleOnClose = () => onClose()
  const renderHtml = (title: string, diffChange: Diff.Change[]) => {
    const html = []
    for (const sentence of diffChange) {
      if (sentence.added) {
        html.push(`<div style='${style.added}'>${sentence.value}</div>`)
      } else if (sentence.removed) {
        html.push(`<div style='${style.removed}'>${sentence.value}</div>`)
      }
    }

    if (html.length < 1) {
      return ''
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography>
              <strong>{title}</strong>
            </Typography>
            <div
              className={classes.htmlSpace}
              dangerouslySetInnerHTML={{ __html: html.join('') }}
            />
          </Paper>
        </Grid>
      </Grid>
    )
  }

  const codeDiff = Diff.diffSentences(firstCompareObject.code, secondCompareObject.code)
  const startAtDiff = Diff.diffSentences(
    formatDate(firstCompareObject.startAt),
    formatDate(secondCompareObject.startAt)
  )
  const endAtDiff = Diff.diffSentences(
    formatDate(firstCompareObject.endAt),
    formatDate(secondCompareObject.endAt)
  )
  const percentDiscountDiff = Diff.diffSentences(
    String(firstCompareObject.percentDiscount),
    String(secondCompareObject.percentDiscount)
  )
  const amountDiff = Diff.diffSentences(
    String(firstCompareObject.amount),
    String(secondCompareObject.amount)
  )
  const limitPerUserDiff = Diff.diffSentences(
    String(firstCompareObject.limitPerUser),
    String(secondCompareObject.limitPerUser)
  )
  const descriptionEnDiff = Diff.diffSentences(
    firstCompareObject.descriptionEn,
    secondCompareObject.descriptionEn
  )
  const descriptionThDiff = Diff.diffSentences(
    firstCompareObject.descriptionTh,
    secondCompareObject.descriptionTh
  )

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      fullWidth={true}
      scroll="paper"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">Compare Changes</DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
          {renderHtml(t('voucher.code'), codeDiff)}
          {renderHtml(t('voucher.startAt'), startAtDiff)}
          {renderHtml(t('voucher.endAt'), endAtDiff)}
          {renderHtml(t('voucher.discountPercent'), percentDiscountDiff)}
          {renderHtml(t('voucher.quantity'), amountDiff)}
          {renderHtml(t('voucher.limitPerUser'), limitPerUserDiff)}
          {renderHtml(t('voucher.description.en'), descriptionEnDiff)}
          {renderHtml(t('voucher.description.th'), descriptionThDiff)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOnClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
