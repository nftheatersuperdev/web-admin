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
  ChargingLocation,
  CarSort,
  UpdateOneSubInput,
  CarFilter,
  AvailableCarInput,
} from './evme.types'

const QUERY_KEYS = {
  CARS: 'evme:cars',
  CAR_MODELS: 'evme:car-models',
  CAR_MODEL_BY_ID: 'evme:car-model',
  PRICING_BY_MODEL_ID: 'evme:use-pricing-by-id',
  PRICING: 'evme:pricing',
  SUBSCRIPTIONS: 'evme:subscriptions',
  SEARCH_SUBSCRIPTIONS: 'evme:search-subscriptions',
  USERS: 'evme:users',
  PAYMENTS: 'evme:payments',
  ADDITIONAL_EXPENSES: 'evme:additional-expenses',
  ADDITIONAL_EXPENSE_BY_ID: 'evme:additional-expense-by-id',
  CHARGING_LOCATIONS: 'evme:charging-locations',
}

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

    queryClient.invalidateQueries(QUERY_KEYS.CARS)
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
    queryClient.invalidateQueries(QUERY_KEYS.CARS)
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
    queryClient.invalidateQueries(QUERY_KEYS.CARS)
    return response.deleteCar
  })
}

export function useCarModels(): UseQueryResult<WithPaginationType<CarModel>> {
  return useQuery(
    [QUERY_KEYS.CAR_MODELS],
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

/**
 * Query a specific car model by its ID.
 * You can also provide different filters to e.g., only retrieve all cars with a specific color.
 */
export function useCarModelById({
  carModelId,
  carFilter,
  availableFilter,
}: {
  carModelId: string
  carFilter?: CarFilter
  availableFilter?: AvailableCarInput
}): UseQueryResult<CarModel> {
  return useQuery(
    [QUERY_KEYS.CAR_MODEL_BY_ID, carModelId],
    async () => {
      const response = await gqlClient.request(
        gql`
          query CarModel(
            $carModelId: ID!
            $carFilter: CarFilter
            $availableFilter: AvailableCarInput!
          ) {
            carModel(id: $carModelId) {
              cars(filter: $carFilter) {
                id
                vin
                plateNumber
                available(input: $availableFilter)
              }
            }
          }
        `,
        {
          carModelId,
          carFilter,
          availableFilter,
        }
      )
      return response.carModel
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve car model, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useCars(
  pageSize = 10,
  sorting = [] as CarSort[]
): UseInfiniteQueryResult<WithPaginationType<Car>> {
  return useInfiniteQuery(
    [QUERY_KEYS.CARS, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlClient.request(
        gql`
          query GetCars($pageSize: Int!, $after: ConnectionCursor, $sorting: [CarSort!]) {
            cars(paging: { first: $pageSize, after: $after }, sorting: $sorting) {
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
          sorting,
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

export function useSubscriptions(
  pageSize = 10,
  filter?: SubFilter,
  sorting?: SubSort[]
): UseInfiniteQueryResult<WithPaginationType<Sub>> {
  return useInfiniteQuery(
    [QUERY_KEYS.SUBSCRIPTIONS, { pageSize, filter, sorting }],
    async ({ pageParam = '' }) => {
      const response = await gqlClient.request(
        gql`
          query GetSubscriptions(
            $pageSize: Int!
            $after: ConnectionCursor
            $filter: SubFilter
            $sorting: [SubSort!]
          ) {
            subscriptions(
              paging: { first: $pageSize, after: $after }
              filter: $filter
              sorting: $sorting
            ) {
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
                      id
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
                    latitude
                    longitude
                    remark
                  }
                  endAddress {
                    full
                    latitude
                    longitude
                    remark
                  }
                }
              }
            }
          }
        `,
        {
          pageSize,
          after: pageParam,
          filter,
          sorting,
        }
      )
      return response.subscriptions
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        console.error(`Unable to retrieve subscriptions, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

/**
 * Returns the mutation function to update a subscription.
 * For example, this is used in the subscription update details page,
 * where we can update an existing subscription with a new vehicle.
 */
export function useUpdateSubscription(): UseMutationResult<
  Sub,
  unknown,
  UpdateOneSubInput,
  unknown
> {
  const queryClient = useQueryClient()
  return useMutation(async ({ id, update }: UpdateOneSubInput) => {
    const response = await gqlClient.request(
      gql`
        mutation UpdateSubscription($input: UpdateOneCarInput!) {
          updateSubscription(input: $input) {
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
    queryClient.invalidateQueries(QUERY_KEYS.SUBSCRIPTIONS)
    return response.updateSuscription
  })
}

export function useSearchSubscriptions(
  paging?: CursorPaging,
  filter?: SubFilter,
  sorting?: SubSort[]
): UseQueryResult<WithPaginationType<Sub>> {
  return useQuery(
    [QUERY_KEYS.SEARCH_SUBSCRIPTIONS, { paging, filter, sorting }],
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
                    remark
                  }
                  endAddress {
                    full
                    remark
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
    [QUERY_KEYS.PRICING, pageSize],
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
    [QUERY_KEYS.PRICING_BY_MODEL_ID, carModelId],
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
    queryClient.invalidateQueries(QUERY_KEYS.PRICING)
    queryClient.invalidateQueries(QUERY_KEYS.PRICING_BY_MODEL_ID)
    return response.createPackagePrices
  })
}

export function usePayments(): UseQueryResult<WithPaginationType<Payment>> {
  return useQuery(
    [QUERY_KEYS.PAYMENTS],
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
    [QUERY_KEYS.USERS, pageSize],
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
    [QUERY_KEYS.ADDITIONAL_EXPENSES, pageSize],
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
    [QUERY_KEYS.ADDITIONAL_EXPENSE_BY_ID, id],
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
      onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.ADDITIONAL_EXPENSES),
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
      onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.ADDITIONAL_EXPENSES),
      onError: () => {
        console.error('Failed too update an additional expense')
      },
    }
  )
}

export function useChargingLocations(): UseQueryResult<WithPaginationType<ChargingLocation>> {
  return useQuery(
    [QUERY_KEYS.CHARGING_LOCATIONS],
    async () => {
      const response = await gqlClient.request(
        gql`
          query GetChargingLocations {
            chargingLocations(paging: { first: 10000 }) {
              edges {
                node {
                  id
                  name
                  address
                  latitude
                  longitude
                  provider
                }
              }
            }
          }
        `
      )

      return response.chargingLocations
    },
    {
      onError: (error: Error) => {
        console.error(`Unable to retrieve charging locations, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}
