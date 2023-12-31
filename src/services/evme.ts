import { gql } from 'graphql-request'
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
import { useGraphQLRequest } from 'hooks/GraphQLRequestContext'
import {
  Car,
  CarModel,
  PackagePrice,
  Payment,
  Sub,
  User,
  Voucher,
  VoucherInput,
  VoucherFilter,
  VoucherEvents,
  VoucherEventsInput,
  AdditionalExpense,
  AdditionalExpenseInput,
  UpdateOneAdditionalExpenseInput,
  CarInput,
  DeleteOneCarInput,
  UpdateOneCarInput,
  UpdateOneCarStatusInput,
  PackagePriceInput,
  CursorPaging,
  SubFilter,
  SubSort,
  SubOrder,
  PackagePriceSort,
  ChargingLocation,
  CarSort,
  UserFilter,
  UserWhitelistFilter,
  UserWhitelist,
  UserWhitelistInput,
  UserWhitelistRemoveInput,
  UserSort,
  UpdateOneSubInput,
  CarFilter,
  AvailableCarInput,
  UserAggregateFilter,
  UserAggregateResponse,
  PackagePriceFilter,
  AdditionalExpenseFilter,
  AdditionalExpenseSort,
  SubscriptionUpdatePlateInput,
  ManualExtendSubscriptionInput,
  SendDataViaEmailInput,
  RefIdAndRelationIds,
  RefIdAndStrings,
  UserGroupFilter,
  UserGroup,
  UserGroupInput,
  UserGroupDeleteInput,
  PaymentFilter,
  CarModelFilter,
  CarModelSort,
  CarModelInput,
  CarBodyType,
  CarConnectorType,
} from './evme.types'

const QUERY_KEYS = {
  CARS: 'evme:cars',
  CAR_MODELS: 'evme:car-models',
  CAR_MODEL_BY_ID: 'evme:car-model',
  PRICING_BY_CAR_MODEL_ID: 'evme:use-pricing-by-car-model-id',
  PRICING: 'evme:pricing',
  SUBSCRIPTIONS: 'evme:subscriptions',
  SEARCH_SUBSCRIPTIONS: 'evme:search-subscriptions',
  USERS: 'evme:users',
  USER_GROUPS: 'evme:user-groups',
  USER_GROUP: 'evme:user-group',
  USER_GROUP_USERS: 'evme:user-groups:users',
  USER_GROUP_WHITELIST_USERS: 'evme:user-groups:whitelist-users',
  USER_GROUP_AVAILABLE_USERS: 'evme:user-groups:users:available',
  USER_GROUP_AVAILABLE_WHITELIST_USERS: 'evme:user-groups:whitelist-users:available',
  VOUCHERS: 'evme:vouchers',
  VOUCHER_EVENTS: 'evme:voucher-events',
  VOUCHER_EVENTS_BY_VOUCHER_ID: 'evme:voucher-event:voucher-id',
  VOUCHER_BY_ID: 'evme:voucher-by-id',
  VOUCHERS_PACKAGE_PRICE: 'evme:vouchers-package-price',
  USER_AGGREGATE: 'evme:user-aggregate',
  PAYMENTS: 'evme:payments',
  ADDITIONAL_EXPENSES: 'evme:additional-expenses',
  ADDITIONAL_EXPENSE_BY_ID: 'evme:additional-expense-by-id',
  CHARGING_LOCATIONS: 'evme:charging-locations',
  ME: 'evme:me',
  CAR_BODY_TYPES: 'evme:car-body-types',
  CONNECTOR_TYPES: 'evme:connection-types',
}

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

export interface WithPaginateType<P> {
  paginate?: {
    totalPages: number
    nextPage: number | null
    previousPage: number | null
  }
  totalData?: number
  data: [P]
}

const handleErrorActions = (error: unknown): boolean => {
  if (error instanceof Error) {
    const result = error.message.search(/invalidated|revoked/)
    if (result >= 0) {
      window.location.replace('/logout')
      return false
    }
  }
  return true
}

