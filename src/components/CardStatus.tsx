import { ReactElement } from 'react'
import { Avatar as AvatarBase, Box, Card, CardContent, Grid, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Avatar = styled(AvatarBase)<{ color: string }>`
  background-color: ${({ color }) => color};
`

interface DetailLinkProps {
  pathname: string
  search?: string
}

function DetailLink(props: DetailLinkProps): JSX.Element {
  const { pathname, search } = props
  const { t } = useTranslation()

  return (
    <Link to={{ pathname, search }}>
      <Typography color="textSecondary" variant="caption">
        {t('cardStatus.detail')}
      </Typography>
    </Link>
  )
}

interface CardStatusProps {
  title: string
  value: string | number
  subTitle: string
  icon: ReactElement
  iconColor?: string
  detailLink?: ReactElement
}

function CardStatus(props: CardStatusProps): JSX.Element {
  const { title, value, subTitle, icon, iconColor = 'gray', detailLink } = props
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar color={iconColor}>{icon}</Avatar>
          </Grid>
        </Grid>
        <Box alignItems="center" justifyContent="space-between" display="flex" pt="2">
          <Typography color="textSecondary" variant="caption">
            {subTitle}
          </Typography>
          {detailLink}
        </Box>
      </CardContent>
    </Card>
  )
}

export { CardStatus, DetailLink }
