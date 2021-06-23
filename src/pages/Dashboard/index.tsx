import { Grid, Typography } from '@material-ui/core'
import {
  PeopleOutlined as PeopleIcon,
  DirectionsCar as CarIcon,
  Money as MoneyIcon,
} from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { Page } from 'layout/LayoutRoute'
import CardStatus from 'components/CardStatus'
import CardQuickLink from 'components/CardQuickLink'
import { useCars, usePayments, useSubscriptions, useUsers } from 'services/evme'
import CarsDelivery from './CarsDelivery'
import CarsReturn from './CarsReturn'

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
  const { t } = useTranslation()
  const { data: cars } = useCars()
  const { data: subscriptions } = useSubscriptions()
  const { data: payments } = usePayments()
  const { data: users } = useUsers()

  const totalCars = cars?.pages[0]?.totalCount || 0

  const totalPaymentAmountToday =
    payments?.edges.reduce((count, { node }) => count + node?.amount, 0) || 0

  const totalUsers = users?.pages[0]?.totalCount || 0

  return (
    <Page>
      <Grid container spacing={3}>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title={t('dashboard.totalCars.title')}
            value={totalCars}
            subTitle={t('dashboard.totalCars.subTitle')}
            icon={<CarIcon />}
            iconColor="red"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title={t('dashboard.totalSubscriptions.title')}
            value={subscriptions?.totalCount || 0}
            subTitle={t('dashboard.totalSubscriptions.subTitle')}
            icon={<PeopleIcon />}
            iconColor="purple"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title={t('dashboard.totalPayments.title')}
            value={_formatMoney(totalPaymentAmountToday)}
            subTitle={t('dashboard.totalPayments.subTitle')}
            icon={<MoneyIcon />}
            iconColor="green"
          />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <CardStatus
            title={t('dashboard.totalUsers.title')}
            value={totalUsers}
            subTitle={t('dashboard.totalUsers.subTitle')}
            icon={<PeopleIcon />}
          />
        </Grid>

        <Grid item xs={6}>
          <CarsDelivery />
        </Grid>

        <Grid item xs={6}>
          <CarsReturn />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" color="textSecondary">
            {t('dashboard.quickLinks')}
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
