import { ReactElement } from 'react'
import { Avatar as AvatarBase, Box, Card, CardContent, Grid, Typography } from '@material-ui/core'
import styled from 'styled-components'

const Avatar = styled(AvatarBase)<{ color: string }>`
  background-color: ${({ color }) => color};
`

interface CardStatusProps {
  title: string
  value: string | number
  subTitle: string
  icon: ReactElement
  iconColor?: string
}

export default function CardStatus(props: CardStatusProps): JSX.Element {
  const { title, value, subTitle, icon, iconColor = 'gray' } = props
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} justify="space-between">
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
        <Box alignItems="center" display="flex" pt="2">
          <Typography color="textSecondary" variant="caption">
            {subTitle}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