export function useCreateCar(): UseMutationResult<CarModel, unknown, CarInput, unknown> {
  const queryClient = useQueryClient()
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(async ({ vin, plateNumber, carModelId, color }: CarInput) => {
    const response = await gqlRequest(
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
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(async ({ id, update }: UpdateOneCarInput) => {
    const response = await gqlRequest(
      gql`
        mutation UpdateCar($input: UpdateOneCarInput!) {
          updateCar(input: $input) {
            carModelId
            color
            colorHex
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

export function useUpdateCarStatus(): UseMutationResult<
  CarModel,
  unknown,
  UpdateOneCarStatusInput,
  unknown
> {
  const queryClient = useQueryClient()
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(async ({ carId, status }: UpdateOneCarStatusInput) => {
    const response = await gqlRequest(
      gql`
        mutation CreateCarStatus($carId: String!, $status: String!) {
          createCarStatus(input: { carStatus: { carId: $carId, status: $status } }) {
            car {
              id
            }
          }
        }
      `,
      {
        carId,
        status,
      }
    )
    queryClient.invalidateQueries(QUERY_KEYS.CARS)
    return response.updateCar
  })
}

export function useDeleteCar(): UseMutationResult<CarModel, unknown, DeleteOneCarInput, unknown> {
  const queryClient = useQueryClient()
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(async ({ id }: DeleteOneCarInput) => {
    const response = await gqlRequest(
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

export function useUpdateCarModel(): UseMutationResult<CarModel, unknown, CarModelInput, unknown> {
  const queryClient = useQueryClient()
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({
      id,
      brand,
      model,
      seats,
      condition,
      acceleration,
      topSpeed,
      range,
      totalPower,
      horsePower,
      batteryCapacity,
      connectorTypeId,
      modelYear,
      chargeTime,
      fastChargeTime,
      bodyTypeId,
    }) => {
      const { updateCarModel } = await gqlRequest(
        gql`
          mutation UpdateCarModel($input: UpdateOneCarModelInput!) {
            updateCarModel(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            id,
            update: {
              brand,
              model,
              seats,
              condition,
              acceleration,
              topSpeed,
              range,
              totalPower,
              horsePower,
              batteryCapacity,
              connectorTypeId,
              chargeTime,
              fastChargeTime,
              bodyTypeId,
              modelYear,
            },
          },
        }
      )
      return updateCarModel
    },
    {
      onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.CAR_MODELS),
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error('Failed to updateCarModel')
      },
    }
  )
}

export function useCarModels(
  pageSize = 10,
  filter?: CarModelFilter,
  sorting?: CarModelSort[]
): UseInfiniteQueryResult<WithPaginationType<CarModel>> {
  const { gqlRequest } = useGraphQLRequest()
  return useInfiniteQuery(
    [QUERY_KEYS.CAR_MODELS, { filter, sorting, pageSize }],
    async ({ pageParam = '' }) => {
      const response = await gqlRequest(
        gql`
          query GetCarModels(
            $pageSize: Int!
            $after: ConnectionCursor
            $filter: CarModelFilter
            $sorting: [CarModelSort!]
          ) {
            carModels(
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
        `,
        {
          pageSize,
          after: pageParam,
          filter,
          sorting,
        }
      )
      return response.carModels
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        handleErrorActions(error)
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
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.CAR_MODEL_BY_ID, carModelId],
    async () => {
      const response = await gqlRequest(
        gql`
          query CarModel(
            $carModelId: ID!
            $carFilter: CarFilter
            $availableFilter: AvailableCarInput!
          ) {
            carModel(id: $carModelId) {
              id
              brand
              model
              seats
              condition
              acceleration
              topSpeed
              range
              totalPower
              horsePower
              batteryCapacity
              connectorTypeId
              chargeTime
              fastChargeTime
              bodyTypeId
              modelYear
              bodyType {
                id
                bodyType
              }
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
        handleErrorActions(error)
        console.error(`Unable to retrieve car model, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useCars(
  pageSize = 10,
  filter?: CarFilter,
  sorting?: CarSort[]
): UseInfiniteQueryResult<WithPaginationType<Car>> {
  const { gqlRequest } = useGraphQLRequest()

  return useInfiniteQuery(
    [QUERY_KEYS.CARS, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlRequest(
        gql`
          query GetCars(
            $pageSize: Int!
            $after: ConnectionCursor
            $filter: CarFilter
            $sorting: [CarSort!]
          ) {
            cars(paging: { first: $pageSize, after: $after }, filter: $filter, sorting: $sorting) {
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
                    batteryCapacity
                  }
                  latestStatus
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

      return response.cars
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve cars, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useCarsFilterAndSort(
  filter?: CarFilter,
  order?: SubOrder,
  page = 0,
  pageSize = 10
): UseQueryResult<WithPaginateType<Car>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.CARS, { filter, order, page, pageSize }],
    async () => {
      const { carsFilterAndSort } = await gqlRequest(
        gql`
          query CarsFilterAndSort(
            $filter: CarFilterInput
            $order: CarOrderInput
            $pageSize: Float!
            $page: Float!
          ) {
            carsFilterAndSort(filter: $filter, order: $order, pageSize: $pageSize, page: $page) {
              paginate {
                totalPages
                nextPage
                previousPage
              }
              totalData
              data {
                id
                vin
                plateNumber
                color
                colorHex
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
                  batteryCapacity
                }
                latestStatus
              }
            }
          }
        `,
        { filter, order, pageSize, page }
      )
      return carsFilterAndSort
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve carsFilterAndSort, ${error.message}`)
      },
    }
  )
}

export function useSubscriptions(
  pageSize = 10,
  filter?: SubFilter,
  sorting?: SubSort[]
): UseInfiniteQueryResult<WithPaginationType<Sub>> {
  const { gqlRequest } = useGraphQLRequest()

  return useInfiniteQuery(
    [QUERY_KEYS.SUBSCRIPTIONS, { pageSize, filter, sorting }],
    async ({ pageParam = '' }) => {
      const response = await gqlRequest(
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
                  events {
                    id
                    status
                    createdAt
                    updatedAt
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
        handleErrorActions(error)
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
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(async ({ id, update }: UpdateOneSubInput) => {
    const response = await gqlRequest(
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
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.SEARCH_SUBSCRIPTIONS, { paging, filter, sorting }],
    async () => {
      const response = await gqlRequest(
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
        handleErrorActions(error)
        console.error(`Unable to retrieve subscriptions, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useSubscriptionsFilterAndSort(
  filter?: SubFilter,
  order?: SubOrder,
  page = 0,
  pageSize = 10
): UseQueryResult<WithPaginateType<Sub>> {
  const { gqlRequest } = useGraphQLRequest()
  return useQuery(
    [QUERY_KEYS.SEARCH_SUBSCRIPTIONS, { filter, order, page, pageSize }],
    async () => {
      const { subscriptionsFilterAndSort } = await gqlRequest(
        gql`
          query SubscriptionsFilterAndSort(
            $filter: SubFilterInput
            $order: SubOrderInput
            $pageSize: Float!
            $page: Float!
          ) {
            subscriptionsFilterAndSort(
              filter: $filter
              order: $order
              pageSize: $pageSize
              page: $page
            ) {
              paginate {
                totalPages
                nextPage
                previousPage
              }
              totalData
              data {
                id
                chargedPrice
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
                events {
                  id
                  status
                  createdAt
                  updatedAt
                }
                voucher {
                  code
                }
                payments {
                  updatedAt
                  events {
                    status
                    omiseFailureMessage
                    updatedAt
                  }
                }
                paymentVersion
              }
            }
          }
        `,
        { filter, order, pageSize, page }
      )
      return subscriptionsFilterAndSort
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve subscriptionsFilterAndSort, ${error.message}`)
      },
    }
  )
}

export function usePricing(
  pageSize = 10,
  filter: PackagePriceFilter = {},
  sorting: PackagePriceSort[] = []
): UseInfiniteQueryResult<WithPaginationType<PackagePrice>> {
  const { gqlRequest } = useGraphQLRequest()

  return useInfiniteQuery(
    [QUERY_KEYS.PRICING, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlRequest(
        gql`
          query GetPricing(
            $pageSize: Int!
            $after: ConnectionCursor
            $filter: PackagePriceFilter
            $sorting: [PackagePriceSort!]
          ) {
            packagePrices(
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
                  createdAt
                  updatedAt
                  duration
                  price
                  description
                  fullPrice
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
          filter,
          sorting,
        }
      )
      return response.packagePrices
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve pricing, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function usePricingByCarModelId({
  carModelId,
  isDisabled = false,
}: {
  carModelId: string | undefined
  isDisabled?: boolean
}): UseQueryResult<WithPaginationType<PackagePrice>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.PRICING_BY_CAR_MODEL_ID, carModelId],
    async () => {
      const response = await gqlRequest(
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
                  fullPrice
                  description
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
        handleErrorActions(error)
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
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(async (packagePrices: PackagePriceInput[]) => {
    const response = await gqlRequest(
      gql`
        mutation CreatePackagePrices($input: CreateManyPackagePricesInput!) {
          createPackagePrices(input: $input) {
            id
            carModelId
            duration
            price
            fullPrice
            description
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
    queryClient.invalidateQueries(QUERY_KEYS.PRICING_BY_CAR_MODEL_ID)
    return response.createPackagePrices
  })
}

export function usePayments(
  pageSize = 10,
  filter?: PaymentFilter
): UseQueryResult<WithPaginationType<Payment>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.PAYMENTS],
    async () => {
      const response = await gqlRequest(
        gql`
          query GetPayments($pageSize: Int!, $filter: PaymentFilter) {
            payments(paging: { first: $pageSize }, filter: $filter) {
              edges {
                node {
                  amount
                  createdAt
                  currency
                  subscriptionId
                  events {
                    status
                  }
                }
              }
            }
          }
        `,
        {
          pageSize,
          filter,
        }
      )
      return response.payments
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve payments, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useUsers(
  pageSize = 10,
  filter?: UserFilter,
  sorting?: UserSort[]
): UseInfiniteQueryResult<WithPaginationType<User>> {
  const { gqlRequest } = useGraphQLRequest()

  return useInfiniteQuery(
    [QUERY_KEYS.USERS, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlRequest(
        gql`
          query GetUsers(
            $pageSize: Int!
            $after: ConnectionCursor
            $filter: UserFilter
            $sorting: [UserSort!]
          ) {
            users(paging: { first: $pageSize, after: $after }, filter: $filter, sorting: $sorting) {
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
                  firstName
                  lastName
                  email
                  phoneNumber
                  role
                  disabled
                  createdAt
                  updatedAt
                  subscriptions {
                    carId
                  }
                  kycStatus
                  kycRejectReason
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
      return response.users
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve users, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useUsersFilterAndSort(
  filter?: UserFilter,
  order?: SubOrder,
  page = 0,
  pageSize = 10
): UseQueryResult<WithPaginateType<User>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USERS, { filter, order, page, pageSize }],
    async () => {
      const { usersFilterAndSort } = await gqlRequest(
        gql`
          query UsersFilterAndSort(
            $filter: UserFilterInput
            $order: UserOrderInput
            $pageSize: Float!
            $page: Float!
          ) {
            usersFilterAndSort(filter: $filter, order: $order, pageSize: $pageSize, page: $page) {
              paginate {
                totalPages
                nextPage
                previousPage
              }
              totalData
              data {
                id
                firstName
                lastName
                email
                phoneNumber
                role
                disabled
                createdAt
                updatedAt
                subscriptions {
                  carId
                }
                kycStatus
                kycRejectReason
                userGroups {
                  name
                }
              }
            }
          }
        `,
        { filter, order, pageSize, page }
      )
      return usersFilterAndSort
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve usersFilterAndSort, ${error.message}`)
      },
    }
  )
}

export function useVouchersFilterAndSort(
  filter?: VoucherFilter,
  order?: SubOrder,
  page = 0,
  pageSize = 10
): UseQueryResult<WithPaginateType<Voucher>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.VOUCHERS, { filter, order, page, pageSize }],
    async () => {
      const { vouchersFilterAndSort } = await gqlRequest(
        gql`
          query VouchersFilterAndSort(
            $filter: VoucherFilterInput
            $order: VoucherOrderInput
            $pageSize: Float!
            $page: Float!
          ) {
            vouchersFilterAndSort(
              filter: $filter
              order: $order
              pageSize: $pageSize
              page: $page
            ) {
              paginate {
                totalPages
                nextPage
                previousPage
              }
              totalData
              data {
                id
                code
                percentDiscount
                amount
                startAt
                endAt
                descriptionEn
                descriptionTh
                createdAt
                updatedAt
                limitPerUser
                isAllPackages
                userGroups {
                  name
                }
                packagePrices {
                  id
                  carModelId
                  carModel {
                    id
                    brand
                    model
                  }
                  duration
                  price
                  fullPrice
                }
              }
            }
          }
        `,
        { filter, order, pageSize, page }
      )
      return vouchersFilterAndSort
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve vouchersFilterAndSort, ${error.message}`)
      },
    }
  )
}

export function useVouchersSearchPackagePrices(keyword = ''): UseQueryResult<PackagePrice[]> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.VOUCHERS_PACKAGE_PRICE, { keyword }],
    async () => {
      const { vouchersSearchPackagePrices } = await gqlRequest(
        gql`
          query VouchersSearchPackagePrices($keyword: String!) {
            vouchersSearchPackagePrices(keyword: $keyword) {
              id
              carModelId
              carModel {
                id
                brand
                model
              }
              duration
              price
              fullPrice
            }
          }
        `,
        { keyword }
      )
      return vouchersSearchPackagePrices
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve vouchersSearchPackagePrices, ${error.message}`)
      },
    }
  )
}

export function useVoucherById(id = ''): UseQueryResult<Voucher> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.VOUCHER_BY_ID, { id }],
    async () => {
      const { voucher } = await gqlRequest(
        gql`
          query Voucher($id: ID!) {
            voucher(id: $id) {
              id
              code
              percentDiscount
              amount
              startAt
              endAt
              descriptionEn
              descriptionTh
              createdAt
              updatedAt
              limitPerUser
              isAllPackages
              userGroups {
                id
                name
                createdAt
                updatedAt
              }
              packagePrices {
                id
                carModelId
                carModel {
                  id
                  brand
                  model
                }
                duration
                price
                fullPrice
              }
            }
          }
        `,
        { id }
      )
      return voucher
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve voucher, ${error.message}`)
      },
    }
  )
}

export function useCreateVoucher(): UseMutationResult<Voucher, unknown, VoucherInput, unknown> {
  const queryClient = useQueryClient()
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({
      code,
      descriptionEn,
      descriptionTh,
      percentDiscount,
      amount,
      limitPerUser,
      startAt,
      endAt,
    }) => {
      const { createVoucher } = await gqlRequest(
        gql`
          mutation CreateVoucher($input: VoucherInput!) {
            createVoucher(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            code,
            descriptionEn,
            descriptionTh,
            percentDiscount,
            amount,
            limitPerUser,
            startAt,
            endAt,
          },
        }
      )
      return createVoucher
    },
    {
      onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.VOUCHERS),
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error('Failed to createVoucher')
      },
    }
  )
}

