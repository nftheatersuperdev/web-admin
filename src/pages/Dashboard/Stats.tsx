/* eslint-disable react/function-component-definition */
import React from 'react'
import styled from 'styled-components'
import { rgba } from 'polished'
import {
  Box,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Typography as MuiTypography,
} from '@mui/material'
import { spacing } from '@mui/system'

const Card = styled(MuiCard)<{ illustration?: string }>`
  position: relative;
  margin-bottom: ${(props) => props.theme.spacing(6)};
`

const Typography = styled(MuiTypography)(spacing)

const CardContent = styled(MuiCardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};

  span {
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`

const Percentage = styled(MuiTypography)<{
  percentagecolor: string
  illustration?: string
}>`
  span {
    color: ${(props) => props.percentagecolor};
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    background: ${(props) => rgba(props.percentagecolor, 0.1)};
    padding: 2px;
    border-radius: 3px;
    margin-right: ${(props) => props.theme.spacing(2)};
  }
`

const IllustrationImage = styled.img`
  height: 100px;
  position: absolute;
  right: ${(props) => props.theme.spacing(1)};
  bottom: ${(props) => props.theme.spacing(1)};
  display: none;

  ${(props) => props.theme.breakpoints.between('xs', 'lg')} {
    display: block;
  }

  @media (min-width: 1600px) {
    display: block;
  }
`

interface StatsProps {
  title: string
  amount: string
  chip: string
  percentagetext: string
  percentagecolor: string
  illustration?: string
}

const Stats: React.FC<StatsProps> = ({
  title,
  amount,
  chip,
  percentagetext,
  percentagecolor,
  illustration,
}) => {
  return (
    <Card illustration={illustration}>
      <CardContent>
        <Typography variant="h6" mb={4}>
          {title}
        </Typography>
        <Typography variant="h3" mb={3}>
          <Box fontWeight="fontWeightRegular">{amount}</Box>
        </Typography>
        <Percentage
          variant="subtitle2"
          color="textSecondary"
          percentagecolor={percentagecolor}
          illustration={illustration}
        >
          <span>{percentagetext}</span> Since last month
        </Percentage>
        {!illustration && <Chip label={chip} />}
      </CardContent>

      {!!illustration && <IllustrationImage src={illustration} alt="Illustration" />}
    </Card>
  )
}

export default Stats
