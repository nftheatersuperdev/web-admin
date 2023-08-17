import React, { useCallback } from 'react'
import { Tab } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AccountBalance, YouTube } from '@mui/icons-material'
import styles from './tab.module.css'

export interface Props {
  title: string
  index: number
  setSelectedTab: (index: number) => void
  isActive?: boolean
  hideTab?: boolean
}

function TabTitle(props: Props): JSX.Element {
  const useStyles = makeStyles({
    hideObject: {
      display: 'none',
    },
  })
  const classes = useStyles()
  const { title, setSelectedTab, index, isActive, hideTab } = props
  const handleOnClick = useCallback(() => {
    setSelectedTab(index)
  }, [setSelectedTab, index])

  return (
    <li className={`${styles.title} ${isActive ? 'active' : ''}`}>
      <Tab
        label={title}
        onClick={handleOnClick}
        className={hideTab ? classes.hideObject : ''}
        icon={title === 'Netflix' ? <AccountBalance /> : <YouTube />}
        aria-label="youtube"
        // disabled={moduleAccount === 'NETFLIX'}
      />

      {/* <Button className={hideTab ? classes.hideObject : ''} onClick={handleOnClick}>
        {title}
      </Button> */}
    </li>
  )
}

export default TabTitle