export function useUpdateVoucher(): UseMutationResult<Voucher, unknown, VoucherInput, unknown> {
  const queryClient = useQueryClient()
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({
      id,
      code,
      descriptionEn,
      descriptionTh,
      percentDiscount,
      amount,
      limitPerUser,
      isAllPackages,
      startAt,
      endAt,
    }) => {
      const { updateVoucher } = await gqlRequest(
        gql`
          mutation UpdateVoucher($input: UpdateOneVoucherInput!) {
            updateVoucher(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            id,
            update: {
              code,
              descriptionEn,
              descriptionTh,
              percentDiscount,
              amount,
              limitPerUser,
              isAllPackages,
              startAt,
              endAt,
            },
          },
        }
      )
      return updateVoucher
    },
    {
      onSuccess: () => queryClient.invalidateQueries(QUERY_KEYS.VOUCHERS),
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error('Failed to updateVoucher')
      },
    }
  )
}

export function useDeleteVoucher(): UseMutationResult<Voucher, unknown, VoucherInput, unknown> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id }) => {
      const { deleteVoucher } = await gqlRequest(
        gql`
          mutation DeleteVoucher($input: DeleteOneVoucherInput!) {
            deleteVoucher(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            id,
          },
        }
      )
      return deleteVoucher
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error('Failed to useDeleteVoucher')
      },
    }
  )
}

