import { Grid, Typography } from '@material-ui/core'
import {
  PeopleOutlined as PeopleIcon,
  DirectionsCar as CarIcon,
  Money as MoneyIcon,
  CardMembership as SubscriptionIcon,
} from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { filter, flow, pluck, some, sum } from 'lodash/fp'
import { formatMoney, nowLowerUpper } from 'utils'
import config from 'config'
import { ROUTE_PATHS } from 'routes'
import qs from 'qs'
import { Page } from 'layout/LayoutRoute'
import { CardStatus, DetailLink } from 'components/CardStatus'
import CardQuickLink from 'components/CardQuickLink'
import { useCars, useSubscriptions, useSubscriptionsFilterAndSort, useUsers } from 'services/evme'
import { CarEdge, Sub } from 'services/evme.types'
import { SubEventStatus } from 'pages/Subscriptions/utils'
import CarsDelivery from './CarsDelivery'
import CarsReturn from './CarsReturn'
import UserRegistration from './UserRegistration'

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
    logo: '/images/cartrack.png',
    title: 'Cartrack',
    link: 'https://fleetweb-th.cartrack.com',
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
    link: 'https://console.firebase.google.com/u/0/project/evme-ptt',
    description: 'Used for authentication, analytics and more',
  },
  {
    logo: '/images/sumsub.png',
    title: 'SumSub',
    link: 'https://api.sumsub.com',
    description: 'Know Your Customer (KYC)',
  },
]

export default function Dashboard(): JSX.Element {
  const { t } = useTranslation()
  const todayLowerUpper = nowLowerUpper()
  const { data: cars } = useCars(config.maxInteger)
  const { data: subscriptions } = useSubscriptions()
  const { data: upcomingDelieverySubscriptions } = useSubscriptionsFilterAndSort({
    and: {
      startDate: { between: todayLowerUpper },
      events: { status: { eq: 'accepted' } },
    },
  })
  const { data: upcomingReturnSubscriptions } = useSubscriptionsFilterAndSort({
    and: {
      endDate: { between: todayLowerUpper },
      events: { status: { eq: 'delivered' } },
    },
  })

  const todaySubscriptions = useSubscriptionsFilterAndSort(
    {
      startDate: {
        between: todayLowerUpper,
      },
    },
    undefined,
    undefined,
    config.maxInteger
  )

  const todaySubscriptionsData = todaySubscriptions?.data?.data || []
  const totalPaymentAmountToday =
    flow(
      filter((sub: Sub) => !some({ status: SubEventStatus.CANCELLED })(sub.events)),
      pluck('chargedPrice'),
      sum
    )(todaySubscriptionsData) || 0

  const { data: users } = useUsers(config.tableRowsDefaultPageSize, {
    // filter only "user"
    role: {
      eq: 'user',
    },
  })
  const totalCars = cars?.pages[0]?.totalCount || 0
  const totalAvailableCars = filter((e: CarEdge) => e.node.latestStatus === 'available')(
    cars?.pages[0]?.edges
  ).length
  const totalSubscriptions = subscriptions?.pages[0]?.totalCount || 0

  const totalUsers = users?.pages[0]?.totalCount || 0
  const totalUpcomingCarsDelivery = upcomingDelieverySubscriptions?.totalData || 0
  const totalUpcomingCarsReturn = upcomingReturnSubscriptions?.totalData || 0
  return (
    <Page>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h1>{t('dashboard.overall')}</h1>
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalCars.title')}
            value={`${totalAvailableCars}/${totalCars}`}
            subTitle={t('dashboard.totalCars.subTitle')}
            icon={<CarIcon />}
            iconColor="red"
            detailLink={<DetailLink pathname={ROUTE_PATHS.CAR} />}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalPayments.title')}
            value={'-' || formatMoney(totalPaymentAmountToday)}
            subTitle={t('dashboard.totalPayments.subTitle')}
            icon={<MoneyIcon />}
            iconColor="green"
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalUsers.title')}
            value={totalUsers}
            subTitle={t('dashboard.totalUsers.subTitle')}
            icon={<PeopleIcon />}
            iconColor="#5d4037"
            detailLink={<DetailLink pathname={ROUTE_PATHS.USER} />}
          />
        </Grid>
        <Grid item xs={12}>
          <h1>{t('dashboard.kyc')}</h1>
        </Grid>
        <Grid item xs={12}>
          <UserRegistration />
        </Grid>
        <Grid item xs={12}>
          <h1>{t('dashboard.subscription')}</h1>
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalSubscriptions.title')}
            value={totalSubscriptions}
            subTitle={t('dashboard.totalSubscriptions.subTitle')}
            icon={<SubscriptionIcon />}
            iconColor="purple"
            detailLink={<DetailLink pathname={ROUTE_PATHS.SUBSCRIPTION} />}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalUpcomingCarsDelivery.title')}
            value={totalUpcomingCarsDelivery}
            subTitle={t('dashboard.totalUpcomingCarsDelivery.subTitle')}
            icon={<SubscriptionIcon />}
            iconColor="purple"
            detailLink={
              <DetailLink
                pathname={ROUTE_PATHS.SUBSCRIPTION}
                search={qs.stringify({
                  and: {
                    startDate: { between: todayLowerUpper },
                    events: { status: { eq: 'accepted' } },
                  },
                })}
              />
            }
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalUpcomingCarsReturn.title')}
            value={totalUpcomingCarsReturn}
            subTitle={t('dashboard.totalUpcomingCarsReturn.subTitle')}
            icon={<SubscriptionIcon />}
            iconColor="purple"
            detailLink={
              <DetailLink
                pathname={ROUTE_PATHS.SUBSCRIPTION}
                search={qs.stringify({
                  and: {
                    endDate: { between: todayLowerUpper },
                    events: { status: { eq: 'delivered' } },
                  },
                })}
              />
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CarsDelivery />
        </Grid>

        <Grid item xs={12} lg={6}>
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
