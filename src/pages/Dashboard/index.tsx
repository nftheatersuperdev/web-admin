/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react'
import { Grid, Typography, Autocomplete, TextField } from '@mui/material'
import {
  PeopleOutlined as PeopleIcon,
  DirectionsCar as CarIcon,
  Money as MoneyIcon,
  CardMembership as SubscriptionIcon,
  PlayForWork as RequestedIcon,
  HowToReg as ApprovedIcon,
  CallMissed as RejectedIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils'
import { ROUTE_PATHS } from 'routes'
import qs from 'qs'
import { useQuery } from 'react-query'
import { LocationResponse } from 'services/web-bff/location.type'
import { getInformations } from 'services/web-bff/dashboard'
import { getLocationList } from 'services/web-bff/location'
import { Page } from 'layout/LayoutRoute'
import { CardStatus, DetailLink } from 'components/CardStatus'
import CardQuickLink from 'components/CardQuickLink'
import { SelectOption, getLocationOptions } from './utils'
import { useStyles } from './styles'

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
  const classes = useStyles()
  const { t } = useTranslation()
  const todayLowerUpper = formatDate(Date(), 'YYYY-MM-DD')

  const { data: locations, isFetched: isFetchedLocation } = useQuery('get-location', () =>
    getLocationList()
  )

  useEffect(() => {
    if (isFetchedLocation && locations) {
      setLocationData(locations)
    }
  }, [locations, isFetchedLocation])

  const [locationData, setLocationData] = useState<LocationResponse | null>()
  const locationOptions = getLocationOptions(locationData)
  const defaultLocation = {
    label: t('dashboard.allLocation'),
    value: 'all',
  }
  const [selectedLocation, setSelectedLocation] = useState<SelectOption | null>()
  const onSetSelectedLocation = (option: SelectOption | null) => {
    if (option) {
      setSelectedLocation(option)
      // formik.setFieldValue('searchLocation', option.value)
      // formik.handleSubmit()
    } else {
      setSelectedLocation(defaultLocation)
      // formik.setFieldValue('searchLocation', '')
      // formik.handleSubmit()
    }
  }

  const { data: dataInformations } = useQuery('dashboard-informations', () => getInformations())
  const informations = dataInformations?.data.summary

  const totalCars = informations?.car.total ?? 0
  const totalAvailableCars = informations?.car.numberOfCarInService ?? 0
  const totalSubscriptions = informations?.booking.total ?? 0
  const totalUsers = informations?.customer.total ?? 0
  const totalUpcomingCarsDelivery = informations?.booking.numberOfDeliveryTaskInThisDay ?? 0
  const totalUpcomingCarsReturn = informations?.booking.numberOfReturnTaskInThisDay ?? 0
  const totalKYC = informations?.customer.total ?? 0
  const totalKYCApproved = informations?.customer.numberOfKycVerifiedStatus ?? 0
  const totalKYCRejected = informations?.customer.numberOfKycRejectedStatus ?? 0

  const searchReturn = qs.stringify({
    returnDate: todayLowerUpper,
    status: ['delivered', 'cancelled'],
  })

  return (
    <Page>
      <Grid container spacing={3}>
        <Grid item xs={9} sm={9}>
          <h1>{t('dashboard.overall')}</h1>
        </Grid>
        <Grid item xs={9} sm={3}>
          <Autocomplete
            autoHighlight
            id="search_location_list"
            className={classes.autoCompleteSelect}
            options={locationOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={t('dashboard.location')}
                  variant="outlined"
                  placeholder={t('dashboard.allLocation')}
                />
              )
            }}
            isOptionEqualToValue={(option, value) =>
              option.value === value.value || value.value === 'all'
            }
            value={selectedLocation || defaultLocation}
            defaultValue={selectedLocation || defaultLocation}
            onChange={(_e, value) => {
              onSetSelectedLocation(value)
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalCars.title')}
            value={`${totalAvailableCars.toLocaleString()}/${totalCars.toLocaleString()}`}
            subTitle={t('dashboard.totalCars.subTitle')}
            icon={<CarIcon />}
            iconColor="red"
            detailLink={<DetailLink pathname={ROUTE_PATHS.CAR} />}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalPayments.title')}
            value="-"
            subTitle={t('dashboard.totalPayments.subTitle')}
            icon={<MoneyIcon />}
            iconColor="green"
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalUsers.title')}
            value={totalUsers.toLocaleString()}
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
                value={totalKYC.toLocaleString()}
                subTitle={t('dashboard.totalRequestedCases.subTitle')}
                icon={<RequestedIcon />}
                iconColor="#03a9f4"
                detailLink={<DetailLink pathname={ROUTE_PATHS.USER} />}
              />
            </Grid>

            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CardStatus
                title={t('dashboard.totalApprovedCases.title')}
                value={totalKYCApproved.toLocaleString()}
                subTitle={t('dashboard.totalApprovedCases.subTitle')}
                icon={<ApprovedIcon />}
                iconColor="#4caf50"
                detailLink={
                  <DetailLink
                    pathname={ROUTE_PATHS.USER}
                    search={qs.stringify({ kycStatus: 'verified' })}
                  />
                }
              />
            </Grid>

            <Grid item lg={4} sm={6} xl={4} xs={12}>
              <CardStatus
                title={t('dashboard.totalRejectedCases.title')}
                value={totalKYCRejected.toLocaleString()}
                subTitle={t('dashboard.totalRejectedCases.subTitle')}
                icon={<RejectedIcon />}
                iconColor="#d32f2f"
                detailLink={
                  <DetailLink
                    pathname={ROUTE_PATHS.USER}
                    search={qs.stringify({ kycStatus: 'rejected' })}
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
            value={totalSubscriptions.toLocaleString()}
            subTitle={t('dashboard.totalSubscriptions.subTitle')}
            icon={<SubscriptionIcon />}
            iconColor="purple"
            detailLink={<DetailLink pathname={ROUTE_PATHS.BOOKING} />}
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalUpcomingCarsDelivery.title')}
            value={totalUpcomingCarsDelivery.toLocaleString()}
            subTitle={t('dashboard.totalUpcomingCarsDelivery.subTitle')}
            icon={<SubscriptionIcon />}
            iconColor="purple"
            detailLink={
              <DetailLink
                pathname={ROUTE_PATHS.BOOKING}
                search={qs.stringify({
                  deliveryDate: todayLowerUpper,
                  status: 'accepted',
                })}
              />
            }
          />
        </Grid>
        <Grid item sm={4} xs={12}>
          <CardStatus
            title={t('dashboard.totalUpcomingCarsReturn.title')}
            value={totalUpcomingCarsReturn.toLocaleString()}
            subTitle={t('dashboard.totalUpcomingCarsReturn.subTitle')}
            icon={<SubscriptionIcon />}
            iconColor="purple"
            detailLink={<DetailLink pathname={ROUTE_PATHS.BOOKING} search={searchReturn} />}
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