export function useUserAggregate(
  filter: UserAggregateFilter
): UseQueryResult<UserAggregateResponse[]> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery([QUERY_KEYS.USER_AGGREGATE, filter], async () => {
    const response = await gqlRequest(
      gql`
        query GetUserAggregate($filter: UserAggregateFilter) {
          userAggregate(filter: $filter) {
            count {
              id
            }
          }
        }
      `,
      {
        filter,
      }
    )
    return response.userAggregate
  })
}

export function useAdditionalExpenses(
  pageSize = 10,
  filter?: AdditionalExpenseFilter,
  sorting?: AdditionalExpenseSort[]
): UseInfiniteQueryResult<WithPaginationType<AdditionalExpense>> {
  const { gqlRequest } = useGraphQLRequest()

  return useInfiniteQuery(
    [QUERY_KEYS.ADDITIONAL_EXPENSES, pageSize],
    async ({ pageParam = '' }) => {
      const response = await gqlRequest(
        gql`
          query GetAdditionalExpenses(
            $pageSize: Int!
            $after: ConnectionCursor
            $filter: AdditionalExpenseFilter
            $sorting: [AdditionalExpenseSort!]
          ) {
            additionalExpenses(
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
          filter,
          sorting,
        }
      )

      return response.additionalExpenses
    },
    {
      getNextPageParam: (lastPage, _pages) => lastPage.pageInfo.endCursor,
      onError: (error: Error) => {
        handleErrorActions(error)
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
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.ADDITIONAL_EXPENSE_BY_ID, id],
    async () => {
      const response = await gqlRequest(
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
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ subscriptionId, price, type, status, noticeDate, note }) => {
      const response = await gqlRequest(
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
      onError: (error: Error) => {
        handleErrorActions(error)
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
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, update }) => {
      const response = await gqlRequest(
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
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error('Failed too update an additional expense')
      },
    }
  )
}

export function useChargingLocations(): UseQueryResult<WithPaginationType<ChargingLocation>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.CHARGING_LOCATIONS],
    async () => {
      const response = await gqlRequest(
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
        handleErrorActions(error)
        console.error(`Unable to retrieve charging locations, ${error.message}`)
      },
      keepPreviousData: true,
    }
  )
}

export function useMe(): UseQueryResult<User> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.ME],
    async () => {
      const response = await gqlRequest(
        gql`
          query GetMe {
            me {
              id
              firebaseId
              firstName
              lastName
              role
              disabled
              phoneNumber
              email
            }
          }
        `
      )

      return response.me
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve profile data, ${error.message}`)
      },
    }
  )
}

