import { Grid, Typography } from '@material-ui/core'
import {
  PeopleOutlined as PeopleIcon,
  DirectionsCar as CarIcon,
  Money as MoneyIcon,
  CardMembership as SubscriptionIcon,
  PlayForWork as RequestedIcon,
  HowToReg as ApprovedIcon,
  CallMissed as RejectedIcon,
} from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { filter, flow, pluck, some, sum } from 'lodash/fp'
import { formatMoney, nowLowerUpper } from 'utils'
import config from 'config'
import { ROUTE_PATHS } from 'routes'
import qs from 'qs'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { getInformations } from 'services/web-bff/dashboard'
import { Page } from 'layout/LayoutRoute'
import { CardStatus, DetailLink } from 'components/CardStatus'
import CardQuickLink from 'components/CardQuickLink'
import { useSubscriptionsFilterAndSort } from 'services/evme'
import { Sub } from 'services/evme.types'
import { SubEventStatus } from 'pages/Subscriptions/utils'

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
  const accessToken = useAuth().getToken() ?? ''
  const { t } = useTranslation()
  const todayLowerUpper = nowLowerUpper()

  const { data: dataInformations } = useQuery('dashboard-informations', () =>
    getInformations(accessToken)
  )
  const informations = dataInformations?.data.dashboard

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

  const totalCars = informations?.totalCars ?? 0
  const totalAvailableCars = informations?.totalAvailableCars ?? 0
  const totalSubscriptions = informations?.totalSubscriptions ?? 0
  const totalUsers = informations?.totalUsers ?? 0
  const totalUpcomingCarsDelivery = informations?.totalUpcomingCarsDelivery ?? 0
  const totalUpcomingCarsReturn = informations?.totalUpcomingCarsReturn ?? 0
  const totalKYC = informations?.totalKYC ?? 0
  const totalKYCApproved = informations?.totalKYCApproved ?? 0
  const totalKYCRejected = informations?.totalKYCRejected ?? 0

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
          <Grid container spacing={3}>
            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CardStatus
                title={t('dashboard.totalRequestedCases.title')}
                value={totalKYC}
                subTitle={t('dashboard.totalRequestedCases.subTitle')}
                icon={<RequestedIcon />}
                iconColor="#03a9f4"
                detailLink={<DetailLink pathname={ROUTE_PATHS.USER} />}
              />
            </Grid>

            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CardStatus
                title={t('dashboard.totalApprovedCases.title')}
                value={totalKYCApproved}
                subTitle={t('dashboard.totalApprovedCases.subTitle')}
                icon={<ApprovedIcon />}
                iconColor="#4caf50"
                detailLink={
                  <DetailLink
                    pathname={ROUTE_PATHS.USER}
                    search={qs.stringify({ kycStatus: { eq: 'verified' } })}
                  />
                }
              />
            </Grid>

            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CardStatus
                title={t('dashboard.totalRejectedCases.title')}
                value={totalKYCRejected}
                subTitle={t('dashboard.totalRejectedCases.subTitle')}
                icon={<RejectedIcon />}
                iconColor="#d32f2f"
                detailLink={
                  <DetailLink
                    pathname={ROUTE_PATHS.USER}
                    search={qs.stringify({ kycStatus: { eq: 'rejected' } })}
                  />
                }
              />
            </Grid>
          </Grid>
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
