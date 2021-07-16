import styled from 'styled-components'
import { Button } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const Page = styled.div`
  width: 100%;
  text-align: center;
`

const BackButton = styled(Button)`
  margin-top: 40px;
`

export default function Forbidden(): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <Page>
      <h3>{t('forbidden.title')}</h3>
      <BackButton
        variant="contained"
        color="primary"
        onClick={() => {
          history.push('/')
        }}
      >
        {t('button.back')}
      </BackButton>
    </Page>
  )
}
