import { GraphQLClient, gql } from 'graphql-request'
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from 'react-query'
import config from 'config'
import {
  IAddCarToCarModelParam,
  ICreateCarMutationResponse,
  ICreateCarMutationResItem,
} from 'helper/car.helper'
import {
  CarModel,
  PackagePrice,
  Payment,
  Sub,
  User,
  AdditionalExpense,
  AdditionalExpenseInput,
  UpdateOneAdditionalExpenseInput,
  CarInput,
} from './evme.types'

const gqlClient = new GraphQLClient(config.evme)

export interface WithPaginationType<P> {
  edges: {
    node: P
  }[]
}
export function useCreateCar(): UseMutationResult<
  ICreateCarMutationResItem,
  unknown,
  CarInput,
  unknown
> {
  return useMutation(async ({ vin, plateNumber, carModelId }: CarInput) => {
    const response: ICreateCarMutationResponse = await gqlClient.request(
      gql`
        mutation createCar($input: CreateOneCarInput!) {
          createCar(input: $input) {
            vin
            plateNumber
            carModelId
          }
        }
      `,
      {
        input: {
          car: {
            vin,
            plateNumber,
            carModelId,
          },
        },
      }
    )
    return response.createCar
  })
}

export function useAddCarsToCarModel(): UseMutationResult<
  unknown,
  unknown,
  IAddCarToCarModelParam,
  unknown
> {
  return useMutation(async ({ carId, carModelId }: IAddCarToCarModelParam) => {
    const response = await gqlClient.request(
      gql`
        mutation addCarsToCarModel($input: AddCarsToCarModelInput!) {
          addCarsToCarModel(input: $input) {
            id
            brand
            model
          }
        }
      `,
      {
        input: {
          id: carId,
          relationsId: [carModelId],
        },
      }
    )
    return response
  })
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
                  id
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

export function useAdditionalExpenses(): UseQueryResult<WithPaginationType<AdditionalExpense>> {
  return useQuery(
    ['evme:additional-expenses'],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetExpenses {
            additionalExpenses {
              edges {
                node {
                  id
                  createdAt
                  updatedAt
                  subscriptionId
                  status
                  type
                  note
                  price
                  noticeDate
                }
              }
            }
          }
        `
      )
      return response.additionalExpenses
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve additional expenses, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useAdditionalExpenseById(id: string): UseQueryResult<AdditionalExpense> {
  return useQuery(
    ['evme:additional-expense-by-id', id],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetExpenseById($id: ID!) {
            additionalExpense(id: $id) {
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
              createdAt
              updatedAt
            }
          }
        `,
        {
          id,
        }
      )
      return response.additionalExpense
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve additional expense by id: ${id}, ${error.message}`)
      },
    }
  )
}

export function useCreateAdditionalExpense(): UseMutationResult<
  AdditionalExpense,
  unknown,
  AdditionalExpenseInput,
  unknown
> {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ subscriptionId, price, type, status, noticeDate, note }) => {
      const response = await gqlClient.request(
        gql`
          mutation CreateAdditionalExpense($input: CreateOneAdditionalExpenseInput!) {
            createAdditionalExpense(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            additionalExpense: {
              subscriptionId,
              price,
              type,
              status,
              noticeDate,
              note,
            },
          },
        }
      )
      return response.createAdditionalExpense
    },
    {
      onSuccess: () => queryClient.invalidateQueries('evme:additional-expenses'),
      onError: () => {
        console.error('Failed too create an additional expense')
      },
    }
  )
}

export function useUpdateAdditionalExpense(): UseMutationResult<
  AdditionalExpense,
  unknown,
  UpdateOneAdditionalExpenseInput,
  unknown
> {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id, update }) => {
      const response = await gqlClient.request(
        gql`
          mutation UpdateAdditionalExpense($input: UpdateOneAdditionalExpenseInput!) {
            updateAdditionalExpense(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            id,
            update,
          },
        }
      )
      return response.updateAdditionalExpense
    },
    {
      onSuccess: () => queryClient.invalidateQueries('evme:additional-expenses'),
      onError: () => {
        console.error('Failed too update an additional expense')
      },
    }
  )
}
