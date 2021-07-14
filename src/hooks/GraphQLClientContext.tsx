import { ReactElement, createContext, useContext, useState, useEffect } from 'react'
import { GraphQLClient } from 'graphql-request'
import { useAuth } from 'auth/AuthContext'

interface GraphQLClientProviderProps {
  gqlClient: GraphQLClient
  children: ReactElement
}

interface GraphQLClientProps {
  gqlClient: GraphQLClient
}

const GraphQLClientContext = createContext<GraphQLClientProps>({
  gqlClient: new GraphQLClient(''),
})

export function GraphQLClientProvider({
  gqlClient,
  children,
}: GraphQLClientProviderProps): JSX.Element {
  const [token, setToken] = useState<string>('')
  const { getToken } = useAuth()

  useEffect(() => {
    const initialToken = async () => {
      const idToken = await getToken()
      setToken(idToken)
    }

    initialToken()
  }, [getToken])

  gqlClient.setHeader('authorization', `Bearer ${token}`)

  return (
    <GraphQLClientContext.Provider value={{ gqlClient }}>{children}</GraphQLClientContext.Provider>
  )
}

export const useGraphQLClient = (): GraphQLClientProps =>
  useContext<GraphQLClientProps>(GraphQLClientContext)
