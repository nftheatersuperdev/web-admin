import { makeStyles } from '@mui/styles'
import { ChangeEvent } from 'react'

interface CheckBoxProps {
    id: string
    type: string
    name: string
    handleClick: (event: ChangeEvent<HTMLInputElement>) => void
    isChecked: boolean
}

export default function CheckBoxComponent(props: CheckBoxProps): JSX.Element {
  const useStyles = makeStyles({
    checkbox: {
      width: '18px',
      height: '18px',
      margin: '0 auto',
      marginLeft: '2px',
    },
  })
  const classes = useStyles()
  const { id, type, name, handleClick, isChecked } = props
  return (
    <input
      className={classes.checkbox}
      id={id}
      name={name}
      type={type}
      onChange={handleClick}
      checked={isChecked}
    />
  )
}
