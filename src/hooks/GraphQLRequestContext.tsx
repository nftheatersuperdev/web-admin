import { ReactElement, createContext, useContext } from 'react'
import { GraphQLClient } from 'graphql-request'
import { RequestDocument, Variables } from 'graphql-request/dist/types'
import * as Dom from 'graphql-request/dist/types.dom'
import { useAuth } from 'auth/AuthContext'

interface GraphQLRequestProviderProps {
  gqlClient: GraphQLClient
  children: ReactElement
}

interface GraphQLRequestProps {
  gqlRequest: GraphQLClient['request']
}

const GraphQLRequestContext = createContext<GraphQLRequestProps>({
  gqlRequest: new GraphQLClient('').request,
})

export function GraphQLRequestProvider({
  gqlClient,
  children,
}: GraphQLRequestProviderProps): JSX.Element {
  const { getToken } = useAuth()

  const gqlRequest = (
    document: RequestDocument,
    variables?: Variables,
    requestHeaders?: Dom.RequestInit['headers']
  ) => {
    const token = getToken()

    const headers: Dom.RequestInit['headers'] = {
      ...(requestHeaders || {}),
      Authorization: `Bearer ${token}`,
    }

    return gqlClient.request(document, variables, headers)
  }

  return (
    <GraphQLRequestContext.Provider value={{ gqlRequest }}>
      {children}
    </GraphQLRequestContext.Provider>
  )
}

export const useGraphQLRequest = (): GraphQLRequestProps =>
  useContext<GraphQLRequestProps>(GraphQLRequestContext)
