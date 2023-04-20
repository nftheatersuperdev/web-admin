import { Typography, Breadcrumbs, Card, Link } from '@mui/material'
import { makeStyles } from '@mui/styles'
// import { formatDate } from 'utils'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
// import { useQuery } from 'react-query'
import { Page } from 'layout/LayoutRoute'
import PageTitle from 'components/PageTitle'
// import NoResultCard from 'components/NoResultCard'

const useStyles = makeStyles({
  hide: {
    display: 'none',
  },
  headerTopic: {
    padding: '8px 16px',
  },
  detailContainer: {
    padding: '10px 25px',
  },
  bottomContrainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px 25px',
  },
  deleteProfileButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
})

interface CustomerProfileDetailEditParam {
  id: string
}

export default function CustomerProfileDetail(): JSX.Element {
  const { t } = useTranslation()
  const classes = useStyles()
  const params = useParams<CustomerProfileDetailEditParam>()
  return (
    <Page>
      <PageTitle title={t('sidebar.userManagement.customerProfile')} />
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>{t('sidebar.userManagement.title')}</Typography>
        <Link underline="hover" color="inherit" href="/customer-profile">
          {t('sidebar.userManagement.customerProfile')}
        </Link>
        <Typography color="primary">{t('sidebar.customerDetails')}</Typography>
      </Breadcrumbs>
      <br />
      <Card>
        <div className={classes.headerTopic}>
          <Typography>
            {t('sidebar.customerDetails')}
            {params}
          </Typography>
        </div>
      </Card>
    </Page>
  )
}
