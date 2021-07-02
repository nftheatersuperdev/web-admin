import { Grid } from '@material-ui/core'
import {
  PlayForWork as RequestedIcon,
  HowToReg as ApprovedIcon,
  CallMissed as RejectedIcon,
} from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { useUserAggregate } from 'services/evme'
import CardStatus from 'components/CardStatus'

export default function UserRegistration(): JSX.Element {
  const { t } = useTranslation()
  // backend not support filter by kyc date
  // const [reportDate, setReportDate] = useState<Date>(new Date())

  const { data: pendingData } = useUserAggregate({ kycStatus: { eq: 'pending' } })
  const { data: verifiedData } = useUserAggregate({ kycStatus: { eq: 'verified' } })
  const { data: rejectedData } = useUserAggregate({ kycStatus: { eq: 'rejected' } })

  const numberOfRequested = (pendingData || [])[0]?.count?.id || 0
  const numberOfApproved = (verifiedData || [])[0]?.count?.id || 0
  const numberOfRejected = (rejectedData || [])[0]?.count?.id || 0

  return (
    <Grid container spacing={3}>
      {/* backend not support filter by kyc date */}
      {/* <Grid item xs={12} sm={6} lg={4}>
        <Typography color="textSecondary" gutterBottom variant="h6">
          {t('dashboard.reportOfUserRegistration.title')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} lg={8}>
        <DatePicker
          label={t('dashboard.reportOfUserRegistration.periodDate')}
          id="userReportDate"
          name="userReportDate"
          format={DEFAULT_DATE_FORMAT}
          value={reportDate}
          onChange={(date) => {
            date && setReportDate(date.toDate())
          }}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid> */}

      <Grid item lg={4} sm={6} xl={4} xs={12}>
        <CardStatus
          title={t('dashboard.totalRequestedCases.title')}
          value={numberOfRequested}
          subTitle={t('dashboard.totalRequestedCases.subTitle')}
          icon={<RequestedIcon />}
          iconColor="#03a9f4"
        />
      </Grid>

      <Grid item lg={4} sm={6} xl={4} xs={12}>
        <CardStatus
          title={t('dashboard.totalApprovedCases.title')}
          value={numberOfApproved}
          subTitle={t('dashboard.totalApprovedCases.subTitle')}
          icon={<ApprovedIcon />}
          iconColor="#4caf50"
        />
      </Grid>

      <Grid item lg={4} sm={6} xl={4} xs={12}>
        <CardStatus
          title={t('dashboard.totalRejectedCases.title')}
          value={numberOfRejected}
          subTitle={t('dashboard.totalRejectedCases.subTitle')}
          icon={<RejectedIcon />}
          iconColor="#d32f2f"
        />
      </Grid>
    </Grid>
  )
}