export function useManualExtendSubscription(): UseMutationResult<
  unknown,
  unknown,
  ManualExtendSubscriptionInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ subscriptionId, returnDate }: ManualExtendSubscriptionInput) => {
      const response = await gqlRequest(
        gql`
          mutation ManualExtendSubscription($input: ManaulExtendSubscriptionInput!) {
            manualExtendSubscription(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            subscriptionId,
            returnDate,
          },
        }
      )
      return response.manualExtendSubscription
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to manual extend scription, ${error.message}`)
      },
    }
  )
}

export function useChangeCar(): UseMutationResult<
  unknown,
  unknown,
  SubscriptionUpdatePlateInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ carId, subscriptionId }: SubscriptionUpdatePlateInput) => {
      const response = await gqlRequest(
        gql`
          mutation ChangeCar($input: SubscriptionUpdatePlateInput!) {
            changeCar(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            carId,
            subscriptionId,
          },
        }
      )
      return response.changeCar
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to change car, ${error.message}`)
      },
    }
  )
}

export function useSendDataViaEmail(): UseMutationResult<
  unknown,
  unknown,
  SendDataViaEmailInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ emails, columns }: SendDataViaEmailInput) => {
      const { sendDataViaEmail } = await gqlRequest(
        gql`
          mutation SendDataViaEmail($emails: [String!]!, $columns: [String!]!) {
            sendDataViaEmail(emails: $emails, columns: $columns)
          }
        `,
        {
          emails,
          columns,
        }
      )
      return sendDataViaEmail
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error('Failed to request send all data via email')
      },
    }
  )
}

