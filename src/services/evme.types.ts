export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Cursor for paging through collections */
  ConnectionCursor: any
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
}

export type BooleanFieldComparison = {
  is?: Maybe<Scalars['Boolean']>
  isNot?: Maybe<Scalars['Boolean']>
}

export type Car = {
  __typename?: 'Car'
  id: Scalars['String']
  vin: Scalars['String']
  plateNumber: Scalars['String']
  carModelId: Scalars['String']
  subscriptions?: Maybe<Sub>
  carModel?: Maybe<CarModel>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type CarAggregateGroupBy = {
  __typename?: 'CarAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
}

export type CarBodyType = {
  __typename?: 'CarBodyType'
  id: Scalars['Int']
  bodyType: Scalars['String']
  carModels?: Maybe<CarModel>
}

export type CarBodyTypeAggregateGroupBy = {
  __typename?: 'CarBodyTypeAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  bodyType?: Maybe<Scalars['String']>
}

export type CarBodyTypeAvgAggregate = {
  __typename?: 'CarBodyTypeAvgAggregate'
  id?: Maybe<Scalars['Float']>
}

export type CarBodyTypeConnection = {
  __typename?: 'CarBodyTypeConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<CarBodyTypeEdge>
}

export type CarBodyTypeCountAggregate = {
  __typename?: 'CarBodyTypeCountAggregate'
  id?: Maybe<Scalars['Int']>
  bodyType?: Maybe<Scalars['Int']>
}

export type CarBodyTypeEdge = {
  __typename?: 'CarBodyTypeEdge'
  /** The node containing the CarBodyType */
  node: CarBodyType
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type CarBodyTypeFilter = {
  and?: Maybe<Array<CarBodyTypeFilter>>
  or?: Maybe<Array<CarBodyTypeFilter>>
  id?: Maybe<IdFilterComparison>
  bodyType?: Maybe<StringFieldComparison>
}

export type CarBodyTypeInput = {
  bodyType: Scalars['String']
}

export type CarBodyTypeMaxAggregate = {
  __typename?: 'CarBodyTypeMaxAggregate'
  id?: Maybe<Scalars['ID']>
  bodyType?: Maybe<Scalars['String']>
}

export type CarBodyTypeMinAggregate = {
  __typename?: 'CarBodyTypeMinAggregate'
  id?: Maybe<Scalars['ID']>
  bodyType?: Maybe<Scalars['String']>
}

export type CarBodyTypeSort = {
  field: CarBodyTypeSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum CarBodyTypeSortFields {
  Id = 'id',
  BodyType = 'bodyType',
}

export type CarBodyTypeSumAggregate = {
  __typename?: 'CarBodyTypeSumAggregate'
  id?: Maybe<Scalars['Float']>
}

export type CarConnection = {
  __typename?: 'CarConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<CarEdge>
}

export type CarCountAggregate = {
  __typename?: 'CarCountAggregate'
  id?: Maybe<Scalars['Int']>
  vin?: Maybe<Scalars['Int']>
  plateNumber?: Maybe<Scalars['Int']>
  carModelId?: Maybe<Scalars['Int']>
}

export type CarEdge = {
  __typename?: 'CarEdge'
  /** The node containing the Car */
  node: Car
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type CarFilter = {
  and?: Maybe<Array<CarFilter>>
  or?: Maybe<Array<CarFilter>>
  id?: Maybe<IdFilterComparison>
  vin?: Maybe<StringFieldComparison>
  plateNumber?: Maybe<StringFieldComparison>
  carModelId?: Maybe<StringFieldComparison>
}

export type CarInput = {
  vin: Scalars['String']
  plateNumber: Scalars['String']
}

export type CarMaxAggregate = {
  __typename?: 'CarMaxAggregate'
  id?: Maybe<Scalars['ID']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
}

export type CarMinAggregate = {
  __typename?: 'CarMinAggregate'
  id?: Maybe<Scalars['ID']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
}

export type CarModel = {
  __typename?: 'CarModel'
  id: Scalars['String']
  brand: Scalars['String']
  model: Scalars['String']
  seats: Scalars['Float']
  acceleration: Scalars['Float']
  topSpeed: Scalars['Float']
  range: Scalars['Float']
  totalPower: Scalars['Float']
  chargeType: Scalars['String']
  chargeTime: Scalars['Float']
  fastChargeTime: Scalars['Float']
  bodyTypeId: Scalars['Float']
  bodyType?: Maybe<CarBodyType>
  images: CarModelImage
  cars?: Maybe<Car>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type CarModelAggregateGroupBy = {
  __typename?: 'CarModelAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
}

export type CarModelConnection = {
  __typename?: 'CarModelConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<CarModelEdge>
}

export type CarModelCountAggregate = {
  __typename?: 'CarModelCountAggregate'
  id?: Maybe<Scalars['Int']>
}

export type CarModelEdge = {
  __typename?: 'CarModelEdge'
  /** The node containing the CarModel */
  node: CarModel
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type CarModelFilter = {
  and?: Maybe<Array<CarModelFilter>>
  or?: Maybe<Array<CarModelFilter>>
  id?: Maybe<IdFilterComparison>
}

export type CarModelImage = {
  __typename?: 'CarModelImage'
  id: Scalars['String']
  carModelId: Scalars['String']
  color: Scalars['String']
  carModel?: Maybe<CarModel>
  url: Scalars['String']
}

export type CarModelImageAggregateGroupBy = {
  __typename?: 'CarModelImageAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
}

export type CarModelImageConnection = {
  __typename?: 'CarModelImageConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<CarModelImageEdge>
}

export type CarModelImageCountAggregate = {
  __typename?: 'CarModelImageCountAggregate'
  id?: Maybe<Scalars['Int']>
  carModelId?: Maybe<Scalars['Int']>
  color?: Maybe<Scalars['Int']>
}

export type CarModelImageDeleteFilter = {
  and?: Maybe<Array<CarModelImageDeleteFilter>>
  or?: Maybe<Array<CarModelImageDeleteFilter>>
  id?: Maybe<IdFilterComparison>
  carModelId?: Maybe<StringFieldComparison>
  color?: Maybe<StringFieldComparison>
}

export type CarModelImageDeleteResponse = {
  __typename?: 'CarModelImageDeleteResponse'
  id?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
  carModel?: Maybe<CarModel>
  url?: Maybe<Scalars['String']>
}

export type CarModelImageEdge = {
  __typename?: 'CarModelImageEdge'
  /** The node containing the CarModelImage */
  node: CarModelImage
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type CarModelImageFilter = {
  and?: Maybe<Array<CarModelImageFilter>>
  or?: Maybe<Array<CarModelImageFilter>>
  id?: Maybe<IdFilterComparison>
  carModelId?: Maybe<StringFieldComparison>
  color?: Maybe<StringFieldComparison>
}

export type CarModelImageInput = {
  carModelId: Scalars['String']
  color: Scalars['String']
  url: Scalars['String']
}

export type CarModelImageMaxAggregate = {
  __typename?: 'CarModelImageMaxAggregate'
  id?: Maybe<Scalars['ID']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
}

export type CarModelImageMinAggregate = {
  __typename?: 'CarModelImageMinAggregate'
  id?: Maybe<Scalars['ID']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
}

export type CarModelImageSort = {
  field: CarModelImageSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum CarModelImageSortFields {
  Id = 'id',
  CarModelId = 'carModelId',
  Color = 'color',
}

export type CarModelImageUpdateFilter = {
  and?: Maybe<Array<CarModelImageUpdateFilter>>
  or?: Maybe<Array<CarModelImageUpdateFilter>>
  id?: Maybe<IdFilterComparison>
  carModelId?: Maybe<StringFieldComparison>
  color?: Maybe<StringFieldComparison>
}

export type CarModelInput = {
  brand: Scalars['String']
  model: Scalars['String']
  seats: Scalars['Float']
  acceleration: Scalars['Float']
  topSpeed: Scalars['Float']
  range: Scalars['Float']
  totalPower: Scalars['Float']
  chargeType: Scalars['String']
  chargeTime: Scalars['Float']
  fastChargeTime: Scalars['String']
  bodyTypeId: Scalars['String']
}

export type CarModelMaxAggregate = {
  __typename?: 'CarModelMaxAggregate'
  id?: Maybe<Scalars['ID']>
}

export type CarModelMinAggregate = {
  __typename?: 'CarModelMinAggregate'
  id?: Maybe<Scalars['ID']>
}

export type CarModelSort = {
  field: CarModelSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum CarModelSortFields {
  Id = 'id',
}

export type CarSort = {
  field: CarSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum CarSortFields {
  Id = 'id',
  Vin = 'vin',
  PlateNumber = 'plateNumber',
  CarModelId = 'carModelId',
}

export type CreateManyCarModelImagesInput = {
  /** Array of records to create */
  carModelImages: Array<CarModelImageInput>
}

export type CreateOneCarBodyTypeInput = {
  /** The record to create */
  carBodyType: CarBodyTypeInput
}

export type CreateOneCarInput = {
  /** The record to create */
  car: CarInput
}

export type CreateOneCarModelImageInput = {
  /** The record to create */
  carModelImage: CarModelImageInput
}

export type CreateOneCarModelInput = {
  /** The record to create */
  carModel: CarModelInput
}

export type CreateOnePackageInput = {
  /** The record to create */
  package: PackageInput
}

export type CreateOnePackagePriceInput = {
  /** The record to create */
  packagePrice: PackagePriceInput
}

export type CreateOnePaymentEventInput = {
  /** The record to create */
  paymentEvent: PaymentEventInput
}

export type CreateOnePaymentInput = {
  /** The record to create */
  payment: PaymentInput
}

export type CreateOneSubInput = {
  /** The record to create */
  sub: SubscriptionInput
}

export type CreateOneSubscriptionEventInput = {
  /** The record to create */
  subscriptionEvent: SubscriptionEventInput
}

export type CursorPaging = {
  /** Paginate before opaque cursor */
  before?: Maybe<Scalars['ConnectionCursor']>
  /** Paginate after opaque cursor */
  after?: Maybe<Scalars['ConnectionCursor']>
  /** Paginate first */
  first?: Maybe<Scalars['Int']>
  /** Paginate last */
  last?: Maybe<Scalars['Int']>
}

export type DateFieldComparison = {
  is?: Maybe<Scalars['Boolean']>
  isNot?: Maybe<Scalars['Boolean']>
  eq?: Maybe<Scalars['DateTime']>
  neq?: Maybe<Scalars['DateTime']>
  gt?: Maybe<Scalars['DateTime']>
  gte?: Maybe<Scalars['DateTime']>
  lt?: Maybe<Scalars['DateTime']>
  lte?: Maybe<Scalars['DateTime']>
  in?: Maybe<Array<Scalars['DateTime']>>
  notIn?: Maybe<Array<Scalars['DateTime']>>
  between?: Maybe<DateFieldComparisonBetween>
  notBetween?: Maybe<DateFieldComparisonBetween>
}

export type DateFieldComparisonBetween = {
  lower: Scalars['DateTime']
  upper: Scalars['DateTime']
}

export type DeleteManyCarModelImagesInput = {
  /** Filter to find records to delete */
  filter: CarModelImageDeleteFilter
}

export type DeleteManyResponse = {
  __typename?: 'DeleteManyResponse'
  /** The number of records deleted. */
  deletedCount: Scalars['Int']
}

export type DeleteOneCarModelImageInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']
}

export type IdFilterComparison = {
  is?: Maybe<Scalars['Boolean']>
  isNot?: Maybe<Scalars['Boolean']>
  eq?: Maybe<Scalars['ID']>
  neq?: Maybe<Scalars['ID']>
  gt?: Maybe<Scalars['ID']>
  gte?: Maybe<Scalars['ID']>
  lt?: Maybe<Scalars['ID']>
  lte?: Maybe<Scalars['ID']>
  like?: Maybe<Scalars['ID']>
  notLike?: Maybe<Scalars['ID']>
  iLike?: Maybe<Scalars['ID']>
  notILike?: Maybe<Scalars['ID']>
  in?: Maybe<Array<Scalars['ID']>>
  notIn?: Maybe<Array<Scalars['ID']>>
}

export type Mutation = {
  __typename?: 'Mutation'
  signup: User
  setBodyTypeOnCarModel: CarModel
  setCarsOnCarModel: CarModel
  setImagesOnCarModel: CarModel
  removeImagesFromCarModel: CarModel
  createCarModel: CarModel
  updateCarModel: CarModel
  setSubscriptionsOnCar: Car
  setCarModelOnCar: Car
  createCar: Car
  updateCar: Car
  setCarModelsOnCarBodyType: CarBodyType
  createCarBodyType: CarBodyType
  updateCarBodyType: CarBodyType
  setCarModelOnCarModelImage: CarModelImage
  createOneCarModelImage: CarModelImage
  createManyCarModelImages: Array<CarModelImage>
  updateOneCarModelImage: CarModelImage
  updateManyCarModelImages: UpdateManyResponse
  deleteOneCarModelImage: CarModelImageDeleteResponse
  deleteManyCarModelImages: DeleteManyResponse
  setEventsOnSub: Sub
  setUserOnSub: Sub
  setPackagePriceOnSub: Sub
  setPaymentsOnSub: Sub
  setCarOnSub: Sub
  subscribe: Sub
  updateSubscription: Sub
  setPricesOnPackage: Package
  createPackage: Package
  updatePackage: Package
  setSubscriptionsOnPackagePrice: PackagePrice
  setPackageOnPackagePrice: PackagePrice
  createPackagePrice: PackagePrice
  updatePackagePrice: Payment
  setSubscriptionOnPayment: Payment
  setEventsOnPayment: Payment
  createPayment: Payment
  setPaymentOnPaymentEvent: PaymentEvent
  createPaymentEvent: PaymentEvent
  updatePaymentEvent: PaymentEvent
  setSubscriptionOnSubscriptionEvent: SubscriptionEvent
  createSubscriptionEvent: SubscriptionEvent
  updateSubscriptionEvent: SubscriptionEvent
}

export type MutationSetBodyTypeOnCarModelArgs = {
  input: SetBodyTypeOnCarModelInput
}

export type MutationSetCarsOnCarModelArgs = {
  input: SetCarsOnCarModelInput
}

export type MutationSetImagesOnCarModelArgs = {
  input: SetImagesOnCarModelInput
}

export type MutationRemoveImagesFromCarModelArgs = {
  input: RemoveImagesFromCarModelInput
}

export type MutationCreateCarModelArgs = {
  input: CreateOneCarModelInput
}

export type MutationUpdateCarModelArgs = {
  input: UpdateOneCarModelInput
}

export type MutationSetSubscriptionsOnCarArgs = {
  input: SetSubscriptionsOnCarInput
}

export type MutationSetCarModelOnCarArgs = {
  input: SetCarModelOnCarInput
}

export type MutationCreateCarArgs = {
  input: CreateOneCarInput
}

export type MutationUpdateCarArgs = {
  input: UpdateOneCarInput
}

export type MutationSetCarModelsOnCarBodyTypeArgs = {
  input: SetCarModelsOnCarBodyTypeInput
}

export type MutationCreateCarBodyTypeArgs = {
  input: CreateOneCarBodyTypeInput
}

export type MutationUpdateCarBodyTypeArgs = {
  input: UpdateOneCarBodyTypeInput
}

export type MutationSetCarModelOnCarModelImageArgs = {
  input: SetCarModelOnCarModelImageInput
}

export type MutationCreateOneCarModelImageArgs = {
  input: CreateOneCarModelImageInput
}

export type MutationCreateManyCarModelImagesArgs = {
  input: CreateManyCarModelImagesInput
}

export type MutationUpdateOneCarModelImageArgs = {
  input: UpdateOneCarModelImageInput
}

export type MutationUpdateManyCarModelImagesArgs = {
  input: UpdateManyCarModelImagesInput
}

export type MutationDeleteOneCarModelImageArgs = {
  input: DeleteOneCarModelImageInput
}

export type MutationDeleteManyCarModelImagesArgs = {
  input: DeleteManyCarModelImagesInput
}

export type MutationSetEventsOnSubArgs = {
  input: SetEventsOnSubInput
}

export type MutationSetUserOnSubArgs = {
  input: SetUserOnSubInput
}

export type MutationSetPackagePriceOnSubArgs = {
  input: SetPackagePriceOnSubInput
}

export type MutationSetPaymentsOnSubArgs = {
  input: SetPaymentsOnSubInput
}

export type MutationSetCarOnSubArgs = {
  input: SetCarOnSubInput
}

export type MutationSubscribeArgs = {
  input: CreateOneSubInput
}

export type MutationUpdateSubscriptionArgs = {
  input: UpdateOneSubInput
}

export type MutationSetPricesOnPackageArgs = {
  input: SetPricesOnPackageInput
}

export type MutationCreatePackageArgs = {
  input: CreateOnePackageInput
}

export type MutationUpdatePackageArgs = {
  input: UpdateOnePackageInput
}

export type MutationSetSubscriptionsOnPackagePriceArgs = {
  input: SetSubscriptionsOnPackagePriceInput
}

export type MutationSetPackageOnPackagePriceArgs = {
  input: SetPackageOnPackagePriceInput
}

export type MutationCreatePackagePriceArgs = {
  input: CreateOnePackagePriceInput
}

export type MutationUpdatePackagePriceArgs = {
  input: UpdateOnePaymentInput
}

export type MutationSetSubscriptionOnPaymentArgs = {
  input: SetSubscriptionOnPaymentInput
}

export type MutationSetEventsOnPaymentArgs = {
  input: SetEventsOnPaymentInput
}

export type MutationCreatePaymentArgs = {
  input: CreateOnePaymentInput
}

export type MutationSetPaymentOnPaymentEventArgs = {
  input: SetPaymentOnPaymentEventInput
}

export type MutationCreatePaymentEventArgs = {
  input: CreateOnePaymentEventInput
}

export type MutationUpdatePaymentEventArgs = {
  input: UpdateOnePaymentEventInput
}

export type MutationSetSubscriptionOnSubscriptionEventArgs = {
  input: SetSubscriptionOnSubscriptionEventInput
}

export type MutationCreateSubscriptionEventArgs = {
  input: CreateOneSubscriptionEventInput
}

export type MutationUpdateSubscriptionEventArgs = {
  input: UpdateOneSubscriptionEventInput
}

export type NumberFieldComparison = {
  is?: Maybe<Scalars['Boolean']>
  isNot?: Maybe<Scalars['Boolean']>
  eq?: Maybe<Scalars['Float']>
  neq?: Maybe<Scalars['Float']>
  gt?: Maybe<Scalars['Float']>
  gte?: Maybe<Scalars['Float']>
  lt?: Maybe<Scalars['Float']>
  lte?: Maybe<Scalars['Float']>
  in?: Maybe<Array<Scalars['Float']>>
  notIn?: Maybe<Array<Scalars['Float']>>
  between?: Maybe<NumberFieldComparisonBetween>
  notBetween?: Maybe<NumberFieldComparisonBetween>
}

export type NumberFieldComparisonBetween = {
  lower: Scalars['Float']
  upper: Scalars['Float']
}

export type Package = {
  __typename?: 'Package'
  id: Scalars['String']
  active: Scalars['Boolean']
  prices?: Maybe<PackagePrice>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type PackageAggregateGroupBy = {
  __typename?: 'PackageAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  active?: Maybe<Scalars['Boolean']>
}

export type PackageConnection = {
  __typename?: 'PackageConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<PackageEdge>
}

export type PackageCountAggregate = {
  __typename?: 'PackageCountAggregate'
  id?: Maybe<Scalars['Int']>
  active?: Maybe<Scalars['Int']>
}

export type PackageEdge = {
  __typename?: 'PackageEdge'
  /** The node containing the Package */
  node: Package
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type PackageFilter = {
  and?: Maybe<Array<PackageFilter>>
  or?: Maybe<Array<PackageFilter>>
  id?: Maybe<IdFilterComparison>
  active?: Maybe<BooleanFieldComparison>
}

export type PackageInput = {
  active: Scalars['Boolean']
}

export type PackageMaxAggregate = {
  __typename?: 'PackageMaxAggregate'
  id?: Maybe<Scalars['ID']>
}

export type PackageMinAggregate = {
  __typename?: 'PackageMinAggregate'
  id?: Maybe<Scalars['ID']>
}

export type PackagePrice = {
  __typename?: 'PackagePrice'
  id: Scalars['String']
  packageId: Scalars['String']
  subscriptions?: Maybe<Sub>
  package?: Maybe<Package>
  duration: Scalars['String']
  price: Scalars['Float']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type PackagePriceAggregateGroupBy = {
  __typename?: 'PackagePriceAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  packageId?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
}

export type PackagePriceAvgAggregate = {
  __typename?: 'PackagePriceAvgAggregate'
  price?: Maybe<Scalars['Float']>
}

export type PackagePriceConnection = {
  __typename?: 'PackagePriceConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<PackagePriceEdge>
}

export type PackagePriceCountAggregate = {
  __typename?: 'PackagePriceCountAggregate'
  id?: Maybe<Scalars['Int']>
  packageId?: Maybe<Scalars['Int']>
  duration?: Maybe<Scalars['Int']>
  price?: Maybe<Scalars['Int']>
}

export type PackagePriceEdge = {
  __typename?: 'PackagePriceEdge'
  /** The node containing the PackagePrice */
  node: PackagePrice
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type PackagePriceFilter = {
  and?: Maybe<Array<PackagePriceFilter>>
  or?: Maybe<Array<PackagePriceFilter>>
  id?: Maybe<IdFilterComparison>
  packageId?: Maybe<StringFieldComparison>
  duration?: Maybe<StringFieldComparison>
  price?: Maybe<NumberFieldComparison>
}

export type PackagePriceInput = {
  packageId: Scalars['String']
  duration: Scalars['String']
  price: Scalars['Float']
}

export type PackagePriceMaxAggregate = {
  __typename?: 'PackagePriceMaxAggregate'
  id?: Maybe<Scalars['ID']>
  packageId?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
}

export type PackagePriceMinAggregate = {
  __typename?: 'PackagePriceMinAggregate'
  id?: Maybe<Scalars['ID']>
  packageId?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
}

export type PackagePriceSort = {
  field: PackagePriceSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum PackagePriceSortFields {
  Id = 'id',
  PackageId = 'packageId',
  Duration = 'duration',
  Price = 'price',
}

export type PackagePriceSumAggregate = {
  __typename?: 'PackagePriceSumAggregate'
  price?: Maybe<Scalars['Float']>
}

export type PackageSort = {
  field: PackageSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum PackageSortFields {
  Id = 'id',
  Active = 'active',
}

export type PageInfo = {
  __typename?: 'PageInfo'
  /** true if paging forward and there are more records. */
  hasNextPage?: Maybe<Scalars['Boolean']>
  /** true if paging backwards and there are more records. */
  hasPreviousPage?: Maybe<Scalars['Boolean']>
  /** The cursor of the first returned record. */
  startCursor?: Maybe<Scalars['ConnectionCursor']>
  /** The cursor of the last returned record. */
  endCursor?: Maybe<Scalars['ConnectionCursor']>
}

export type Payment = {
  __typename?: 'Payment'
  id: Scalars['String']
  subscriptionId: Scalars['String']
  subscription?: Maybe<Sub>
  amount: Scalars['Float']
  currency: Scalars['String']
  type: Scalars['String']
  omiseTransactionId: Scalars['String']
  events?: Maybe<PaymentEvent>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type PaymentAggregateGroupBy = {
  __typename?: 'PaymentAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
}

export type PaymentAvgAggregate = {
  __typename?: 'PaymentAvgAggregate'
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['Float']>
}

export type PaymentConnection = {
  __typename?: 'PaymentConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<PaymentEdge>
}

export type PaymentCountAggregate = {
  __typename?: 'PaymentCountAggregate'
  id?: Maybe<Scalars['Int']>
  subscriptionId?: Maybe<Scalars['Int']>
  amount?: Maybe<Scalars['Int']>
  currency?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['Int']>
  omiseTransactionId?: Maybe<Scalars['Int']>
}

export type PaymentEdge = {
  __typename?: 'PaymentEdge'
  /** The node containing the Payment */
  node: Payment
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type PaymentEvent = {
  __typename?: 'PaymentEvent'
  id: Scalars['String']
  paymentId: Scalars['String']
  payment?: Maybe<Payment>
  status: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type PaymentEventAggregateGroupBy = {
  __typename?: 'PaymentEventAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentEventConnection = {
  __typename?: 'PaymentEventConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<PaymentEventEdge>
}

export type PaymentEventCountAggregate = {
  __typename?: 'PaymentEventCountAggregate'
  id?: Maybe<Scalars['Int']>
  paymentId?: Maybe<Scalars['Int']>
  status?: Maybe<Scalars['Int']>
}

export type PaymentEventEdge = {
  __typename?: 'PaymentEventEdge'
  /** The node containing the PaymentEvent */
  node: PaymentEvent
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type PaymentEventFilter = {
  and?: Maybe<Array<PaymentEventFilter>>
  or?: Maybe<Array<PaymentEventFilter>>
  id?: Maybe<IdFilterComparison>
  paymentId?: Maybe<StringFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type PaymentEventInput = {
  paymentId: Scalars['String']
  status: Scalars['String']
}

export type PaymentEventMaxAggregate = {
  __typename?: 'PaymentEventMaxAggregate'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentEventMinAggregate = {
  __typename?: 'PaymentEventMinAggregate'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentEventSort = {
  field: PaymentEventSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum PaymentEventSortFields {
  Id = 'id',
  PaymentId = 'paymentId',
  Status = 'status',
}

export type PaymentFilter = {
  and?: Maybe<Array<PaymentFilter>>
  or?: Maybe<Array<PaymentFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  amount?: Maybe<NumberFieldComparison>
  currency?: Maybe<NumberFieldComparison>
  type?: Maybe<StringFieldComparison>
  omiseTransactionId?: Maybe<StringFieldComparison>
}

export type PaymentInput = {
  subscriptionId: Scalars['String']
  amount: Scalars['Float']
  currency: Scalars['String']
  type: Scalars['String']
  omiseTransactionId: Scalars['String']
}

export type PaymentMaxAggregate = {
  __typename?: 'PaymentMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
}

export type PaymentMinAggregate = {
  __typename?: 'PaymentMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
}

export type PaymentSort = {
  field: PaymentSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum PaymentSortFields {
  Id = 'id',
  SubscriptionId = 'subscriptionId',
  Amount = 'amount',
  Currency = 'currency',
  Type = 'type',
  OmiseTransactionId = 'omiseTransactionId',
}

export type PaymentSumAggregate = {
  __typename?: 'PaymentSumAggregate'
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['Float']>
}

export type Query = {
  __typename?: 'Query'
  me: User
  carModel?: Maybe<CarModel>
  carModels: CarModelConnection
  car?: Maybe<Car>
  cars: CarConnection
  carBodyType?: Maybe<CarBodyType>
  carBodyTypes: CarBodyTypeConnection
  carModelImage?: Maybe<CarModelImage>
  carModelImages: CarModelImageConnection
  subscription?: Maybe<Sub>
  subscriptions: SubConnection
  package?: Maybe<Package>
  packages: PackageConnection
  packagePrice?: Maybe<PackagePrice>
  packagePrices: PackagePriceConnection
  payment?: Maybe<Payment>
  payments: PaymentConnection
  paymentEvent?: Maybe<PaymentEvent>
  paymentEvents: PaymentEventConnection
  subscriptionEvent?: Maybe<SubscriptionEvent>
  subscriptionEvents: SubscriptionEventConnection
}

export type QueryCarModelArgs = {
  id: Scalars['ID']
}

export type QueryCarModelsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<CarModelFilter>
  sorting?: Maybe<Array<CarModelSort>>
}

export type QueryCarArgs = {
  id: Scalars['ID']
}

export type QueryCarsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<CarFilter>
  sorting?: Maybe<Array<CarSort>>
}

export type QueryCarBodyTypeArgs = {
  id: Scalars['ID']
}

export type QueryCarBodyTypesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<CarBodyTypeFilter>
  sorting?: Maybe<Array<CarBodyTypeSort>>
}

export type QueryCarModelImageArgs = {
  id: Scalars['ID']
}

export type QueryCarModelImagesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<CarModelImageFilter>
  sorting?: Maybe<Array<CarModelImageSort>>
}

export type QuerySubscriptionArgs = {
  id: Scalars['ID']
}

export type QuerySubscriptionsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<SubFilter>
  sorting?: Maybe<Array<SubSort>>
}

export type QueryPackageArgs = {
  id: Scalars['ID']
}

export type QueryPackagesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<PackageFilter>
  sorting?: Maybe<Array<PackageSort>>
}

export type QueryPackagePriceArgs = {
  id: Scalars['ID']
}

export type QueryPackagePricesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<PackagePriceFilter>
  sorting?: Maybe<Array<PackagePriceSort>>
}

export type QueryPaymentArgs = {
  id: Scalars['ID']
}

export type QueryPaymentsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<PaymentFilter>
  sorting?: Maybe<Array<PaymentSort>>
}

export type QueryPaymentEventArgs = {
  id: Scalars['ID']
}

export type QueryPaymentEventsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<PaymentEventFilter>
  sorting?: Maybe<Array<PaymentEventSort>>
}

export type QuerySubscriptionEventArgs = {
  id: Scalars['ID']
}

export type QuerySubscriptionEventsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<SubscriptionEventFilter>
  sorting?: Maybe<Array<SubscriptionEventSort>>
}

export type RemoveImagesFromCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetBodyTypeOnCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetCarModelOnCarInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetCarModelOnCarModelImageInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetCarModelsOnCarBodyTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetCarOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetCarsOnCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetEventsOnPaymentInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetEventsOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetImagesOnCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetPackageOnPackagePriceInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetPackagePriceOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetPaymentOnPaymentEventInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetPaymentsOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetPricesOnPackageInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetSubscriptionOnPaymentInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetSubscriptionOnSubscriptionEventInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetSubscriptionsOnCarInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetSubscriptionsOnPackagePriceInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetUserOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

/** Sort Directions */
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

/** Sort Nulls Options */
export enum SortNulls {
  NullsFirst = 'NULLS_FIRST',
  NullsLast = 'NULLS_LAST',
}

export type StringFieldComparison = {
  is?: Maybe<Scalars['Boolean']>
  isNot?: Maybe<Scalars['Boolean']>
  eq?: Maybe<Scalars['String']>
  neq?: Maybe<Scalars['String']>
  gt?: Maybe<Scalars['String']>
  gte?: Maybe<Scalars['String']>
  lt?: Maybe<Scalars['String']>
  lte?: Maybe<Scalars['String']>
  like?: Maybe<Scalars['String']>
  notLike?: Maybe<Scalars['String']>
  iLike?: Maybe<Scalars['String']>
  notILike?: Maybe<Scalars['String']>
  in?: Maybe<Array<Scalars['String']>>
  notIn?: Maybe<Array<Scalars['String']>>
}

export type Sub = {
  __typename?: 'Sub'
  id: Scalars['String']
  userId: Scalars['String']
  user?: Maybe<User>
  packagePriceId: Scalars['String']
  carId: Scalars['String']
  car?: Maybe<Car>
  packagePrice?: Maybe<PackagePrice>
  startDate: Scalars['DateTime']
  endDate: Scalars['DateTime']
  deliveryDate: Scalars['DateTime']
  returnDate: Scalars['DateTime']
  paymentStartDate: Scalars['DateTime']
  kind: Scalars['String']
  startAddress: Scalars['String']
  endAddress: Scalars['String']
  events?: Maybe<SubscriptionEvent>
  payments?: Maybe<Payment>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type SubAggregateGroupBy = {
  __typename?: 'SubAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  deliveryDate?: Maybe<Scalars['DateTime']>
  returnDate?: Maybe<Scalars['DateTime']>
  paymentStartDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
}

export type SubConnection = {
  __typename?: 'SubConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<SubEdge>
}

export type SubCountAggregate = {
  __typename?: 'SubCountAggregate'
  id?: Maybe<Scalars['Int']>
  userId?: Maybe<Scalars['Int']>
  packagePriceId?: Maybe<Scalars['Int']>
  carId?: Maybe<Scalars['Int']>
  startDate?: Maybe<Scalars['Int']>
  endDate?: Maybe<Scalars['Int']>
  deliveryDate?: Maybe<Scalars['Int']>
  returnDate?: Maybe<Scalars['Int']>
  paymentStartDate?: Maybe<Scalars['Int']>
  kind?: Maybe<Scalars['Int']>
}

export type SubEdge = {
  __typename?: 'SubEdge'
  /** The node containing the Sub */
  node: Sub
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type SubFilter = {
  and?: Maybe<Array<SubFilter>>
  or?: Maybe<Array<SubFilter>>
  id?: Maybe<IdFilterComparison>
  userId?: Maybe<StringFieldComparison>
  packagePriceId?: Maybe<StringFieldComparison>
  carId?: Maybe<StringFieldComparison>
  startDate?: Maybe<DateFieldComparison>
  endDate?: Maybe<DateFieldComparison>
  deliveryDate?: Maybe<DateFieldComparison>
  returnDate?: Maybe<DateFieldComparison>
  paymentStartDate?: Maybe<DateFieldComparison>
  kind?: Maybe<StringFieldComparison>
}

export type SubMaxAggregate = {
  __typename?: 'SubMaxAggregate'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  deliveryDate?: Maybe<Scalars['DateTime']>
  returnDate?: Maybe<Scalars['DateTime']>
  paymentStartDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
}

export type SubMinAggregate = {
  __typename?: 'SubMinAggregate'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  deliveryDate?: Maybe<Scalars['DateTime']>
  returnDate?: Maybe<Scalars['DateTime']>
  paymentStartDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
}

export type SubSort = {
  field: SubSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum SubSortFields {
  Id = 'id',
  UserId = 'userId',
  PackagePriceId = 'packagePriceId',
  CarId = 'carId',
  StartDate = 'startDate',
  EndDate = 'endDate',
  DeliveryDate = 'deliveryDate',
  ReturnDate = 'returnDate',
  PaymentStartDate = 'paymentStartDate',
  Kind = 'kind',
}

export type SubscriptionEvent = {
  __typename?: 'SubscriptionEvent'
  id: Scalars['String']
  subscriptionId: Scalars['String']
  subscription?: Maybe<Sub>
  status: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type SubscriptionEventAggregateGroupBy = {
  __typename?: 'SubscriptionEventAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type SubscriptionEventConnection = {
  __typename?: 'SubscriptionEventConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<SubscriptionEventEdge>
}

export type SubscriptionEventCountAggregate = {
  __typename?: 'SubscriptionEventCountAggregate'
  id?: Maybe<Scalars['Int']>
  subscriptionId?: Maybe<Scalars['Int']>
  status?: Maybe<Scalars['Int']>
}

export type SubscriptionEventEdge = {
  __typename?: 'SubscriptionEventEdge'
  /** The node containing the SubscriptionEvent */
  node: SubscriptionEvent
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type SubscriptionEventFilter = {
  and?: Maybe<Array<SubscriptionEventFilter>>
  or?: Maybe<Array<SubscriptionEventFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type SubscriptionEventInput = {
  subscriptionId: Scalars['String']
  status: Scalars['String']
}

export type SubscriptionEventMaxAggregate = {
  __typename?: 'SubscriptionEventMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type SubscriptionEventMinAggregate = {
  __typename?: 'SubscriptionEventMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type SubscriptionEventSort = {
  field: SubscriptionEventSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum SubscriptionEventSortFields {
  Id = 'id',
  SubscriptionId = 'subscriptionId',
  Status = 'status',
}

export type SubscriptionInput = {
  userId: Scalars['String']
  carId: Scalars['String']
  packagePriceId: Scalars['String']
  startDate: Scalars['DateTime']
  endDate: Scalars['DateTime']
  paymentStartDate: Scalars['DateTime']
  deliveryDate: Scalars['DateTime']
  returnDate: Scalars['DateTime']
  kind: Scalars['String']
  startAddress: Scalars['String']
  endAddress: Scalars['String']
}

export type UpdateManyCarModelImagesInput = {
  /** Filter used to find fields to update */
  filter: CarModelImageUpdateFilter
  /** The update to apply to all records found using the filter */
  update: CarModelImageInput
}

export type UpdateManyResponse = {
  __typename?: 'UpdateManyResponse'
  /** The number of records updated. */
  updatedCount: Scalars['Int']
}

export type UpdateOneCarBodyTypeInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: CarBodyTypeInput
}

export type UpdateOneCarInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: CarInput
}

export type UpdateOneCarModelImageInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: CarModelImageInput
}

export type UpdateOneCarModelInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: CarModelInput
}

export type UpdateOnePackageInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: PackageInput
}

export type UpdateOnePaymentEventInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: PaymentEventInput
}

export type UpdateOnePaymentInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: PaymentInput
}

export type UpdateOneSubInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: SubscriptionInput
}

export type UpdateOneSubscriptionEventInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: SubscriptionEventInput
}

export type User = {
  __typename?: 'User'
  id: Scalars['String']
  firebaseId: Scalars['String']
  role: Scalars['String']
  subscriptions: Array<Sub>
  disabled: Scalars['Boolean']
  phoneNumber: Scalars['String']
  email: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}
