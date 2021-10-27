import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'auth/AuthContext'

const InvisibilityDOM = styled.div`
  display: none;
`

export default function Logout(): JSX.Element {
  const history = useHistory()
  const { signOut } = useAuth()

  const signOutAndRedirectToLoginPage = async () => {
    await signOut()
    history.push('/login')
  }

  signOutAndRedirectToLoginPage()

  return <InvisibilityDOM />
}