export function useAddPackagePricesToVoucher(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { data } = await gqlRequest(
        gql`
          mutation AddPackagePricesToVoucher($id: ID!, $relationIds: [ID!]!) {
            addPackagePricesToVoucher(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return data
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useAddPackagePricesToVoucher ${error.message}`)
      },
    }
  )
}

export function useRemovePackagePricesFromVoucher(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { data } = await gqlRequest(
        gql`
          mutation RemovePackagePricesFromVoucher($id: ID!, $relationIds: [ID!]!) {
            removePackagePricesFromVoucher(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return data
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useRemovePackagePricesFromVoucher ${error.message}`)
      },
    }
  )
}

export function useUserGroupsFilterAndSort(
  filter?: UserGroupFilter,
  order?: SubOrder,
  page = 0,
  pageSize = 10
): UseQueryResult<WithPaginateType<UserGroup>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USER_GROUPS, { filter, order, page, pageSize }],
    async () => {
      const { userGroupsFilterAndSort } = await gqlRequest(
        gql`
          query UserGroupsFilterAndSort(
            $filter: UserGroupFilterInput
            $order: UserGroupOrderInput
            $pageSize: Float!
            $page: Float!
          ) {
            userGroupsFilterAndSort(
              filter: $filter
              order: $order
              pageSize: $pageSize
              page: $page
            ) {
              paginate {
                totalPages
                nextPage
                previousPage
              }
              totalData
              data {
                id
                name
                createdAt
                updatedAt
              }
            }
          }
        `,
        { filter, order, pageSize, page }
      )
      return userGroupsFilterAndSort
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve userGroupsFilterAndSort, ${error.message}`)
      },
    }
  )
}

export function useChangeUserGroup(): UseMutationResult<unknown, unknown, UserGroupInput, unknown> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, name }: UserGroupInput) => {
      const { updateOneUserGroup } = await gqlRequest(
        gql`
          mutation UpdateOneUserGroup($input: UpdateOneUserGroupInput!) {
            updateOneUserGroup(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            id,
            update: {
              name,
            },
          },
        }
      )
      return updateOneUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to mutation useChangeUserGroup, ${error.message}`)
      },
    }
  )
}

export function useCreateUserGroup(): UseMutationResult<unknown, unknown, UserGroupInput, unknown> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ name }: UserGroupInput) => {
      const { createOneUserGroup } = await gqlRequest(
        gql`
          mutation CreateOneUserGroup($input: CreateOneUserGroupInput!) {
            createOneUserGroup(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            userGroup: {
              name,
            },
          },
        }
      )
      return createOneUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to mutation useCreateUserGroup, ${error.message}`)
      },
    }
  )
}
export function useDeleteUserGroup(): UseMutationResult<
  unknown,
  unknown,
  UserGroupDeleteInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id }: UserGroupDeleteInput) => {
      const { deleteUserGroup } = await gqlRequest(
        gql`
          mutation DeleteUserGroup($input: DeleteOneUserGroupInput!) {
            deleteUserGroup(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            id,
          },
        }
      )
      return deleteUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to mutation useDeleteUserGroup, ${error.message}`)
      },
    }
  )
}

export function useUserGroupUsers(
  userGroupId = '',
  page = 0,
  pageSize = 10,
  filter?: UserFilter
): UseQueryResult<WithPaginateType<User>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USER_GROUP_USERS, { userGroupId, page, pageSize }],
    async () => {
      const { userGroupUsers } = await gqlRequest(
        gql`
          query UserGroupUsers(
            $userGroupId: String!
            $pageSize: Float!
            $page: Float!
            $filter: UserFilterInput
          ) {
            userGroupUsers(
              userGroupId: $userGroupId
              page: $page
              pageSize: $pageSize
              filter: $filter
            ) {
              data {
                id
                firstName
                lastName
                email
                phoneNumber
              }
              totalData
              paginate {
                nextPage
                previousPage
                totalPages
              }
            }
          }
        `,
        { userGroupId, pageSize, page, filter }
      )
      return userGroupUsers
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve userGroupUsers, ${error.message}`)
      },
    }
  )
}

export function useUserGroupUsersWhitelist(
  userGroupId = '',
  page = 0,
  pageSize = 10,
  filter?: UserWhitelistFilter
): UseQueryResult<WithPaginateType<UserWhitelist>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USER_GROUP_WHITELIST_USERS, { userGroupId, page, pageSize }],
    async () => {
      const { userGroupUsersWhitelist } = await gqlRequest(
        gql`
          query UserGroupUsersWhitelist(
            $userGroupId: String!
            $pageSize: Float!
            $page: Float!
            $filter: UserWhitelistFilterInput
          ) {
            userGroupUsersWhitelist(
              userGroupId: $userGroupId
              page: $page
              pageSize: $pageSize
              filter: $filter
            ) {
              data {
                id
                value
                type
              }
              totalData
              paginate {
                nextPage
                previousPage
                totalPages
              }
            }
          }
        `,
        { userGroupId, pageSize, page, filter }
      )
      return userGroupUsersWhitelist
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve userGroupUsersWhitelist, ${error.message}`)
      },
    }
  )
}

export function useUserGroup(id = ''): UseQueryResult<UserGroup> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USER_GROUP, { id }],
    async () => {
      const { userGroup } = await gqlRequest(
        gql`
          query UserGroup($id: ID!) {
            userGroup(id: $id) {
              id
              name
            }
          }
        `,
        { id }
      )
      return userGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useUserGroup, ${error.message}`)
      },
    }
  )
}

