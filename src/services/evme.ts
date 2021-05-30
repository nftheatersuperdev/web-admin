import { GraphQLClient, gql } from 'graphql-request'
import { useQuery, UseQueryResult } from 'react-query'
import config from 'config'
import { CarModel } from './evme.types'

const gqlClient = new GraphQLClient(config.evme)

export interface WithPaginationType<P> {
  edges: {
    node: P
  }[]
}

export function useCars(): UseQueryResult<WithPaginationType<CarModel>> {
  return useQuery(
    ['evme:cars'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetCars {
            carModels {
              edges {
                node {
                  brand
                  model
                  cars {
                    id
                    vin
                    plateNumber
                  }
                }
              }
            }
          }
        `
      )
      return response.carModels
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve cars, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}
