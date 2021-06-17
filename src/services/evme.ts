import { GraphQLClient, gql } from 'graphql-request'
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useQueryClient,
  UseQueryOptions,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from 'react-query'
import config from 'config'
import {
  Car,
  CarModel,
  PackagePrice,
  Payment,
  Sub,
  User,
  AdditionalExpense,
  AdditionalExpenseInput,
  UpdateOneAdditionalExpenseInput,
  CarInput,
  DeleteOneCarInput,
  UpdateOneCarInput,
  PackagePriceInput,
  CursorPaging,
  SubFilter,
  SubSort,
  PackagePriceSort,
} from './evme.types'

const CARS_QUERY_KEY = 'evme:cars'
const CAR_MODELS_QUERY_KEY = 'evme:car-models'
const PRICING_BY_MODEL_ID_KEY = 'evme:use-pricing-by-id'
const PRICING_QUERY_KEY = 'evme:pricing'

const gqlClient = new GraphQLClient(config.evme)

export interface WithPaginationType<P> {
  totalCount?: number
  pageInfo?: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string
    endCursor: string
  }
  edges: {
    node: P
  }[]
}

export function useCreateCar(): UseMutationResult<CarModel, unknown, CarInput, unknown> {
  const queryClient = useQueryClient()

  return useMutation(async ({ vin, plateNumber, carModelId, color }: CarInput) => {
    const response = await gqlClient.request(
      gql`
        mutation CreateCar($input: CreateOneCarInput!) {
          createCar(input: $input) {
            vin
            plateNumber
            carModelId
            color
          }
        }
      `,
      {
        input: {
          car: {
            vin,
            plateNumber,
            carModelId,
            color,
          },
        },
      }
    )

    queryClient.invalidateQueries(CARS_QUERY_KEY)
    return response.createCar
  })
}

