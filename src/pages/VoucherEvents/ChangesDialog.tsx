/* eslint-disable react/no-danger */
import * as Diff from 'diff'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import {
  Button,
  Divider,
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
  added: 'background-color: rgb(204, 232, 204);color: rgb(0, 55, 0);',
  removed:
    'background-color: rgb(232, 204, 204);color: rgb(55, 0, 0);text-decoration:line-through;',
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
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
        html.push(`<span style='${style.added}'>${sentence.value.replace(/\n/g, '<br />')}</span>`)
      } else if (sentence.removed) {
        html.push(
          `<span style='${style.removed}'>${sentence.value.replace(/\n/g, '<br />')}</span>`
        )
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
            <Divider />
            <div dangerouslySetInnerHTML={{ __html: html.join('<br />') }} />
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
          {renderHtml(t('voucher.percentDiscount'), percentDiscountDiff)}
          {renderHtml(t('voucher.amount'), amountDiff)}
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
