import { Backdrop, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Wrapper } from 'components/Styled'
import PageTitle from 'components/PageTitle'
import { Page } from 'layout/LayoutRoute'

export default function Customer(): JSX.Element {
  const { t } = useTranslation()
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [open, setOpen] = useState(true)
  const handleClose = () => {
    setOpen(false)
  }
  setTimeout(() => {
    setIsFetching(false)
  }, 1500)
  return (
    <Page>
      {isFetching ? (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ''
      )}
      <PageTitle title={t('customer.title')} />
      <Wrapper />
    </Page>
  )
}
