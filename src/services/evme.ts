import { GraphQLClient, gql } from 'graphql-request'
import { useQuery, UseQueryResult } from 'react-query'
import config from 'config'
import { CarModel, PackagePrice, Payment, Sub, User } from './evme.types'

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
                  userId
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
                    vin
                    plateNumber
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
                    price
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

export function usePricing(): UseQueryResult<WithPaginationType<PackagePrice>> {
  return useQuery(
    ['evme:subscriptions'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetPricing {
            packagePrices {
              edges {
                node {
                  id
                  createdAt
                  updatedAt
                  duration
                  price
                  carModel {
                    brand
                    model
                  }
                }
              }
            }
          }
        `
      )
      return response.packagePrices
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve pricing, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function usePayments(): UseQueryResult<WithPaginationType<Payment>> {
  return useQuery(
    ['evme:payments'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetPayments {
            payments {
              edges {
                node {
                  amount
                  createdAt
                  currency
                  subscriptionId
                }
              }
            }
          }
        `
      )
      return response.payments
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve payments, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useUsers(): UseQueryResult<WithPaginationType<User>> {
  return useQuery(
    ['evme:users'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetUsers {
            users(paging: { first: 200 }) {
              edges {
                node {
                  id
                  email
                  phoneNumber
                  role
                  disabled
                  createdAt
                  updatedAt
                  subscriptions {
                    carId
                  }
                }
              }
            }
          }
        `
      )
      return response.users
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve users, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useSubAdditionalExpenses(): UseQueryResult<WithPaginationType<Sub>> {
  return useQuery(
    ['evme:additional-expenses'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetSubAdditionalExpenses {
            subscriptions {
              edges {
                node {
                  id
                  userId
                  user {
                    phoneNumber
                  }
                  additionalExpenses {
                    id
                    subscriptionId
                    price
                    type
                    noticeDate
                    status
                    note
                    files {
                      id
                      url
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
        console.error(`Unable to retrieve additional expenses, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}