export function useUpdateCar(): UseMutationResult<CarModel, unknown, UpdateOneCarInput, unknown> {
  const queryClient = useQueryClient()

  return useMutation(async ({ id, update }: UpdateOneCarInput) => {
    const response = await gqlClient.request(
      gql`
        mutation UpdateCar($input: UpdateOneCarInput!) {
          updateCar(input: $input) {
            vin
            plateNumber
            carModelId
            color
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
    queryClient.invalidateQueries(CARS_QUERY_KEY)
    return response.updateCar
  })
}

export function useDeleteCar(): UseMutationResult<CarModel, unknown, DeleteOneCarInput, unknown> {
  const queryClient = useQueryClient()

  return useMutation(async ({ id }: DeleteOneCarInput) => {
    const response = await gqlClient.request(
      gql`
        mutation DeleteCar($input: DeleteOneCarInput!) {
          deleteCar(input: $input) {
            id
            vin
            plateNumber
            color
          }
        }
      `,
      {
        input: {
          id,
        },
      }
    )
    queryClient.invalidateQueries(CARS_QUERY_KEY)
    return response.deleteCar
  })
}

export function useCarModels(): UseQueryResult<WithPaginationType<CarModel>> {
  return useQuery(
    [CAR_MODELS_QUERY_KEY],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetCarModels {
            carModels {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                  brand
                  model
                  seats
                  acceleration
                  topSpeed
                  range
                  totalPower
                  totalTorque
                  chargeTime
                  fastChargeTime
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
        console.error(`Unable to retrieve car models, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useCars(pageSize = 10): UseInfiniteQueryResult<WithPaginationType<Car>> {
  return useInfiniteQuery(
    [CARS_QUERY_KEY, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlClient.request(
        gql`
          query GetCars($pageSize: Int!, $after: ConnectionCursor) {
            cars(paging: { first: $pageSize, after: $after }) {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                  vin
                  plateNumber
                  color
                  createdAt
                  updatedAt
                  carModelId
                  carModel {
                    brand
                    model
                    acceleration
                    topSpeed
                    range
                    totalPower
                    totalTorque
                    connectorType {
                      description
                    }
                    chargeTime
                    fastChargeTime
                    bodyType {
                      bodyType
                    }
                  }
                }
              }
            }
          }
        `,
        {
          pageSize,
          after: pageParam,
        }
      )

      return response.cars
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
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
              totalCount
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
                    firstName
                    lastName
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

export function useSearchSubscriptions(
  queryKey?: string,
  paging?: CursorPaging,
  filter?: SubFilter,
  sorting?: SubSort[]
): UseQueryResult<WithPaginationType<Sub>> {
  return useQuery(
    ['evme:search-subscriptions', queryKey],
    async () => {
      const response = await gqlClient.request(
        gql`
          query SearchSubscriptions(
            $paging: CursorPaging
            $filter: SubFilter
            $sorting: [SubSort!]
          ) {
            subscriptions(paging: $paging, filter: $filter, sorting: $sorting) {
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
                    firstName
                    lastName
                    phoneNumber
                    email
                  }
                  car {
                    vin
                    plateNumber
                    color
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
                  startAddress {
                    full
                  }
                  endAddress {
                    full
                  }
                }
              }
            }
          }
        `,
        {
          paging,
          filter,
          sorting,
        }
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

export function usePricing(
  pageSize = 10,
  sorting: PackagePriceSort[]
): UseInfiniteQueryResult<WithPaginationType<PackagePrice>> {
  return useInfiniteQuery(
    [PRICING_QUERY_KEY, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlClient.request(
        gql`
          query GetPricing(
            $pageSize: Int!
            $after: ConnectionCursor
            $sorting: [PackagePriceSort!]
          ) {
            packagePrices(paging: { first: $pageSize, after: $after }, sorting: $sorting) {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
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
                    id
                  }
                }
              }
            }
          }
        `,
        {
          pageSize,
          after: pageParam,
          sorting,
        }
      )
      return response.packagePrices
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        console.error(`Unable to retrieve pricing, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function usePricingById({
  carModelId,
  isDisabled = false,
}: {
  carModelId: string | undefined
  isDisabled?: boolean
}): UseQueryResult<WithPaginationType<PackagePrice>> {
  return useQuery(
    [PRICING_BY_MODEL_ID_KEY, carModelId],
    async () => {
      const response = await gqlClient.request(
        gql`
          query PackagePrices {
            packagePrices(filter: {carModelId: {eq: "${carModelId}"}, disabled: {is: ${isDisabled}}}) {
              edges {
                node {
                  id
                  carModelId
                  carModel {
                      id
                      brand
                      model
                  }
                  duration
                  price
                  createdAt
                  updatedAt
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
      enabled: !!carModelId,
    }
  )
}

export function useCreatePrices(): UseMutationResult<
  CarModel,
  unknown,
  PackagePriceInput[],
  unknown
> {
  const queryClient = useQueryClient()

  return useMutation(async (packagePrices: PackagePriceInput[]) => {
    const response = await gqlClient.request(
      gql`
        mutation CreatePackagePrices($input: CreateManyPackagePricesInput!) {
          createPackagePrices(input: $input) {
            id
            carModelId
            duration
            price
          }
        }
      `,
      {
        input: {
          packagePrices,
        },
      }
    )
    queryClient.invalidateQueries(PRICING_QUERY_KEY)
    queryClient.invalidateQueries(PRICING_BY_MODEL_ID_KEY)
    return response.createPackagePrices
  })
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

export function useUsers(pageSize = 10): UseInfiniteQueryResult<WithPaginationType<User>> {
  return useInfiniteQuery(
    ['evme:users', pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlClient.request(
        gql`
          query GetUsers($pageSize: Int!, $after: ConnectionCursor) {
            users(paging: { first: $pageSize, after: $after }) {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
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
        `,
        {
          pageSize,
          after: pageParam,
        }
      )

      return response.users
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        console.error(`Unable to retrieve users, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useAdditionalExpenses(
  pageSize = 10
): UseInfiniteQueryResult<WithPaginationType<AdditionalExpense>> {
  return useInfiniteQuery(
    ['evme:additional-expenses', pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlClient.request(
        gql`
          query GetAdditionalExpenses($pageSize: Int!, $after: ConnectionCursor) {
            additionalExpenses(paging: { first: $pageSize, after: $after }) {
              totalCount
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
              edges {
                node {
                  id
                  subscriptionId
                  subscription {
                    userId
                    user {
                      firstName
                      lastName
                    }
                  }
                  status
                  type
                  note
                  price
                  noticeDate
                  createdAt
                  updatedAt
                }
              }
            }
          }
        `,
        {
          pageSize,
          after: pageParam,
        }
      )

      return response.additionalExpenses
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        console.error(`Unable to retrieve additional expenses, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useAdditionalExpenseById(
  id: string,
  options?: UseQueryOptions<unknown, unknown, AdditionalExpense>
): UseQueryResult<AdditionalExpense> {
  return useQuery(
    ['evme:additional-expense-by-id', id],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetExpenseById($id: ID!) {
            additionalExpense(id: $id) {
              id
              subscriptionId
              subscription {
                userId
                user {
                  firstName
                  lastName
                }
                car {
                  vin
                  plateNumber
                }
              }
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
    options
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