export function useFindUsersByNotInUserGroupAndKeyword(
  userGroupId: string,
  keyword: string
): UseQueryResult<User[]> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USER_GROUP_AVAILABLE_USERS, { userGroupId }],
    async () => {
      const { findUsersByNotInUserGroupAndKeyword } = await gqlRequest(
        gql`
          query FindUsersByNotInUserGroupAndKeyword($userGroupId: String!, $keyword: String!) {
            findUsersByNotInUserGroupAndKeyword(userGroupId: $userGroupId, keyword: $keyword) {
              id
              firstName
              lastName
              email
              phoneNumber
            }
          }
        `,
        { userGroupId, keyword }
      )
      return findUsersByNotInUserGroupAndKeyword
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useFindUsersByNotInUserGroupAndKeyword, ${error.message}`)
      },
    }
  )
}

export function useAddUsersToUserGroup(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { addUsersToUserGroup } = await gqlRequest(
        gql`
          mutation AddUsersToUserGroup($id: ID!, $relationIds: [ID!]!) {
            addUsersToUserGroup(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return addUsersToUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useAddUsersToUserGroup ${error.message}`)
      },
    }
  )
}

export function useRemoveUserGroupsFromUser(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { removeUserGroupsFromUser } = await gqlRequest(
        gql`
          mutation RemoveUserGroupsFromUser($id: ID!, $relationIds: [ID!]!) {
            removeUserGroupsFromUser(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return removeUserGroupsFromUser
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useRemoveUserGroupsFromUser ${error.message}`)
      },
    }
  )
}

export function useAddEmailsToUserGroup(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndStrings,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, values }: RefIdAndStrings) => {
      const { addEmailsToUserGroup } = await gqlRequest(
        gql`
          mutation AddEmailsToUserGroup($id: String!, $values: [String!]!) {
            addEmailsToUserGroup(userGroupId: $id, emails: $values)
          }
        `,
        {
          id,
          values,
        }
      )
      return addEmailsToUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useAddUsersToUserGroup ${error.message}`)
      },
    }
  )
}

