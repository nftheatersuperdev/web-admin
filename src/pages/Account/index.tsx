import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { ROUTE_PATHS } from 'routes'
import { Page } from 'layout/LayoutRoute'
import { getAdminUserProfile } from 'services/web-bff/admin-user'

const GridContainer = styled(Grid)`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: calc(100% + 24px);
  margin-top: -6px;
  margin-left: -24px;
`

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const UserAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
`

const UserTitle = styled(Typography)`
  font-weight: 600;
  font-size: 24px;
  color: rgb(23, 43, 77);
`

const UserSubTitle = styled(Typography)`
  margin: 0;
  color: rgb(107, 119, 140);
`

const ProfileTitle = styled(CardHeader)`
  .MuiCardHeader-title {
    font-weight: 600;
  }
`

export default function Account(): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()
  const { firebaseUser, getRoleDisplayName, getToken } = useAuth()
  const role = getRoleDisplayName()
  const accessToken = getToken() ?? ''
  const { data: profile } = useQuery('cars', () => getAdminUserProfile({ accessToken }))

  const lastSignIn = firebaseUser?.metadata?.lastSignInTime
    ? dayjs(firebaseUser?.metadata?.lastSignInTime).format('DD/MM/YYYY HH:mm')
    : ''

  return (
    <Page>
      <Container maxWidth="lg">
        <GridContainer container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card>
              <CardContent>
                <AvatarWrapper>
                  <UserAvatar src={firebaseUser?.photoURL || ''} />
                  <UserTitle variant="h3" gutterBottom>
                    {firebaseUser?.email}
                  </UserTitle>
                  <UserSubTitle variant="body1">{role}</UserSubTitle>
                  <UserSubTitle variant="body1">{lastSignIn}</UserSubTitle>
                </AvatarWrapper>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  color="primary"
                  size="medium"
                  fullWidth
                  onClick={() => {
                    history.push(ROUTE_PATHS.ACCOUNT_SETTINGS)
                  }}
                >
                  {t('account.updatePassword')}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <Card>
              <ProfileTitle title={t('account.profileTitle')} />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="firstname"
                      label={t('account.firstName')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      value={profile?.firstName || '-'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="lastname"
                      label={t('account.lastName')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      value={profile?.lastName || '-'}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="email"
                      label={t('account.email')}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      value={profile?.email || '-'}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </GridContainer>
      </Container>
    </Page>
  )
}
