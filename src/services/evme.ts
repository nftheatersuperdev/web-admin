import { GraphQLClient, gql } from 'graphql-request'
import { useQuery, UseQueryResult } from 'react-query'
import config from 'config'
import { CarModel, Package, Sub } from './evme.types'

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
                  topSpeed
                  acceleration
                  topSpeed
                  range
                  totalPower
                  chargeType
                  chargeTime
                  fastChargeTime
                  bodyTypeId
                  model
                  cars {
                    id
                    vin
                    plateNumber
                  }
                  createdAt
                  updatedAt
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

export function useSubscriptions(): UseQueryResult<WithPaginationType<Sub>> {
  return useQuery(
    ['evme:subscriptions'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetSubscriptions {
            subscriptions {
              edges {
                node {
                  id
                  startDate
                  endDate
                  createdAt
                  updatedAt
                  kind
                  user {
                    phoneNumber
                    email
                  }
                  car {
                    carModel {
                      brand
                      model
                      seats
                      topSpeed
                      fastChargeTime
                    }
                  }
                  packagePrice {
                    duration
                    package {
                      active
                      prices {
                        duration
                        price
                      }
                    }
                  }
                }
              }
            }
          }
        `
      )
      return response.subscriptions
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve subscriptions, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function usePackages(): UseQueryResult<WithPaginationType<Package>> {
  return useQuery(
    ['evme:subscriptions'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetPackages {
            packages {
              edges {
                node {
                  id
                  createdAt
                  updatedAt
                  active
                  prices {
                    duration
                    price
                  }
                }
              }
            }
          }
        `
      )
      return response.packages
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve packages, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}
