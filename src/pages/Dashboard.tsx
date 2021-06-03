import { Grid, Typography } from '@material-ui/core'
import {
  PeopleOutlined as PeopleIcon,
  DirectionsCar as CarIcon,
  Money as MoneyIcon,
} from '@material-ui/icons'
import { Page } from 'layout/LayoutRoute'
import CardStatus from 'components/CardStatus'
import CardQuickLink from 'components/CardQuickLink'
import { useCars, usePayments, useSubscriptions } from 'services/evme'

function _formatMoney(amount: number) {
  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

const quickLinks = [
  {
    logo: '/images/omise.png',
    title: 'Omise',
    link: 'https://omise.co/',
    description: 'Our payment provider',
  },
  {
    logo: '/images/instabug.png',
    title: 'Instabug',
    link: 'https://instabug.com/',
    description: 'Mobile testing & feedback',
  },
  {
    logo: '/images/sentry.png',
    title: 'Sentry',
    link: 'https://sentry.io/organizations/evme/projects/',
    description: 'Log monitoring & error management',
  },
  {
    logo: '/images/drvr.png',
    title: 'DRVR',
    link: 'https://drvrapp.drvr.co/',
    description: 'Fleet Management',
  },
  {
    logo: '/images/amplitude.png',
    title: 'Amplitude',
    link: 'https://analytics.amplitude.com/pttplc',
    description: 'Business intelligence & analytics',
  },
  {
    logo: '/images/firebase.png',
    title: 'Firebase',
    link: 'https://console.firebase.google.com/u/0/project/evme-dev',
    description: 'Used for analytics, authentication and more',
  },
]

export default function Dashboard(): JSX.Element {
  const { data: cars } = useCars()
  const { data: subscriptions } = useSubscriptions()
  const { data: payments } = usePayments()

  const totalCars =
    cars?.edges?.reduce((count, { node }) => count + (node?.cars?.length || 0), 0) || 0

  // TODO: once API is ready we can filter for active subscriptions
  const totalSubscriptions = subscriptions?.edges.length || 0

  const totalPaymentAmountToday =
    payments?.edges.reduce((count, { node }) => count + node?.amount, 0) || 0

  return (
    <Page>
      <Grid container spacing={3}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title="Available Cars"
            value={totalCars}
            subTitle="Number of cars currently available"
            icon={<CarIcon />}
            iconColor="red"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title="Total Subscriptions"
            value={totalSubscriptions}
            subTitle="Number of currently active subscriptions"
            icon={<PeopleIcon />}
            iconColor="purple"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title="Total Payments"
            value={_formatMoney(totalPaymentAmountToday)}
            subTitle="Total amount of payments today"
            icon={<MoneyIcon />}
            iconColor="green"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title="Total Users"
            value="12"
            subTitle="Total number of registered users"
            icon={<PeopleIcon />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="textSecondary">
            Quick Links
          </Typography>
        </Grid>

        {quickLinks.map(({ link, title, logo, description }) => (
          <Grid item key={link} lg={4} md={6} xs={12}>
            <CardQuickLink link={link} title={title} logo={logo} description={description} />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}
