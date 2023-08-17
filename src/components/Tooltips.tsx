import {
  Tv as TvIcon,
  AddToQueue as AdditionalScreenIcon,
  PhoneIphone,
  AccountBox,
} from '@mui/icons-material'
import { Tooltip, IconButton } from '@mui/material'

interface TooltipOptions {
  type: string
  color: string
  subTitle?: string
  onClick?: () => void
}
export default function Tooltips({ type, color, subTitle, onClick }: TooltipOptions): JSX.Element {
  if (type === 'TV') {
    return (
      <Tooltip title={subTitle}>
        <IconButton onClick={onClick}>
          <TvIcon htmlColor={color} />
        </IconButton>
      </Tooltip>
    )
  } else if (type === 'ADDITIONAL') {
    return (
      <Tooltip title={subTitle}>
        <IconButton onClick={onClick}>
          <AdditionalScreenIcon htmlColor={color} />
        </IconButton>
      </Tooltip>
    )
  } else if (type === 'ADMIN') {
    return (
      <Tooltip title={subTitle}>
        <IconButton onClick={onClick}>
          <AccountBox htmlColor={color} />
        </IconButton>
      </Tooltip>
    )
  } else if (type === 'USER') {
    return (
      <Tooltip title={subTitle}>
        <IconButton onClick={onClick}>
          <AccountBox htmlColor={color} />
        </IconButton>
      </Tooltip>
    )
  }
  return (
    <Tooltip title={subTitle}>
      <IconButton onClick={onClick}>
        <PhoneIphone htmlColor={color} />
      </IconButton>
    </Tooltip>
  )
}