export function useVoucherEventsByVoucherId(
  voucherId: string,
  pageSize = 10
): UseInfiniteQueryResult<WithPaginationType<VoucherEvents>> {
  const { gqlRequest } = useGraphQLRequest()

  return useInfiniteQuery(
    [QUERY_KEYS.VOUCHER_EVENTS_BY_VOUCHER_ID, { voucherId }],
    async ({ pageParam = '' }) => {
      const { voucherEvents } = await gqlRequest(
        gql`
          query VoucherEvents($voucherId: ID!, $pageSize: Int!, $after: ConnectionCursor) {
            voucherEvents(
              paging: { first: $pageSize, after: $after }
              filter: { voucher: { id: { eq: $voucherId } } }
              sorting: { field: createdAt, direction: DESC }
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
                  code
                  event
                  percentDiscount
                  amount
                  limitPerUser
                  descriptionEn
                  descriptionTh
                  isAllPackages
                  startAt
                  endAt
                  voucher {
                    id
                    code
                  }
                  user {
                    id
                    firstName
                    lastName
                    email
                  }
                  createdAt
                  updatedAt
                }
              }
            }
          }
        `,
        { voucherId, pageSize, after: pageParam }
      )
      return voucherEvents
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useVoucherEvents, ${error.message}`)
      },
    }
  )
}

export function useCreateVoucherEvents(): UseMutationResult<
  unknown,
  unknown,
  VoucherEventsInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async (voucherEvents: VoucherEventsInput) => {
      const { createVoucherEvents } = await gqlRequest(
        gql`
          mutation CreateVoucherEvents($input: CreateManyVoucherEventsInput!) {
            createVoucherEvents(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            voucherEvents,
          },
        }
      )
      return createVoucherEvents
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to useCreateVoucherEvents ${error.message}`)
      },
    }
  )
}

export function useFindWhitelistUsersNotInUserGroupAndKeyword(
  userGroupId: string,
  keyword: string
): UseQueryResult<User[]> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery(
    [QUERY_KEYS.USER_GROUP_AVAILABLE_WHITELIST_USERS, { userGroupId }],
    async () => {
      const { findWhitelistUsersNotInUserGroupAndKeyword } = await gqlRequest(
        gql`
          query FindWhitelistUsersNotInUserGroupAndKeyword(
            $userGroupId: String!
            $keyword: String!
          ) {
            findWhitelistUsersNotInUserGroupAndKeyword(
              userGroupId: $userGroupId
              keyword: $keyword
            ) {
              id
              value
              type
            }
          }
        `,
        { userGroupId, keyword }
      )
      return findWhitelistUsersNotInUserGroupAndKeyword
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(
          `Unable to retrieve useFindWhitelistUsersNotInUserGroupAndKeyword, ${error.message}`
        )
      },
    }
  )
}

export function useAddWhitelistsToUserGroup(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { addWhitelistsToUserGroup } = await gqlRequest(
        gql`
          mutation AddWhitelistsToUserGroup($id: ID!, $relationIds: [ID!]!) {
            addWhitelistsToUserGroup(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return addWhitelistsToUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useAddWhitelistsToUserGroup ${error.message}`)
      },
    }
  )
}

export function useRemoveUserGroupsFromWhitelist(): UseMutationResult<
  unknown,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { removeUserGroupsFromWhitelist } = await gqlRequest(
        gql`
          mutation RemoveUserGroupsFromWhitelist($id: ID!, $relationIds: [ID!]!) {
            removeUserGroupsFromWhitelist(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return removeUserGroupsFromWhitelist
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useRemoveUserGroupsFromWhitelist ${error.message}`)
      },
    }
  )
}

export function useCreateOneWhitelist(): UseMutationResult<
  UserWhitelist,
  unknown,
  UserWhitelistInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ type, value }: UserWhitelistInput) => {
      const { createOneWhitelist } = await gqlRequest(
        gql`
          mutation CreateOneWhitelist($input: CreateOneWhitelistInput!) {
            createOneWhitelist(input: $input) {
              id
            }
          }
        `,
        {
          input: {
            whitelist: {
              value,
              type,
            },
          },
        }
      )
      return createOneWhitelist
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useCreateOneWhitelist ${error.message}`)
      },
    }
  )
}

export function useDeleteWhitelistFromUserGroup(): UseMutationResult<
  UserWhitelist,
  unknown,
  UserWhitelistRemoveInput,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ whitelistId, userGroupId }: UserWhitelistRemoveInput) => {
      const { deleteWhitelistFromUserGroup } = await gqlRequest(
        gql`
          mutation DeleteWhitelistFromUserGroup($whitelistId: String!, $userGroupId: String!) {
            deleteWhitelistFromUserGroup(whitelistId: $whitelistId, userGroupId: $userGroupId) {
              id
            }
          }
        `,
        { whitelistId, userGroupId }
      )
      return deleteWhitelistFromUserGroup
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useDeleteWhitelistFromUserGroup ${error.message}`)
      },
    }
  )
}

export function useAddUserGroupsToVoucher(): UseMutationResult<
  Voucher,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { addUserGroupsToVoucher } = await gqlRequest(
        gql`
          mutation AddUserGroupsToVoucher($id: ID!, $relationIds: [ID!]!) {
            addUserGroupsToVoucher(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return addUserGroupsToVoucher
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useAddUserGroupsToVoucher ${error.message}`)
      },
    }
  )
}

export function useRemoveUserGroupsFromVoucher(): UseMutationResult<
  Voucher,
  unknown,
  RefIdAndRelationIds,
  unknown
> {
  const { gqlRequest } = useGraphQLRequest()

  return useMutation(
    async ({ id, relationIds }: RefIdAndRelationIds) => {
      const { removeUserGroupsFromVoucher } = await gqlRequest(
        gql`
          mutation RemoveUserGroupsFromVoucher($id: ID!, $relationIds: [ID!]!) {
            removeUserGroupsFromVoucher(input: { id: $id, relationIds: $relationIds }) {
              id
            }
          }
        `,
        {
          id,
          relationIds,
        }
      )
      return removeUserGroupsFromVoucher
    },
    {
      onError: (error: Error) => {
        handleErrorActions(error)
        console.error(`Unable to retrieve useRemoveUserGroupsFromVoucher ${error.message}`)
      },
    }
  )
}

export function useCarBodyTypes(pageSize = 10): UseQueryResult<WithPaginationType<CarBodyType>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery([QUERY_KEYS.CAR_BODY_TYPES, pageSize], async () => {
    const response = await gqlRequest(
      gql`
        query GetCarBodyTypes($pageSize: Int!) {
          carBodyTypes(paging: { first: $pageSize }) {
            edges {
              node {
                id
                bodyType
              }
            }
          }
        }
      `,
      {
        pageSize,
      }
    )

    return response.carBodyTypes
  })
}

export function useCarConnectorTypes(
  pageSize = 10
): UseQueryResult<WithPaginationType<CarConnectorType>> {
  const { gqlRequest } = useGraphQLRequest()

  return useQuery([QUERY_KEYS.CONNECTOR_TYPES, pageSize], async () => {
    const response = await gqlRequest(
      gql`
        query GetCarConnectorTypes($pageSize: Int!) {
          carConnectors(paging: { first: $pageSize }) {
            edges {
              node {
                id
                description
                type
                chargingType
              }
            }
          }
        }
      `,
      {
        pageSize,
      }
    )

    return response.carConnectors
  })
}
