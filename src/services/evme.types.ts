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

export type AddAdditionalExpensesToSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddAmenitiesToChargingLocationInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddCarModelsToCarBodyTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddCarModelsToCarConnectorTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddCarsToCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddEventsToPaymentInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddEventsToSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddFavoriteChargingLocationsToUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddFilesToAdditionalExpenseInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddLocationsToCarConnectorTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddLocationsToLocationAmenityInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddOutletsToChargingLocationInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddPaymentsToSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddPricesToCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AddSubscriptionsToUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type AdditionalExpense = {
  __typename?: 'AdditionalExpense'
  id: Scalars['String']
  subscriptionId: Scalars['String']
  subscription?: Maybe<Sub>
  price: Scalars['Float']
  type: Scalars['String']
  noticeDate: Scalars['DateTime']
  status: Scalars['String']
  note?: Maybe<Scalars['String']>
  files?: Maybe<Array<AdditionalExpenseFile>>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type AdditionalExpenseFilesArgs = {
  filter?: Maybe<AdditionalExpenseFileFilter>
  sorting?: Maybe<Array<AdditionalExpenseFileSort>>
}

export type AdditionalExpenseAggregateFilter = {
  and?: Maybe<Array<AdditionalExpenseAggregateFilter>>
  or?: Maybe<Array<AdditionalExpenseAggregateFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  price?: Maybe<NumberFieldComparison>
  type?: Maybe<StringFieldComparison>
  noticeDate?: Maybe<DateFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type AdditionalExpenseAggregateGroupBy = {
  __typename?: 'AdditionalExpenseAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
}

export type AdditionalExpenseAvgAggregate = {
  __typename?: 'AdditionalExpenseAvgAggregate'
  price?: Maybe<Scalars['Float']>
}

export type AdditionalExpenseConnection = {
  __typename?: 'AdditionalExpenseConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<AdditionalExpenseEdge>
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type AdditionalExpenseCountAggregate = {
  __typename?: 'AdditionalExpenseCountAggregate'
  id?: Maybe<Scalars['Int']>
  subscriptionId?: Maybe<Scalars['Int']>
  price?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['Int']>
  noticeDate?: Maybe<Scalars['Int']>
  status?: Maybe<Scalars['Int']>
}

export type AdditionalExpenseDeleteFilter = {
  and?: Maybe<Array<AdditionalExpenseDeleteFilter>>
  or?: Maybe<Array<AdditionalExpenseDeleteFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  price?: Maybe<NumberFieldComparison>
  type?: Maybe<StringFieldComparison>
  noticeDate?: Maybe<DateFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type AdditionalExpenseDeleteResponse = {
  __typename?: 'AdditionalExpenseDeleteResponse'
  id?: Maybe<Scalars['String']>
  subscriptionId?: Maybe<Scalars['String']>
  subscription?: Maybe<Sub>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
  note?: Maybe<Scalars['String']>
  files?: Maybe<Array<AdditionalExpenseFile>>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type AdditionalExpenseEdge = {
  __typename?: 'AdditionalExpenseEdge'
  /** The node containing the AdditionalExpense */
  node: AdditionalExpense
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type AdditionalExpenseFile = {
  __typename?: 'AdditionalExpenseFile'
  id: Scalars['String']
  additionalExpenseId: Scalars['String']
  additionalExpense: AdditionalExpense
  url: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type AdditionalExpenseFileAggregateGroupBy = {
  __typename?: 'AdditionalExpenseFileAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  additionalExpenseId?: Maybe<Scalars['String']>
}

export type AdditionalExpenseFileConnection = {
  __typename?: 'AdditionalExpenseFileConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<AdditionalExpenseFileEdge>
}

export type AdditionalExpenseFileCountAggregate = {
  __typename?: 'AdditionalExpenseFileCountAggregate'
  id?: Maybe<Scalars['Int']>
  additionalExpenseId?: Maybe<Scalars['Int']>
}

export type AdditionalExpenseFileDeleteFilter = {
  and?: Maybe<Array<AdditionalExpenseFileDeleteFilter>>
  or?: Maybe<Array<AdditionalExpenseFileDeleteFilter>>
  id?: Maybe<IdFilterComparison>
  additionalExpenseId?: Maybe<StringFieldComparison>
}

export type AdditionalExpenseFileDeleteResponse = {
  __typename?: 'AdditionalExpenseFileDeleteResponse'
  id?: Maybe<Scalars['String']>
  additionalExpenseId?: Maybe<Scalars['String']>
  additionalExpense?: Maybe<AdditionalExpense>
  url?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type AdditionalExpenseFileEdge = {
  __typename?: 'AdditionalExpenseFileEdge'
  /** The node containing the AdditionalExpenseFile */
  node: AdditionalExpenseFile
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type AdditionalExpenseFileFilter = {
  and?: Maybe<Array<AdditionalExpenseFileFilter>>
  or?: Maybe<Array<AdditionalExpenseFileFilter>>
  id?: Maybe<IdFilterComparison>
  additionalExpenseId?: Maybe<StringFieldComparison>
}

export type AdditionalExpenseFileInput = {
  additionalExpenseId: Scalars['String']
  url: Scalars['String']
}

export type AdditionalExpenseFileMaxAggregate = {
  __typename?: 'AdditionalExpenseFileMaxAggregate'
  id?: Maybe<Scalars['ID']>
  additionalExpenseId?: Maybe<Scalars['String']>
}

export type AdditionalExpenseFileMinAggregate = {
  __typename?: 'AdditionalExpenseFileMinAggregate'
  id?: Maybe<Scalars['ID']>
  additionalExpenseId?: Maybe<Scalars['String']>
}

export type AdditionalExpenseFileSort = {
  field: AdditionalExpenseFileSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum AdditionalExpenseFileSortFields {
  Id = 'id',
  AdditionalExpenseId = 'additionalExpenseId',
}

export type AdditionalExpenseFilter = {
  and?: Maybe<Array<AdditionalExpenseFilter>>
  or?: Maybe<Array<AdditionalExpenseFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  price?: Maybe<NumberFieldComparison>
  type?: Maybe<StringFieldComparison>
  noticeDate?: Maybe<DateFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type AdditionalExpenseInput = {
  subscriptionId: Scalars['String']
  price: Scalars['Float']
  type: Scalars['String']
  status: Scalars['String']
  noticeDate: Scalars['DateTime']
  note?: Maybe<Scalars['String']>
}

export type AdditionalExpenseMaxAggregate = {
  __typename?: 'AdditionalExpenseMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
}

export type AdditionalExpenseMinAggregate = {
  __typename?: 'AdditionalExpenseMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
}

export type AdditionalExpenseSort = {
  field: AdditionalExpenseSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum AdditionalExpenseSortFields {
  Id = 'id',
  SubscriptionId = 'subscriptionId',
  Price = 'price',
  Type = 'type',
  NoticeDate = 'noticeDate',
  Status = 'status',
}

export type AdditionalExpenseSumAggregate = {
  __typename?: 'AdditionalExpenseSumAggregate'
  price?: Maybe<Scalars['Float']>
}

export type AdditionalExpenseUpdateInput = {
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  note?: Maybe<Scalars['String']>
}

export type Authorize = {
  __typename?: 'Authorize'
  subscriptionId: Scalars['String']
  authorizeUri: Scalars['String']
}

export type AvailableCar = {
  __typename?: 'AvailableCar'
  color: Scalars['String']
  /** Displaying color in the app */
  colorHex: Scalars['String']
  available?: Maybe<Scalars['Boolean']>
  availabilityPercentage?: Maybe<Scalars['Float']>
  exteriorImages?: Maybe<Array<CarModelImage>>
  interiorImages?: Maybe<Array<CarModelImage>>
}

export type AvailableCarInput = {
  startDate: Scalars['DateTime']
  endDate: Scalars['DateTime']
}

export type BooleanFieldComparison = {
  is?: Maybe<Scalars['Boolean']>
  isNot?: Maybe<Scalars['Boolean']>
}

export type CancelSubscriptionInput = {
  subscriptionId: Scalars['String']
  pickupDate?: Maybe<Scalars['DateTime']>
}

export type Car = {
  __typename?: 'Car'
  id: Scalars['String']
  vin?: Maybe<Scalars['String']>
  plateNumber: Scalars['String']
  carModelId?: Maybe<Scalars['String']>
  color: Scalars['String']
  /** Displaying color in the app */
  colorHex?: Maybe<Scalars['String']>
  carModel?: Maybe<CarModel>
  carTrackId: Scalars['String']
  latestStatus: Scalars['String']
  deletedAt?: Maybe<Scalars['DateTime']>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  available: Scalars['Boolean']
  images: ImageByCarDto
}

export type CarAvailableArgs = {
  input: AvailableCarInput
}

export type CarAggregateGroupBy = {
  __typename?: 'CarAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
  carTrackId?: Maybe<Scalars['String']>
}

export type CarBodyType = {
  __typename?: 'CarBodyType'
  id: Scalars['Int']
  bodyType: Scalars['String']
  carModels?: Maybe<Array<CarModel>>
}

export type CarBodyTypeCarModelsArgs = {
  filter?: Maybe<CarModelFilter>
  sorting?: Maybe<Array<CarModelSort>>
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
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type CarConnectorType = {
  __typename?: 'CarConnectorType'
  id: Scalars['String']
  description: Scalars['String']
  type: Scalars['String']
  carModels?: Maybe<Array<CarModel>>
  locations?: Maybe<Array<CarModel>>
}

export type CarConnectorTypeCarModelsArgs = {
  filter?: Maybe<CarModelFilter>
  sorting?: Maybe<Array<CarModelSort>>
}

export type CarConnectorTypeLocationsArgs = {
  filter?: Maybe<CarModelFilter>
  sorting?: Maybe<Array<CarModelSort>>
}

export type CarConnectorTypeAggregateGroupBy = {
  __typename?: 'CarConnectorTypeAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  description?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type CarConnectorTypeConnection = {
  __typename?: 'CarConnectorTypeConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<CarConnectorTypeEdge>
}

export type CarConnectorTypeCountAggregate = {
  __typename?: 'CarConnectorTypeCountAggregate'
  id?: Maybe<Scalars['Int']>
  description?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['Int']>
}

export type CarConnectorTypeEdge = {
  __typename?: 'CarConnectorTypeEdge'
  /** The node containing the CarConnectorType */
  node: CarConnectorType
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type CarConnectorTypeFilter = {
  and?: Maybe<Array<CarConnectorTypeFilter>>
  or?: Maybe<Array<CarConnectorTypeFilter>>
  id?: Maybe<IdFilterComparison>
  description?: Maybe<StringFieldComparison>
  type?: Maybe<StringFieldComparison>
}

export type CarConnectorTypeMaxAggregate = {
  __typename?: 'CarConnectorTypeMaxAggregate'
  id?: Maybe<Scalars['ID']>
  description?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type CarConnectorTypeMinAggregate = {
  __typename?: 'CarConnectorTypeMinAggregate'
  id?: Maybe<Scalars['ID']>
  description?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type CarConnectorTypeSort = {
  field: CarConnectorTypeSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum CarConnectorTypeSortFields {
  Id = 'id',
  Description = 'description',
  Type = 'type',
}

export type CarCountAggregate = {
  __typename?: 'CarCountAggregate'
  id?: Maybe<Scalars['Int']>
  vin?: Maybe<Scalars['Int']>
  plateNumber?: Maybe<Scalars['Int']>
  carModelId?: Maybe<Scalars['Int']>
  color?: Maybe<Scalars['Int']>
  carTrackId?: Maybe<Scalars['Int']>
}

export type CarDeleteFilter = {
  and?: Maybe<Array<CarDeleteFilter>>
  or?: Maybe<Array<CarDeleteFilter>>
  id?: Maybe<IdFilterComparison>
  vin?: Maybe<StringFieldComparison>
  plateNumber?: Maybe<StringFieldComparison>
  carModelId?: Maybe<StringFieldComparison>
  color?: Maybe<StringFieldComparison>
  carTrackId?: Maybe<StringFieldComparison>
}

export type CarDeleteResponse = {
  __typename?: 'CarDeleteResponse'
  id?: Maybe<Scalars['String']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
  /** Displaying color in the app */
  colorHex?: Maybe<Scalars['String']>
  carModel?: Maybe<CarModel>
  carTrackId?: Maybe<Scalars['String']>
  deletedAt?: Maybe<Scalars['DateTime']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
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
  color?: Maybe<StringFieldComparison>
  carTrackId?: Maybe<StringFieldComparison>
}

export type CarInput = {
  carModelId: Scalars['String']
  color: Scalars['String']
  /** Displaying color in the app */
  colorHex: Scalars['String']
  vin: Scalars['String']
  plateNumber: Scalars['String']
  status: Scalars['String']
}

export type CarMaxAggregate = {
  __typename?: 'CarMaxAggregate'
  id?: Maybe<Scalars['ID']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
  carTrackId?: Maybe<Scalars['String']>
}

export type CarMinAggregate = {
  __typename?: 'CarMinAggregate'
  id?: Maybe<Scalars['ID']>
  vin?: Maybe<Scalars['String']>
  plateNumber?: Maybe<Scalars['String']>
  carModelId?: Maybe<Scalars['String']>
  color?: Maybe<Scalars['String']>
  carTrackId?: Maybe<Scalars['String']>
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
  connectorTypeId: Scalars['String']
  connectorType: CarConnectorType
  chargeTime: Scalars['Float']
  fastChargeTime: Scalars['Float']
  bodyTypeId: Scalars['Float']
  bodyType: CarBodyType
  cars?: Maybe<Array<Car>>
  prices: Array<PackagePrice>
  totalTorque: Scalars['Float']
  horsePower?: Maybe<Scalars['Float']>
  modelYear?: Maybe<Scalars['Float']>
  batteryCapacity?: Maybe<Scalars['Float']>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  logo?: Maybe<CarModelImage>
  availabilityPercentage: Scalars['Float']
  colors: Array<AvailableCar>
}

export type CarModelCarsArgs = {
  filter?: Maybe<CarFilter>
  sorting?: Maybe<Array<CarSort>>
}

export type CarModelPricesArgs = {
  filter?: Maybe<PackagePriceFilter>
  sorting?: Maybe<Array<PackagePriceSort>>
}

export type CarModelAvailabilityPercentageArgs = {
  input: AvailableCarInput
}

export type CarModelColorsArgs = {
  input?: Maybe<AvailableCarInput>
}

export type CarModelAggregateGroupBy = {
  __typename?: 'CarModelAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  brand?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  seats?: Maybe<Scalars['Float']>
  acceleration?: Maybe<Scalars['Float']>
  topSpeed?: Maybe<Scalars['Float']>
  range?: Maybe<Scalars['Float']>
  totalPower?: Maybe<Scalars['Float']>
  connectorTypeId?: Maybe<Scalars['String']>
  chargeTime?: Maybe<Scalars['Float']>
  fastChargeTime?: Maybe<Scalars['Float']>
  bodyTypeId?: Maybe<Scalars['Float']>
  totalTorque?: Maybe<Scalars['Float']>
  horsePower?: Maybe<Scalars['Float']>
  modelYear?: Maybe<Scalars['Float']>
  batteryCapacity?: Maybe<Scalars['Float']>
}

export type CarModelAvgAggregate = {
  __typename?: 'CarModelAvgAggregate'
  seats?: Maybe<Scalars['Float']>
  acceleration?: Maybe<Scalars['Float']>
  topSpeed?: Maybe<Scalars['Float']>
  range?: Maybe<Scalars['Float']>
  totalPower?: Maybe<Scalars['Float']>
  chargeTime?: Maybe<Scalars['Float']>
  fastChargeTime?: Maybe<Scalars['Float']>
  bodyTypeId?: Maybe<Scalars['Float']>
  totalTorque?: Maybe<Scalars['Float']>
  horsePower?: Maybe<Scalars['Float']>
  modelYear?: Maybe<Scalars['Float']>
  batteryCapacity?: Maybe<Scalars['Float']>
}

export type CarModelConnection = {
  __typename?: 'CarModelConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<CarModelEdge>
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type CarModelCountAggregate = {
  __typename?: 'CarModelCountAggregate'
  id?: Maybe<Scalars['Int']>
  brand?: Maybe<Scalars['Int']>
  model?: Maybe<Scalars['Int']>
  seats?: Maybe<Scalars['Int']>
  acceleration?: Maybe<Scalars['Int']>
  topSpeed?: Maybe<Scalars['Int']>
  range?: Maybe<Scalars['Int']>
  totalPower?: Maybe<Scalars['Int']>
  connectorTypeId?: Maybe<Scalars['Int']>
  chargeTime?: Maybe<Scalars['Int']>
  fastChargeTime?: Maybe<Scalars['Int']>
  bodyTypeId?: Maybe<Scalars['Int']>
  totalTorque?: Maybe<Scalars['Int']>
  horsePower?: Maybe<Scalars['Int']>
  modelYear?: Maybe<Scalars['Int']>
  batteryCapacity?: Maybe<Scalars['Int']>
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
  brand?: Maybe<StringFieldComparison>
  model?: Maybe<StringFieldComparison>
  seats?: Maybe<NumberFieldComparison>
  acceleration?: Maybe<NumberFieldComparison>
  topSpeed?: Maybe<NumberFieldComparison>
  range?: Maybe<NumberFieldComparison>
  totalPower?: Maybe<NumberFieldComparison>
  connectorTypeId?: Maybe<StringFieldComparison>
  chargeTime?: Maybe<NumberFieldComparison>
  fastChargeTime?: Maybe<NumberFieldComparison>
  bodyTypeId?: Maybe<NumberFieldComparison>
  totalTorque?: Maybe<NumberFieldComparison>
  horsePower?: Maybe<NumberFieldComparison>
  modelYear?: Maybe<NumberFieldComparison>
  batteryCapacity?: Maybe<NumberFieldComparison>
}

export type CarModelImage = {
  __typename?: 'CarModelImage'
  id: Scalars['String']
  carModelId: Scalars['String']
  url: Scalars['String']
  type: Scalars['String']
  color: Scalars['String']
  lightsOn?: Maybe<Scalars['Boolean']>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type CarModelInput = {
  brand: Scalars['String']
  model: Scalars['String']
  seats: Scalars['Float']
  acceleration: Scalars['Float']
  topSpeed: Scalars['Float']
  range: Scalars['Float']
  totalPower: Scalars['Float']
  connectorType: Scalars['String']
  chargeTime: Scalars['Float']
  fastChargeTime: Scalars['String']
  bodyTypeId: Scalars['String']
}

export type CarModelMaxAggregate = {
  __typename?: 'CarModelMaxAggregate'
  id?: Maybe<Scalars['ID']>
  brand?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  seats?: Maybe<Scalars['Float']>
  acceleration?: Maybe<Scalars['Float']>
  topSpeed?: Maybe<Scalars['Float']>
  range?: Maybe<Scalars['Float']>
  totalPower?: Maybe<Scalars['Float']>
  connectorTypeId?: Maybe<Scalars['String']>
  chargeTime?: Maybe<Scalars['Float']>
  fastChargeTime?: Maybe<Scalars['Float']>
  bodyTypeId?: Maybe<Scalars['Float']>
  totalTorque?: Maybe<Scalars['Float']>
  horsePower?: Maybe<Scalars['Float']>
  modelYear?: Maybe<Scalars['Float']>
  batteryCapacity?: Maybe<Scalars['Float']>
}

export type CarModelMinAggregate = {
  __typename?: 'CarModelMinAggregate'
  id?: Maybe<Scalars['ID']>
  brand?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  seats?: Maybe<Scalars['Float']>
  acceleration?: Maybe<Scalars['Float']>
  topSpeed?: Maybe<Scalars['Float']>
  range?: Maybe<Scalars['Float']>
  totalPower?: Maybe<Scalars['Float']>
  connectorTypeId?: Maybe<Scalars['String']>
  chargeTime?: Maybe<Scalars['Float']>
  fastChargeTime?: Maybe<Scalars['Float']>
  bodyTypeId?: Maybe<Scalars['Float']>
  totalTorque?: Maybe<Scalars['Float']>
  horsePower?: Maybe<Scalars['Float']>
  modelYear?: Maybe<Scalars['Float']>
  batteryCapacity?: Maybe<Scalars['Float']>
}

export type CarModelSort = {
  field: CarModelSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum CarModelSortFields {
  Id = 'id',
  Brand = 'brand',
  Model = 'model',
  Seats = 'seats',
  Acceleration = 'acceleration',
  TopSpeed = 'topSpeed',
  Range = 'range',
  TotalPower = 'totalPower',
  ConnectorTypeId = 'connectorTypeId',
  ChargeTime = 'chargeTime',
  FastChargeTime = 'fastChargeTime',
  BodyTypeId = 'bodyTypeId',
  TotalTorque = 'totalTorque',
  HorsePower = 'horsePower',
  ModelYear = 'modelYear',
  BatteryCapacity = 'batteryCapacity',
}

export type CarModelSumAggregate = {
  __typename?: 'CarModelSumAggregate'
  seats?: Maybe<Scalars['Float']>
  acceleration?: Maybe<Scalars['Float']>
  topSpeed?: Maybe<Scalars['Float']>
  range?: Maybe<Scalars['Float']>
  totalPower?: Maybe<Scalars['Float']>
  chargeTime?: Maybe<Scalars['Float']>
  fastChargeTime?: Maybe<Scalars['Float']>
  bodyTypeId?: Maybe<Scalars['Float']>
  totalTorque?: Maybe<Scalars['Float']>
  horsePower?: Maybe<Scalars['Float']>
  modelYear?: Maybe<Scalars['Float']>
  batteryCapacity?: Maybe<Scalars['Float']>
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
  Color = 'color',
  CarTrackId = 'carTrackId',
}

export type ChargingLocation = {
  __typename?: 'ChargingLocation'
  id: Scalars['String']
  provider: Scalars['String']
  address: Scalars['String']
  name: Scalars['String']
  externalId: Scalars['String']
  latitude: Scalars['Float']
  longitude: Scalars['Float']
  extraFields: ChargingLocationExtra
  amenities: Array<LocationAmenity>
  outlets: Array<CarConnectorType>
}

export type ChargingLocationAmenitiesArgs = {
  filter?: Maybe<LocationAmenityFilter>
  sorting?: Maybe<Array<LocationAmenitySort>>
}

export type ChargingLocationOutletsArgs = {
  filter?: Maybe<CarConnectorTypeFilter>
  sorting?: Maybe<Array<CarConnectorTypeSort>>
}

export type ChargingLocationAggregateFilter = {
  and?: Maybe<Array<ChargingLocationAggregateFilter>>
  or?: Maybe<Array<ChargingLocationAggregateFilter>>
  id?: Maybe<StringFieldComparison>
  provider?: Maybe<StringFieldComparison>
  address?: Maybe<StringFieldComparison>
  name?: Maybe<StringFieldComparison>
  externalId?: Maybe<StringFieldComparison>
}

export type ChargingLocationAggregateGroupBy = {
  __typename?: 'ChargingLocationAggregateGroupBy'
  id?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
}

export type ChargingLocationConnection = {
  __typename?: 'ChargingLocationConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<ChargingLocationEdge>
}

export type ChargingLocationCountAggregate = {
  __typename?: 'ChargingLocationCountAggregate'
  id?: Maybe<Scalars['Int']>
  provider?: Maybe<Scalars['Int']>
  address?: Maybe<Scalars['Int']>
  name?: Maybe<Scalars['Int']>
  externalId?: Maybe<Scalars['Int']>
}

export type ChargingLocationEdge = {
  __typename?: 'ChargingLocationEdge'
  /** The node containing the ChargingLocation */
  node: ChargingLocation
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type ChargingLocationExtra = {
  __typename?: 'ChargingLocationExtra'
  url?: Maybe<Scalars['String']>
  cost?: Maybe<Scalars['Boolean']>
  icon?: Maybe<Scalars['String']>
  hours?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  access?: Maybe<Scalars['Float']>
  locale?: Maybe<Scalars['String']>
  locked?: Maybe<Scalars['Boolean']>
  enabled?: Maybe<Scalars['Boolean']>
  open247?: Maybe<Scalars['Boolean']>
  poi_name?: Maybe<Scalars['String']>
  stations?: Maybe<Array<ChargingLocationExtraStation>>
  icon_type?: Maybe<Scalars['String']>
  all_promos?: Maybe<Array<ChargingLocationExtraPromo>>
  confidence?: Maybe<Scalars['Float']>
  created_at?: Maybe<Scalars['DateTime']>
  updated_at?: Maybe<Scalars['DateTime']>
  description?: Maybe<Scalars['String']>
  nissan_nctc?: Maybe<Scalars['Boolean']>
  custom_ports?: Maybe<Scalars['String']>
  opening_date?: Maybe<Scalars['String']>
  total_photos?: Maybe<Scalars['Float']>
  under_repair?: Maybe<Scalars['Boolean']>
  total_reviews?: Maybe<Scalars['Float']>
  compass_bearing?: Maybe<Scalars['Float']>
  distance_meters?: Maybe<Scalars['Float']>
  cost_description?: Maybe<Scalars['String']>
  e164_phone_number?: Maybe<Scalars['String']>
  parking_type_name?: Maybe<Scalars['String']>
  formatted_phone_number?: Maybe<Scalars['String']>
}

export type ChargingLocationExtraNetwork = {
  __typename?: 'ChargingLocationExtraNetwork'
  id?: Maybe<Scalars['Float']>
  url?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  action_url?: Maybe<Scalars['String']>
  action_name?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  e164_phone_number?: Maybe<Scalars['String']>
  formatted_phone_number?: Maybe<Scalars['String']>
}

export type ChargingLocationExtraOutlet = {
  __typename?: 'ChargingLocationExtraOutlet'
  id?: Maybe<Scalars['Float']>
  power?: Maybe<Scalars['Float']>
  connector?: Maybe<Scalars['Float']>
  connector_name?: Maybe<Scalars['String']>
  connector_type?: Maybe<Scalars['Float']>
}

export type ChargingLocationExtraPromo = {
  __typename?: 'ChargingLocationExtraPromo'
  id?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
}

export type ChargingLocationExtraStation = {
  __typename?: 'ChargingLocationExtraStation'
  id?: Maybe<Scalars['Float']>
  cost?: Maybe<Scalars['Float']>
  hours?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  promos?: Maybe<Array<ChargingLocationExtraPromo>>
  network?: Maybe<ChargingLocationExtraNetwork>
  outlets?: Maybe<Array<ChargingLocationExtraOutlet>>
  available?: Maybe<Scalars['Float']>
  created_at?: Maybe<Scalars['DateTime']>
  network_id?: Maybe<Scalars['Float']>
  location_id?: Maybe<Scalars['Float']>
  nissan_nctc?: Maybe<Scalars['Boolean']>
  manufacturer?: Maybe<Scalars['String']>
  cost_description?: Maybe<Scalars['String']>
  requiresAccessCard?: Maybe<Scalars['Boolean']>
}

export type ChargingLocationFilter = {
  and?: Maybe<Array<ChargingLocationFilter>>
  or?: Maybe<Array<ChargingLocationFilter>>
  id?: Maybe<StringFieldComparison>
  provider?: Maybe<StringFieldComparison>
  address?: Maybe<StringFieldComparison>
  name?: Maybe<StringFieldComparison>
  externalId?: Maybe<StringFieldComparison>
}

export type ChargingLocationMaxAggregate = {
  __typename?: 'ChargingLocationMaxAggregate'
  id?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
}

export type ChargingLocationMinAggregate = {
  __typename?: 'ChargingLocationMinAggregate'
  id?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
}

export type ChargingLocationSort = {
  field: ChargingLocationSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum ChargingLocationSortFields {
  Id = 'id',
  Provider = 'provider',
  Address = 'address',
  Name = 'name',
  ExternalId = 'externalId',
}

export type CreateLocationAmenity = {
  id?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  plugshareId?: Maybe<Scalars['Float']>
}

export type CreateManyAdditionalExpenseFilesInput = {
  /** Array of records to create */
  additionalExpenseFiles: Array<AdditionalExpenseFileInput>
}

export type CreateManyPackagePricesInput = {
  /** Array of records to create */
  packagePrices: Array<PackagePriceInput>
}

export type CreateOneAdditionalExpenseFileInput = {
  /** The record to create */
  additionalExpenseFile: AdditionalExpenseFileInput
}

export type CreateOneAdditionalExpenseInput = {
  /** The record to create */
  additionalExpense: AdditionalExpenseInput
}

export type CreateOneCarBodyTypeInput = {
  /** The record to create */
  carBodyType: CarBodyTypeInput
}

export type CreateOneCarInput = {
  /** The record to create */
  car: CarInput
}

export type CreateOneCarModelInput = {
  /** The record to create */
  carModel: CarModelInput
}

export type CreateOneLocationAmenityInput = {
  /** The record to create */
  locationAmenity: CreateLocationAmenity
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

export type CreateOneUserInput = {
  /** The record to create */
  user: UserInput
}

export type CreateOneWaitingListInput = {
  /** The record to create */
  waitingList: CreateWaitingList
}

export type CreateWaitingList = {
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
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

export type DateFieldComparisonGreaterOrLess = Scalars['DateTime']

export type DeleteManyAdditionalExpenseFilesInput = {
  /** Filter to find records to delete */
  filter: AdditionalExpenseFileDeleteFilter
}

export type DeleteManyAdditionalExpensesInput = {
  /** Filter to find records to delete */
  filter: AdditionalExpenseDeleteFilter
}

export type DeleteManyCarsInput = {
  /** Filter to find records to delete */
  filter: CarDeleteFilter
}

export type DeleteManyResponse = {
  __typename?: 'DeleteManyResponse'
  /** The number of records deleted. */
  deletedCount: Scalars['Int']
}

export type DeleteOneAdditionalExpenseFileInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']
}

export type DeleteOneAdditionalExpenseInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']
}

export type DeleteOneCarInput = {
  /** The id of the record to delete. */
  id: Scalars['ID']
}

export type ExtendSubscriptionInput = {
  packagePriceId: Scalars['String']
  subscriptionId: Scalars['String']
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

export type ImageByCarDto = {
  __typename?: 'ImageByCarDTO'
  exteriorImages?: Maybe<Array<CarModelImage>>
  interiorImages?: Maybe<Array<CarModelImage>>
}

export type LocationAmenity = {
  __typename?: 'LocationAmenity'
  id: Scalars['String']
  description: Scalars['String']
  plugshareId?: Maybe<Scalars['Float']>
  locations: Array<ChargingLocation>
}

export type LocationAmenityLocationsArgs = {
  filter?: Maybe<ChargingLocationFilter>
  sorting?: Maybe<Array<ChargingLocationSort>>
}

export type LocationAmenityAggregateGroupBy = {
  __typename?: 'LocationAmenityAggregateGroupBy'
  id?: Maybe<Scalars['String']>
  plugshareId?: Maybe<Scalars['Float']>
}

export type LocationAmenityAvgAggregate = {
  __typename?: 'LocationAmenityAvgAggregate'
  plugshareId?: Maybe<Scalars['Float']>
}

export type LocationAmenityConnection = {
  __typename?: 'LocationAmenityConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<LocationAmenityEdge>
}

export type LocationAmenityCountAggregate = {
  __typename?: 'LocationAmenityCountAggregate'
  id?: Maybe<Scalars['Int']>
  plugshareId?: Maybe<Scalars['Int']>
}

export type LocationAmenityEdge = {
  __typename?: 'LocationAmenityEdge'
  /** The node containing the LocationAmenity */
  node: LocationAmenity
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type LocationAmenityFilter = {
  and?: Maybe<Array<LocationAmenityFilter>>
  or?: Maybe<Array<LocationAmenityFilter>>
  id?: Maybe<StringFieldComparison>
  plugshareId?: Maybe<NumberFieldComparison>
}

export type LocationAmenityMaxAggregate = {
  __typename?: 'LocationAmenityMaxAggregate'
  id?: Maybe<Scalars['String']>
  plugshareId?: Maybe<Scalars['Float']>
}

export type LocationAmenityMinAggregate = {
  __typename?: 'LocationAmenityMinAggregate'
  id?: Maybe<Scalars['String']>
  plugshareId?: Maybe<Scalars['Float']>
}

export type LocationAmenitySort = {
  field: LocationAmenitySortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum LocationAmenitySortFields {
  Id = 'id',
  PlugshareId = 'plugshareId',
}

export type LocationAmenitySumAggregate = {
  __typename?: 'LocationAmenitySumAggregate'
  plugshareId?: Maybe<Scalars['Float']>
}

export type Mutation = {
  __typename?: 'Mutation'
  signup: User
  updateProfile: User
  updateCreditCard: Authorize
  subscribe: Authorize
  extendSubscription: Sub
  updateMySubscription: Sub
  cancelSubscription: Sub
  createWaitingList: WaitingList
  setDefaultAddressOnUser: User
  addSubscriptionsToUser: User
  setSubscriptionsOnUser: User
  addFavoriteChargingLocationsToUser: User
  setFavoriteChargingLocationsOnUser: User
  removeDefaultAddressFromUser: User
  removeFavoriteChargingLocationsFromUser: User
  createUser: User
  updateUser: User
  addCarModelsToCarConnectorType: CarConnectorType
  setCarModelsOnCarConnectorType: CarConnectorType
  addLocationsToCarConnectorType: CarConnectorType
  setLocationsOnCarConnectorType: CarConnectorType
  setBodyTypeOnCarModel: CarModel
  setConnectorTypeOnCarModel: CarModel
  addCarsToCarModel: CarModel
  setCarsOnCarModel: CarModel
  addPricesToCarModel: CarModel
  setPricesOnCarModel: CarModel
  createCarModel: CarModel
  updateCarModel: CarModel
  setCarModelOnCar: Car
  createCar: Car
  updateCar: Car
  deleteCar: CarDeleteResponse
  deleteCars: DeleteManyResponse
  addCarModelsToCarBodyType: CarBodyType
  setCarModelsOnCarBodyType: CarBodyType
  createCarBodyType: CarBodyType
  updateCarBodyType: CarBodyType
  setUserOnSub: Sub
  setStartAddressOnSub: Sub
  setEndAddressOnSub: Sub
  setPackagePriceOnSub: Sub
  setCarOnSub: Sub
  addEventsToSub: Sub
  setEventsOnSub: Sub
  addPaymentsToSub: Sub
  setPaymentsOnSub: Sub
  addAdditionalExpensesToSub: Sub
  setAdditionalExpensesOnSub: Sub
  createSubscription: Sub
  updateSubscription: Sub
  setCarModelOnPackagePrice: PackagePrice
  createPackagePrice: PackagePrice
  createPackagePrices: Array<PackagePrice>
  setSubscriptionOnPayment: Payment
  addEventsToPayment: Payment
  setEventsOnPayment: Payment
  createPayment: Payment
  updatePackagePrice: Payment
  setPaymentOnPaymentEvent: PaymentEvent
  createPaymentEvent: PaymentEvent
  updatePaymentEvent: PaymentEvent
  setSubscriptionOnSubscriptionEvent: SubscriptionEvent
  createSubscriptionEvent: SubscriptionEvent
  updateSubscriptionEvent: SubscriptionEvent
  setSubscriptionOnAdditionalExpense: AdditionalExpense
  addFilesToAdditionalExpense: AdditionalExpense
  setFilesOnAdditionalExpense: AdditionalExpense
  createAdditionalExpense: AdditionalExpense
  updateAdditionalExpense: AdditionalExpense
  deleteOneAdditionalExpense: AdditionalExpenseDeleteResponse
  deleteManyAdditionalExpenses: DeleteManyResponse
  setAdditionalExpenseOnAdditionalExpenseFile: AdditionalExpenseFile
  removeAdditionalExpenseFromAdditionalExpenseFile: AdditionalExpenseFile
  createAdditionalExpenseFile: AdditionalExpenseFile
  createAdditionalExpenseFiles: Array<AdditionalExpenseFile>
  updateAdditionalExpenseFile: AdditionalExpenseFile
  deleteAdditionalExpenseFile: AdditionalExpenseFileDeleteResponse
  deleteAdditionalExpenseFiles: DeleteManyResponse
  addAmenitiesToChargingLocation: ChargingLocation
  setAmenitiesOnChargingLocation: ChargingLocation
  addOutletsToChargingLocation: ChargingLocation
  setOutletsOnChargingLocation: ChargingLocation
  removeAmenitiesFromChargingLocation: ChargingLocation
  removeOutletsFromChargingLocation: ChargingLocation
  addLocationsToLocationAmenity: LocationAmenity
  setLocationsOnLocationAmenity: LocationAmenity
  removeLocationsFromLocationAmenity: LocationAmenity
  createLocationAmenity: LocationAmenity
  updateLocationAmenity: LocationAmenity
}

export type MutationSignupArgs = {
  input?: Maybe<UserInputSignup>
}

export type MutationUpdateProfileArgs = {
  input: UserInputUpdate
}

export type MutationUpdateCreditCardArgs = {
  tokenCard: Scalars['String']
}

export type MutationSubscribeArgs = {
  input: SubscribeInput
}

export type MutationExtendSubscriptionArgs = {
  input: ExtendSubscriptionInput
}

export type MutationUpdateMySubscriptionArgs = {
  input: SubscriptionUpdateInput
}

export type MutationCancelSubscriptionArgs = {
  input: CancelSubscriptionInput
}

export type MutationCreateWaitingListArgs = {
  input: CreateOneWaitingListInput
}

export type MutationSetDefaultAddressOnUserArgs = {
  input: SetDefaultAddressOnUserInput
}

export type MutationAddSubscriptionsToUserArgs = {
  input: AddSubscriptionsToUserInput
}

export type MutationSetSubscriptionsOnUserArgs = {
  input: SetSubscriptionsOnUserInput
}

export type MutationAddFavoriteChargingLocationsToUserArgs = {
  input: AddFavoriteChargingLocationsToUserInput
}

export type MutationSetFavoriteChargingLocationsOnUserArgs = {
  input: SetFavoriteChargingLocationsOnUserInput
}

export type MutationRemoveDefaultAddressFromUserArgs = {
  input: RemoveDefaultAddressFromUserInput
}

export type MutationRemoveFavoriteChargingLocationsFromUserArgs = {
  input: RemoveFavoriteChargingLocationsFromUserInput
}

export type MutationCreateUserArgs = {
  input: CreateOneUserInput
}

export type MutationUpdateUserArgs = {
  input: UpdateOneUserInput
}

export type MutationAddCarModelsToCarConnectorTypeArgs = {
  input: AddCarModelsToCarConnectorTypeInput
}

export type MutationSetCarModelsOnCarConnectorTypeArgs = {
  input: SetCarModelsOnCarConnectorTypeInput
}

export type MutationAddLocationsToCarConnectorTypeArgs = {
  input: AddLocationsToCarConnectorTypeInput
}

export type MutationSetLocationsOnCarConnectorTypeArgs = {
  input: SetLocationsOnCarConnectorTypeInput
}

export type MutationSetBodyTypeOnCarModelArgs = {
  input: SetBodyTypeOnCarModelInput
}

export type MutationSetConnectorTypeOnCarModelArgs = {
  input: SetConnectorTypeOnCarModelInput
}

export type MutationAddCarsToCarModelArgs = {
  input: AddCarsToCarModelInput
}

export type MutationSetCarsOnCarModelArgs = {
  input: SetCarsOnCarModelInput
}

export type MutationAddPricesToCarModelArgs = {
  input: AddPricesToCarModelInput
}

export type MutationSetPricesOnCarModelArgs = {
  input: SetPricesOnCarModelInput
}

export type MutationCreateCarModelArgs = {
  input: CreateOneCarModelInput
}

export type MutationUpdateCarModelArgs = {
  input: UpdateOneCarModelInput
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

export type MutationDeleteCarArgs = {
  input: DeleteOneCarInput
}

export type MutationDeleteCarsArgs = {
  input: DeleteManyCarsInput
}

export type MutationAddCarModelsToCarBodyTypeArgs = {
  input: AddCarModelsToCarBodyTypeInput
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

export type MutationSetUserOnSubArgs = {
  input: SetUserOnSubInput
}

export type MutationSetStartAddressOnSubArgs = {
  input: SetStartAddressOnSubInput
}

export type MutationSetEndAddressOnSubArgs = {
  input: SetEndAddressOnSubInput
}

export type MutationSetPackagePriceOnSubArgs = {
  input: SetPackagePriceOnSubInput
}

export type MutationSetCarOnSubArgs = {
  input: SetCarOnSubInput
}

export type MutationAddEventsToSubArgs = {
  input: AddEventsToSubInput
}

export type MutationSetEventsOnSubArgs = {
  input: SetEventsOnSubInput
}

export type MutationAddPaymentsToSubArgs = {
  input: AddPaymentsToSubInput
}

export type MutationSetPaymentsOnSubArgs = {
  input: SetPaymentsOnSubInput
}

export type MutationAddAdditionalExpensesToSubArgs = {
  input: AddAdditionalExpensesToSubInput
}

export type MutationSetAdditionalExpensesOnSubArgs = {
  input: SetAdditionalExpensesOnSubInput
}

export type MutationCreateSubscriptionArgs = {
  input: CreateOneSubInput
}

export type MutationUpdateSubscriptionArgs = {
  input: UpdateOneSubInput
}

export type MutationSetCarModelOnPackagePriceArgs = {
  input: SetCarModelOnPackagePriceInput
}

export type MutationCreatePackagePriceArgs = {
  input: CreateOnePackagePriceInput
}

export type MutationCreatePackagePricesArgs = {
  input: CreateManyPackagePricesInput
}

export type MutationSetSubscriptionOnPaymentArgs = {
  input: SetSubscriptionOnPaymentInput
}

export type MutationAddEventsToPaymentArgs = {
  input: AddEventsToPaymentInput
}

export type MutationSetEventsOnPaymentArgs = {
  input: SetEventsOnPaymentInput
}

export type MutationCreatePaymentArgs = {
  input: CreateOnePaymentInput
}

export type MutationUpdatePackagePriceArgs = {
  input: UpdateOnePaymentInput
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

export type MutationSetSubscriptionOnAdditionalExpenseArgs = {
  input: SetSubscriptionOnAdditionalExpenseInput
}

export type MutationAddFilesToAdditionalExpenseArgs = {
  input: AddFilesToAdditionalExpenseInput
}

export type MutationSetFilesOnAdditionalExpenseArgs = {
  input: SetFilesOnAdditionalExpenseInput
}

export type MutationCreateAdditionalExpenseArgs = {
  input: CreateOneAdditionalExpenseInput
}

export type MutationUpdateAdditionalExpenseArgs = {
  input: UpdateOneAdditionalExpenseInput
}

export type MutationDeleteOneAdditionalExpenseArgs = {
  input: DeleteOneAdditionalExpenseInput
}

export type MutationDeleteManyAdditionalExpensesArgs = {
  input: DeleteManyAdditionalExpensesInput
}

export type MutationSetAdditionalExpenseOnAdditionalExpenseFileArgs = {
  input: SetAdditionalExpenseOnAdditionalExpenseFileInput
}

export type MutationRemoveAdditionalExpenseFromAdditionalExpenseFileArgs = {
  input: RemoveAdditionalExpenseFromAdditionalExpenseFileInput
}

export type MutationCreateAdditionalExpenseFileArgs = {
  input: CreateOneAdditionalExpenseFileInput
}

export type MutationCreateAdditionalExpenseFilesArgs = {
  input: CreateManyAdditionalExpenseFilesInput
}

export type MutationUpdateAdditionalExpenseFileArgs = {
  input: UpdateOneAdditionalExpenseFileInput
}

export type MutationDeleteAdditionalExpenseFileArgs = {
  input: DeleteOneAdditionalExpenseFileInput
}

export type MutationDeleteAdditionalExpenseFilesArgs = {
  input: DeleteManyAdditionalExpenseFilesInput
}

export type MutationAddAmenitiesToChargingLocationArgs = {
  input: AddAmenitiesToChargingLocationInput
}

export type MutationSetAmenitiesOnChargingLocationArgs = {
  input: SetAmenitiesOnChargingLocationInput
}

export type MutationAddOutletsToChargingLocationArgs = {
  input: AddOutletsToChargingLocationInput
}

export type MutationSetOutletsOnChargingLocationArgs = {
  input: SetOutletsOnChargingLocationInput
}

export type MutationRemoveAmenitiesFromChargingLocationArgs = {
  input: RemoveAmenitiesFromChargingLocationInput
}

export type MutationRemoveOutletsFromChargingLocationArgs = {
  input: RemoveOutletsFromChargingLocationInput
}

export type MutationAddLocationsToLocationAmenityArgs = {
  input: AddLocationsToLocationAmenityInput
}

export type MutationSetLocationsOnLocationAmenityArgs = {
  input: SetLocationsOnLocationAmenityInput
}

export type MutationRemoveLocationsFromLocationAmenityArgs = {
  input: RemoveLocationsFromLocationAmenityInput
}

export type MutationCreateLocationAmenityArgs = {
  input: CreateOneLocationAmenityInput
}

export type MutationUpdateLocationAmenityArgs = {
  input: UpdateOneLocationAmenityInput
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

export type PackagePrice = {
  __typename?: 'PackagePrice'
  id: Scalars['String']
  carModelId: Scalars['String']
  carModel?: Maybe<CarModel>
  duration: Scalars['String']
  disabled: Scalars['Boolean']
  price: Scalars['Float']
  description?: Maybe<Scalars['String']>
  fullPrice?: Maybe<Scalars['Float']>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type PackagePriceAggregateGroupBy = {
  __typename?: 'PackagePriceAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  carModelId?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['String']>
  disabled?: Maybe<Scalars['Boolean']>
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
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type PackagePriceCountAggregate = {
  __typename?: 'PackagePriceCountAggregate'
  id?: Maybe<Scalars['Int']>
  carModelId?: Maybe<Scalars['Int']>
  duration?: Maybe<Scalars['Int']>
  disabled?: Maybe<Scalars['Int']>
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
  carModelId?: Maybe<StringFieldComparison>
  duration?: Maybe<StringFieldComparison>
  disabled?: Maybe<BooleanFieldComparison>
  price?: Maybe<NumberFieldComparison>
}

export type PackagePriceInput = {
  carModelId: Scalars['String']
  duration: Scalars['String']
  price: Scalars['Float']
  description?: Maybe<Scalars['String']>
  fullPrice?: Maybe<Scalars['Float']>
}

export type PackagePriceMaxAggregate = {
  __typename?: 'PackagePriceMaxAggregate'
  id?: Maybe<Scalars['ID']>
  carModelId?: Maybe<Scalars['String']>
  duration?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
}

export type PackagePriceMinAggregate = {
  __typename?: 'PackagePriceMinAggregate'
  id?: Maybe<Scalars['ID']>
  carModelId?: Maybe<Scalars['String']>
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
  CarModelId = 'carModelId',
  Duration = 'duration',
  Disabled = 'disabled',
  Price = 'price',
}

export type PackagePriceSumAggregate = {
  __typename?: 'PackagePriceSumAggregate'
  price?: Maybe<Scalars['Float']>
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
  events?: Maybe<Array<PaymentEvent>>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  eventsAggregate: Array<PaymentEventsAggregateResponse>
}

export type PaymentEventsArgs = {
  filter?: Maybe<PaymentEventFilter>
  sorting?: Maybe<Array<PaymentEventSort>>
}

export type PaymentEventsAggregateArgs = {
  filter?: Maybe<PaymentEventAggregateFilter>
}

export type PaymentAggregateFilter = {
  and?: Maybe<Array<PaymentAggregateFilter>>
  or?: Maybe<Array<PaymentAggregateFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  amount?: Maybe<NumberFieldComparison>
  currency?: Maybe<StringFieldComparison>
  type?: Maybe<StringFieldComparison>
}

export type PaymentAggregateGroupBy = {
  __typename?: 'PaymentAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type PaymentAggregateResponse = {
  __typename?: 'PaymentAggregateResponse'
  groupBy?: Maybe<PaymentAggregateGroupBy>
  count?: Maybe<PaymentCountAggregate>
  sum?: Maybe<PaymentSumAggregate>
  avg?: Maybe<PaymentAvgAggregate>
  min?: Maybe<PaymentMinAggregate>
  max?: Maybe<PaymentMaxAggregate>
}

export type PaymentAvgAggregate = {
  __typename?: 'PaymentAvgAggregate'
  amount?: Maybe<Scalars['Float']>
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
  omiseTransactionId: Scalars['String']
  payment?: Maybe<Payment>
  status: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type PaymentEventAggregateFilter = {
  and?: Maybe<Array<PaymentEventAggregateFilter>>
  or?: Maybe<Array<PaymentEventAggregateFilter>>
  id?: Maybe<IdFilterComparison>
  paymentId?: Maybe<StringFieldComparison>
  omiseTransactionId?: Maybe<StringFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type PaymentEventAggregateGroupBy = {
  __typename?: 'PaymentEventAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
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
  omiseTransactionId?: Maybe<Scalars['Int']>
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
  omiseTransactionId?: Maybe<StringFieldComparison>
  status?: Maybe<StringFieldComparison>
}

export type PaymentEventInput = {
  paymentId: Scalars['String']
  omiseTransactionId: Scalars['String']
  status: Scalars['String']
}

export type PaymentEventMaxAggregate = {
  __typename?: 'PaymentEventMaxAggregate'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentEventMinAggregate = {
  __typename?: 'PaymentEventMinAggregate'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
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
  OmiseTransactionId = 'omiseTransactionId',
  Status = 'status',
}

export type PaymentEventsAggregateGroupBy = {
  __typename?: 'PaymentEventsAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentEventsAggregateResponse = {
  __typename?: 'PaymentEventsAggregateResponse'
  groupBy?: Maybe<PaymentEventsAggregateGroupBy>
  count?: Maybe<PaymentEventsCountAggregate>
  min?: Maybe<PaymentEventsMinAggregate>
  max?: Maybe<PaymentEventsMaxAggregate>
}

export type PaymentEventsCountAggregate = {
  __typename?: 'PaymentEventsCountAggregate'
  id?: Maybe<Scalars['Int']>
  paymentId?: Maybe<Scalars['Int']>
  omiseTransactionId?: Maybe<Scalars['Int']>
  status?: Maybe<Scalars['Int']>
}

export type PaymentEventsMaxAggregate = {
  __typename?: 'PaymentEventsMaxAggregate'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentEventsMinAggregate = {
  __typename?: 'PaymentEventsMinAggregate'
  id?: Maybe<Scalars['ID']>
  paymentId?: Maybe<Scalars['String']>
  omiseTransactionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type PaymentFilter = {
  and?: Maybe<Array<PaymentFilter>>
  or?: Maybe<Array<PaymentFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  amount?: Maybe<NumberFieldComparison>
  currency?: Maybe<StringFieldComparison>
  type?: Maybe<StringFieldComparison>
}

export type PaymentInput = {
  subscriptionId: Scalars['String']
  amount: Scalars['Float']
  currency: Scalars['String']
  type: Scalars['String']
  omiseId: Scalars['String']
}

export type PaymentMaxAggregate = {
  __typename?: 'PaymentMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type PaymentMinAggregate = {
  __typename?: 'PaymentMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
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
}

export type PaymentSumAggregate = {
  __typename?: 'PaymentSumAggregate'
  amount?: Maybe<Scalars['Float']>
}

export type Query = {
  __typename?: 'Query'
  me: User
  whitelisted: Scalars['Boolean']
  waitingList: WaitingListConnection
  userAggregate: Array<UserAggregateResponse>
  user?: Maybe<User>
  users: UserConnection
  carConnector?: Maybe<CarConnectorType>
  carConnectors: CarConnectorTypeConnection
  carModel?: Maybe<CarModel>
  carModels: CarModelConnection
  car?: Maybe<Car>
  cars: CarConnection
  carBodyType?: Maybe<CarBodyType>
  carBodyTypes: CarBodyTypeConnection
  subAggregate: Array<SubAggregateResponse>
  subscription?: Maybe<Sub>
  subscriptions: SubConnection
  packagePrice?: Maybe<PackagePrice>
  packagePrices: PackagePriceConnection
  paymentAggregate: Array<PaymentAggregateResponse>
  payment?: Maybe<Payment>
  payments: PaymentConnection
  paymentEvent?: Maybe<PaymentEvent>
  paymentEvents: PaymentEventConnection
  subscriptionEvent?: Maybe<SubscriptionEvent>
  subscriptionEvents: SubscriptionEventConnection
  additionalExpense?: Maybe<AdditionalExpense>
  additionalExpenses: AdditionalExpenseConnection
  additionalExpenseFile?: Maybe<AdditionalExpenseFile>
  additionalExpenseFiles: AdditionalExpenseFileConnection
  chargingLocation?: Maybe<ChargingLocation>
  chargingLocations: ChargingLocationConnection
  locationAmenity?: Maybe<LocationAmenity>
  locationAmenities: LocationAmenityConnection
}

export type QueryWhitelistedArgs = {
  email: Scalars['String']
}

export type QueryWaitingListArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<WaitingListFilter>
  sorting?: Maybe<Array<WaitingListSort>>
}

export type QueryUserAggregateArgs = {
  filter?: Maybe<UserAggregateFilter>
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type QueryUsersArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<UserFilter>
  sorting?: Maybe<Array<UserSort>>
}

export type QueryCarConnectorArgs = {
  id: Scalars['ID']
}

export type QueryCarConnectorsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<CarConnectorTypeFilter>
  sorting?: Maybe<Array<CarConnectorTypeSort>>
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

export type QuerySubAggregateArgs = {
  filter?: Maybe<SubAggregateFilter>
}

export type QuerySubscriptionArgs = {
  id: Scalars['ID']
}

export type QuerySubscriptionsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<SubFilter>
  sorting?: Maybe<Array<SubSort>>
}

export type QueryPackagePriceArgs = {
  id: Scalars['ID']
}

export type QueryPackagePricesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<PackagePriceFilter>
  sorting?: Maybe<Array<PackagePriceSort>>
}

export type QueryPaymentAggregateArgs = {
  filter?: Maybe<PaymentAggregateFilter>
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

export type QueryAdditionalExpenseArgs = {
  id: Scalars['ID']
}

export type QueryAdditionalExpensesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<AdditionalExpenseFilter>
  sorting?: Maybe<Array<AdditionalExpenseSort>>
}

export type QueryAdditionalExpenseFileArgs = {
  id: Scalars['ID']
}

export type QueryAdditionalExpenseFilesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<AdditionalExpenseFileFilter>
  sorting?: Maybe<Array<AdditionalExpenseFileSort>>
}

export type QueryChargingLocationArgs = {
  id: Scalars['ID']
}

export type QueryChargingLocationsArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<ChargingLocationFilter>
  sorting?: Maybe<Array<ChargingLocationSort>>
}

export type QueryLocationAmenityArgs = {
  id: Scalars['ID']
}

export type QueryLocationAmenitiesArgs = {
  paging?: Maybe<CursorPaging>
  filter?: Maybe<LocationAmenityFilter>
  sorting?: Maybe<Array<LocationAmenitySort>>
}

export type RemoveAdditionalExpenseFromAdditionalExpenseFileInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type RemoveAmenitiesFromChargingLocationInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type RemoveDefaultAddressFromUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type RemoveFavoriteChargingLocationsFromUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type RemoveLocationsFromLocationAmenityInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type RemoveOutletsFromChargingLocationInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetAdditionalExpenseOnAdditionalExpenseFileInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetAdditionalExpensesOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetAmenitiesOnChargingLocationInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
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

export type SetCarModelOnPackagePriceInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetCarModelsOnCarBodyTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetCarModelsOnCarConnectorTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
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
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetConnectorTypeOnCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetDefaultAddressOnUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetEndAddressOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetEventsOnPaymentInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetEventsOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetFavoriteChargingLocationsOnUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetFilesOnAdditionalExpenseInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetLocationsOnCarConnectorTypeInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetLocationsOnLocationAmenityInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetOutletsOnChargingLocationInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
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
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetPricesOnCarModelInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
}

export type SetStartAddressOnSubInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The id of relation. */
  relationId: Scalars['ID']
}

export type SetSubscriptionOnAdditionalExpenseInput = {
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

export type SetSubscriptionsOnUserInput = {
  /** The id of the record. */
  id: Scalars['ID']
  /** The ids of the relations. */
  relationIds: Array<Scalars['ID']>
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
  user: User
  packagePriceId: Scalars['String']
  carId: Scalars['String']
  parentId?: Maybe<Scalars['String']>
  car?: Maybe<Car>
  packagePrice?: Maybe<PackagePrice>
  startDate: Scalars['DateTime']
  endDate: Scalars['DateTime']
  kind: Scalars['String']
  startAddress: UserAddress
  endAddress?: Maybe<UserAddress>
  events?: Maybe<Array<SubscriptionEvent>>
  payments?: Maybe<Array<Payment>>
  additionalExpenses?: Maybe<Array<AdditionalExpense>>
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  started: Scalars['Boolean']
  completed: Scalars['Boolean']
  eventsAggregate: Array<SubEventsAggregateResponse>
  paymentsAggregate: Array<SubPaymentsAggregateResponse>
  additionalExpensesAggregate: Array<SubAdditionalExpensesAggregateResponse>
  voucher?: Maybe<Voucher>
}

export type SubEventsArgs = {
  filter?: Maybe<SubscriptionEventFilter>
  sorting?: Maybe<Array<SubscriptionEventSort>>
}

export type SubPaymentsArgs = {
  filter?: Maybe<PaymentFilter>
  sorting?: Maybe<Array<PaymentSort>>
}

export type SubAdditionalExpensesArgs = {
  filter?: Maybe<AdditionalExpenseFilter>
  sorting?: Maybe<Array<AdditionalExpenseSort>>
}

export type SubEventsAggregateArgs = {
  filter?: Maybe<SubscriptionEventAggregateFilter>
}

export type SubPaymentsAggregateArgs = {
  filter?: Maybe<PaymentAggregateFilter>
}

export type SubAdditionalExpensesAggregateArgs = {
  filter?: Maybe<AdditionalExpenseAggregateFilter>
}

export type SubAdditionalExpensesAggregateGroupBy = {
  __typename?: 'SubAdditionalExpensesAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
}

export type SubAdditionalExpensesAggregateResponse = {
  __typename?: 'SubAdditionalExpensesAggregateResponse'
  groupBy?: Maybe<SubAdditionalExpensesAggregateGroupBy>
  count?: Maybe<SubAdditionalExpensesCountAggregate>
  sum?: Maybe<SubAdditionalExpensesSumAggregate>
  avg?: Maybe<SubAdditionalExpensesAvgAggregate>
  min?: Maybe<SubAdditionalExpensesMinAggregate>
  max?: Maybe<SubAdditionalExpensesMaxAggregate>
}

export type SubAdditionalExpensesAvgAggregate = {
  __typename?: 'SubAdditionalExpensesAvgAggregate'
  price?: Maybe<Scalars['Float']>
}

export type SubAdditionalExpensesCountAggregate = {
  __typename?: 'SubAdditionalExpensesCountAggregate'
  id?: Maybe<Scalars['Int']>
  subscriptionId?: Maybe<Scalars['Int']>
  price?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['Int']>
  noticeDate?: Maybe<Scalars['Int']>
  status?: Maybe<Scalars['Int']>
}

export type SubAdditionalExpensesMaxAggregate = {
  __typename?: 'SubAdditionalExpensesMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
}

export type SubAdditionalExpensesMinAggregate = {
  __typename?: 'SubAdditionalExpensesMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
  noticeDate?: Maybe<Scalars['DateTime']>
  status?: Maybe<Scalars['String']>
}

export type SubAdditionalExpensesSumAggregate = {
  __typename?: 'SubAdditionalExpensesSumAggregate'
  price?: Maybe<Scalars['Float']>
}

export type SubAggregateFilter = {
  and?: Maybe<Array<SubAggregateFilter>>
  or?: Maybe<Array<SubAggregateFilter>>
  id?: Maybe<IdFilterComparison>
  userId?: Maybe<StringFieldComparison>
  packagePriceId?: Maybe<StringFieldComparison>
  carId?: Maybe<StringFieldComparison>
  parentId?: Maybe<StringFieldComparison>
  startDate?: Maybe<DateFieldComparison>
  endDate?: Maybe<DateFieldComparison>
  kind?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
}

export type SubAggregateGroupBy = {
  __typename?: 'SubAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  parentId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubAggregateResponse = {
  __typename?: 'SubAggregateResponse'
  groupBy?: Maybe<SubAggregateGroupBy>
  count?: Maybe<SubCountAggregate>
  min?: Maybe<SubMinAggregate>
  max?: Maybe<SubMaxAggregate>
}

export type SubConnection = {
  __typename?: 'SubConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<SubEdge>
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type SubCountAggregate = {
  __typename?: 'SubCountAggregate'
  id?: Maybe<Scalars['Int']>
  userId?: Maybe<Scalars['Int']>
  packagePriceId?: Maybe<Scalars['Int']>
  carId?: Maybe<Scalars['Int']>
  parentId?: Maybe<Scalars['Int']>
  startDate?: Maybe<Scalars['Int']>
  endDate?: Maybe<Scalars['Int']>
  kind?: Maybe<Scalars['Int']>
  createdAt?: Maybe<Scalars['Int']>
}

export type SubEdge = {
  __typename?: 'SubEdge'
  /** The node containing the Sub */
  node: Sub
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type SubEventsAggregateGroupBy = {
  __typename?: 'SubEventsAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubEventsAggregateResponse = {
  __typename?: 'SubEventsAggregateResponse'
  groupBy?: Maybe<SubEventsAggregateGroupBy>
  count?: Maybe<SubEventsCountAggregate>
  min?: Maybe<SubEventsMinAggregate>
  max?: Maybe<SubEventsMaxAggregate>
}

export type SubEventsCountAggregate = {
  __typename?: 'SubEventsCountAggregate'
  id?: Maybe<Scalars['Int']>
  subscriptionId?: Maybe<Scalars['Int']>
  status?: Maybe<Scalars['Int']>
  createdAt?: Maybe<Scalars['Int']>
}

export type SubEventsMaxAggregate = {
  __typename?: 'SubEventsMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubEventsMinAggregate = {
  __typename?: 'SubEventsMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubFilter = {
  and?: Maybe<Array<SubFilter>>
  or?: Maybe<Array<SubFilter>>
  id?: Maybe<IdFilterComparison>
  userId?: Maybe<StringFieldComparison>
  packagePriceId?: Maybe<StringFieldComparison>
  carId?: Maybe<StringFieldComparison>
  parentId?: Maybe<StringFieldComparison>
  startDate?: Maybe<DateFieldComparison>
  endDate?: Maybe<DateFieldComparison>
  kind?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
  car?: Maybe<SubFilterCarFilter>
  packagePrice?: Maybe<SubFilterPackagePriceFilter>
  user?: Maybe<SubFilterUserFilter>
  events?: Maybe<SubFilterSubscriptionEventFilter>
  voucher?: Maybe<SubFilterVoucherFilter>
}

export type SubFilterCarFilter = {
  and?: Maybe<Array<SubFilterCarFilter>>
  or?: Maybe<Array<SubFilterCarFilter>>
  id?: Maybe<IdFilterComparison>
  vin?: Maybe<StringFieldComparison>
  plateNumber?: Maybe<StringFieldComparison>
  carModelId?: Maybe<StringFieldComparison>
  color?: Maybe<StringFieldComparison>
  carTrackId?: Maybe<StringFieldComparison>
}

export type SubFilterPackagePriceFilter = {
  and?: Maybe<Array<SubFilterPackagePriceFilter>>
  or?: Maybe<Array<SubFilterPackagePriceFilter>>
  id?: Maybe<IdFilterComparison>
  carModelId?: Maybe<StringFieldComparison>
  duration?: Maybe<StringFieldComparison>
  disabled?: Maybe<BooleanFieldComparison>
  price?: Maybe<NumberFieldComparison>
}

export type SubFilterSubscriptionEventFilter = {
  and?: Maybe<Array<SubFilterSubscriptionEventFilter>>
  or?: Maybe<Array<SubFilterSubscriptionEventFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  status?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
}

export type SubFilterUserFilter = {
  and?: Maybe<Array<SubFilterUserFilter>>
  or?: Maybe<Array<SubFilterUserFilter>>
  id?: Maybe<StringFieldComparison>
  firebaseId?: Maybe<StringFieldComparison>
  firstName?: Maybe<StringFieldComparison>
  lastName?: Maybe<StringFieldComparison>
  role?: Maybe<StringFieldComparison>
  disabled?: Maybe<BooleanFieldComparison>
  phoneNumber?: Maybe<StringFieldComparison>
  email?: Maybe<StringFieldComparison>
  kycStatus?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
  updatedAt?: Maybe<DateFieldComparison>
}

export type SubFilterVoucherFilter = {
  and?: Maybe<Array<SubFilterVoucherFilter>>
  or?: Maybe<Array<SubFilterVoucherFilter>>
  code?: Maybe<StringFieldComparison>
}

export type SubMaxAggregate = {
  __typename?: 'SubMaxAggregate'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  parentId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubMinAggregate = {
  __typename?: 'SubMinAggregate'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  parentId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubPaymentsAggregateGroupBy = {
  __typename?: 'SubPaymentsAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type SubPaymentsAggregateResponse = {
  __typename?: 'SubPaymentsAggregateResponse'
  groupBy?: Maybe<SubPaymentsAggregateGroupBy>
  count?: Maybe<SubPaymentsCountAggregate>
  sum?: Maybe<SubPaymentsSumAggregate>
  avg?: Maybe<SubPaymentsAvgAggregate>
  min?: Maybe<SubPaymentsMinAggregate>
  max?: Maybe<SubPaymentsMaxAggregate>
}

export type SubPaymentsAvgAggregate = {
  __typename?: 'SubPaymentsAvgAggregate'
  amount?: Maybe<Scalars['Float']>
}

export type SubPaymentsCountAggregate = {
  __typename?: 'SubPaymentsCountAggregate'
  id?: Maybe<Scalars['Int']>
  subscriptionId?: Maybe<Scalars['Int']>
  amount?: Maybe<Scalars['Int']>
  currency?: Maybe<Scalars['Int']>
  type?: Maybe<Scalars['Int']>
}

export type SubPaymentsMaxAggregate = {
  __typename?: 'SubPaymentsMaxAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type SubPaymentsMinAggregate = {
  __typename?: 'SubPaymentsMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type SubPaymentsSumAggregate = {
  __typename?: 'SubPaymentsSumAggregate'
  amount?: Maybe<Scalars['Float']>
}

export type SubSort = {
  field: SubSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export type SubOrder = {
  [key: string]: SortDirection
}

export enum SubSortFields {
  Id = 'id',
  UserId = 'userId',
  PackagePriceId = 'packagePriceId',
  CarId = 'carId',
  ParentId = 'parentId',
  StartDate = 'startDate',
  EndDate = 'endDate',
  Kind = 'kind',
  CreatedAt = 'createdAt',
}

export type SubscribeInput = {
  packagePriceId: Scalars['String']
  startDate: Scalars['DateTime']
  tokenCard?: Maybe<Scalars['String']>
  startAddress: UserAddressInput
  endAddress?: Maybe<UserAddressInput>
  modelId: Scalars['String']
  color: Scalars['String']
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

export type SubscriptionEventAggregateFilter = {
  and?: Maybe<Array<SubscriptionEventAggregateFilter>>
  or?: Maybe<Array<SubscriptionEventAggregateFilter>>
  id?: Maybe<IdFilterComparison>
  subscriptionId?: Maybe<StringFieldComparison>
  status?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
}

export type SubscriptionEventAggregateGroupBy = {
  __typename?: 'SubscriptionEventAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
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
  createdAt?: Maybe<Scalars['Int']>
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
  createdAt?: Maybe<DateFieldComparison>
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
  createdAt?: Maybe<Scalars['DateTime']>
}

export type SubscriptionEventMinAggregate = {
  __typename?: 'SubscriptionEventMinAggregate'
  id?: Maybe<Scalars['ID']>
  subscriptionId?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
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
  CreatedAt = 'createdAt',
}

export type SubscriptionInput = {
  userId: Scalars['String']
  carId: Scalars['String']
  packagePriceId: Scalars['String']
  startDate: Scalars['DateTime']
  endDate: Scalars['DateTime']
  kind: Scalars['String']
  startAddressId: Scalars['String']
  endAddressId: Scalars['String']
}

export type SubscriptionPartialUpdateInput = {
  userId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  startAddressId?: Maybe<Scalars['String']>
  endAddressId?: Maybe<Scalars['String']>
}

export type SubscriptionUpdateInput = {
  subscriptionId: Scalars['String']
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  startAddress?: Maybe<UserAddressInput>
  endAddress?: Maybe<UserAddressInput>
}

export type UpdateLocationAmenity = {
  id?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  plugshareId?: Maybe<Scalars['Float']>
}

export type UpdateOneAdditionalExpenseFileInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: AdditionalExpenseFileInput
}

export type UpdateOneAdditionalExpenseInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: AdditionalExpenseUpdateInput
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

export type UpdateOneCarStatusInput = {
  /** The id of the record to update */
  carId: Scalars['ID']
  /** The update to apply. */
  status: Scalars['String']
}

export type UpdateOneCarModelInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: CarModelInput
}

export type UpdateOneLocationAmenityInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: UpdateLocationAmenity
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
  update: SubscriptionPartialUpdateInput
}

export type UpdateOneSubscriptionEventInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: SubscriptionEventInput
}

export type UpdateOneUserInput = {
  /** The id of the record to update */
  id: Scalars['ID']
  /** The update to apply. */
  update: UserInput
}

export type SubscriptionUpdatePlateInput = {
  /** The id of the record to update */
  subscriptionId: Scalars['String']
  /** The update to apply. */
  carId: Scalars['String']
}

export type UserGroupDeleteInput = {
  id: Scalars['String']
}

export type UserGroupInput = {
  id?: Maybe<Scalars['String']>
  name: Scalars['String']
}

export type ManualExtendSubscriptionInput = {
  subscriptionId: Scalars['String']
  returnDate: Scalars['DateTime']
}

export type SendDataViaEmailInput = {
  emails: Array<Scalars['String']>
  columns: Array<Scalars['String']>
}

export type RefId = {
  id: Scalars['ID']
}

export type RefIdAndRelationIds = {
  id: Scalars['ID']
  relationIds: Array<Scalars['ID']>
}

export type User = {
  __typename?: 'User'
  id: Scalars['String']
  firebaseId: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  role: Scalars['String']
  subscriptions?: Maybe<Array<Sub>>
  disabled: Scalars['Boolean']
  phoneNumber?: Maybe<Scalars['String']>
  email: Scalars['String']
  omiseId?: Maybe<Scalars['String']>
  carTrackId?: Maybe<Scalars['String']>
  defaultAddress?: Maybe<UserAddress>
  favoriteChargingLocations?: Maybe<Array<ChargingLocation>>
  kycStatus: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
  creditCard?: Maybe<UserCreditCard>
  tokenKyc?: Maybe<Scalars['String']>
  subscriptionsAggregate: Array<UserSubscriptionsAggregateResponse>
  favoriteChargingLocationsAggregate: Array<UserFavoriteChargingLocationsAggregateResponse>
  userGroups: Array<UserGroup>
}

export type UserSubscriptionsArgs = {
  filter?: Maybe<SubFilter>
  sorting?: Maybe<Array<SubSort>>
}

export type UserFavoriteChargingLocationsArgs = {
  filter?: Maybe<ChargingLocationFilter>
  sorting?: Maybe<Array<ChargingLocationSort>>
}

export type UserSubscriptionsAggregateArgs = {
  filter?: Maybe<SubAggregateFilter>
}

export type UserFavoriteChargingLocationsAggregateArgs = {
  filter?: Maybe<ChargingLocationAggregateFilter>
}

export type UserAddress = {
  __typename?: 'UserAddress'
  id: Scalars['String']
  full: Scalars['String']
  latitude: Scalars['Float']
  longitude: Scalars['Float']
  remark?: Maybe<Scalars['String']>
  user: User
}

export type UserAddressInput = {
  id?: Maybe<Scalars['String']>
  userId?: Maybe<Scalars['String']>
  full?: Maybe<Scalars['String']>
  latitude?: Maybe<Scalars['Float']>
  longitude?: Maybe<Scalars['Float']>
  remark?: Maybe<Scalars['String']>
}

export type UserAggregateFilter = {
  and?: Maybe<Array<UserAggregateFilter>>
  or?: Maybe<Array<UserAggregateFilter>>
  id?: Maybe<StringFieldComparison>
  firebaseId?: Maybe<StringFieldComparison>
  firstName?: Maybe<StringFieldComparison>
  lastName?: Maybe<StringFieldComparison>
  role?: Maybe<StringFieldComparison>
  disabled?: Maybe<BooleanFieldComparison>
  phoneNumber?: Maybe<StringFieldComparison>
  email?: Maybe<StringFieldComparison>
  kycStatus?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
  updatedAt?: Maybe<DateFieldComparison>
}

export type UserAggregateGroupBy = {
  __typename?: 'UserAggregateGroupBy'
  id?: Maybe<Scalars['String']>
  firebaseId?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  role?: Maybe<Scalars['String']>
  disabled?: Maybe<Scalars['Boolean']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  kycStatus?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UserAggregateResponse = {
  __typename?: 'UserAggregateResponse'
  groupBy?: Maybe<UserAggregateGroupBy>
  count?: Maybe<UserCountAggregate>
  min?: Maybe<UserMinAggregate>
  max?: Maybe<UserMaxAggregate>
}

export type UserConnection = {
  __typename?: 'UserConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<UserEdge>
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type UserCountAggregate = {
  __typename?: 'UserCountAggregate'
  id?: Maybe<Scalars['Int']>
  firebaseId?: Maybe<Scalars['Int']>
  firstName?: Maybe<Scalars['Int']>
  lastName?: Maybe<Scalars['Int']>
  role?: Maybe<Scalars['Int']>
  disabled?: Maybe<Scalars['Int']>
  phoneNumber?: Maybe<Scalars['Int']>
  email?: Maybe<Scalars['Int']>
  kycStatus?: Maybe<Scalars['Int']>
  createdAt?: Maybe<Scalars['Int']>
  updatedAt?: Maybe<Scalars['Int']>
}

export type UserCreditCard = {
  __typename?: 'UserCreditCard'
  brand: Scalars['String']
  lastDigits: Scalars['String']
  expirationMonth: Scalars['Float']
  expirationYear: Scalars['Float']
  name: Scalars['String']
}

export type UserEdge = {
  __typename?: 'UserEdge'
  /** The node containing the User */
  node: User
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type UserFavoriteChargingLocationsAggregateGroupBy = {
  __typename?: 'UserFavoriteChargingLocationsAggregateGroupBy'
  id?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
}

export type UserFavoriteChargingLocationsAggregateResponse = {
  __typename?: 'UserFavoriteChargingLocationsAggregateResponse'
  groupBy?: Maybe<UserFavoriteChargingLocationsAggregateGroupBy>
  count?: Maybe<UserFavoriteChargingLocationsCountAggregate>
  min?: Maybe<UserFavoriteChargingLocationsMinAggregate>
  max?: Maybe<UserFavoriteChargingLocationsMaxAggregate>
}

export type UserFavoriteChargingLocationsCountAggregate = {
  __typename?: 'UserFavoriteChargingLocationsCountAggregate'
  id?: Maybe<Scalars['Int']>
  provider?: Maybe<Scalars['Int']>
  address?: Maybe<Scalars['Int']>
  name?: Maybe<Scalars['Int']>
  externalId?: Maybe<Scalars['Int']>
}

export type UserFavoriteChargingLocationsMaxAggregate = {
  __typename?: 'UserFavoriteChargingLocationsMaxAggregate'
  id?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
}

export type UserFavoriteChargingLocationsMinAggregate = {
  __typename?: 'UserFavoriteChargingLocationsMinAggregate'
  id?: Maybe<Scalars['String']>
  provider?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  externalId?: Maybe<Scalars['String']>
}

export type UserFilter = {
  and?: Maybe<Array<UserFilter>>
  or?: Maybe<Array<UserFilter>>
  id?: Maybe<StringFieldComparison>
  firebaseId?: Maybe<StringFieldComparison>
  firstName?: Maybe<StringFieldComparison>
  lastName?: Maybe<StringFieldComparison>
  role?: Maybe<StringFieldComparison>
  disabled?: Maybe<BooleanFieldComparison>
  phoneNumber?: Maybe<StringFieldComparison>
  email?: Maybe<StringFieldComparison>
  kycStatus?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
  updatedAt?: Maybe<DateFieldComparison>
}

export type UserInput = {
  firebaseId: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber: Scalars['String']
  email: Scalars['String']
  omiseId: Scalars['String']
  carTrackId: Scalars['String']
  disabled: Scalars['Boolean']
  defaultAddress: UserAddressInput
}

export type UserInputSignup = {
  phoneNumber?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
}

export type UserInputUpdate = {
  phoneNumber?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  defaultAddress?: Maybe<UserAddressInput>
}

export type UserMaxAggregate = {
  __typename?: 'UserMaxAggregate'
  id?: Maybe<Scalars['String']>
  firebaseId?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  role?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  kycStatus?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UserMinAggregate = {
  __typename?: 'UserMinAggregate'
  id?: Maybe<Scalars['String']>
  firebaseId?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  role?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  kycStatus?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UserSort = {
  field: UserSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum UserSortFields {
  Id = 'id',
  FirebaseId = 'firebaseId',
  FirstName = 'firstName',
  LastName = 'lastName',
  Role = 'role',
  Disabled = 'disabled',
  PhoneNumber = 'phoneNumber',
  Email = 'email',
  KycStatus = 'kycStatus',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
}

export type UserSubscriptionsAggregateGroupBy = {
  __typename?: 'UserSubscriptionsAggregateGroupBy'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  parentId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type UserSubscriptionsAggregateResponse = {
  __typename?: 'UserSubscriptionsAggregateResponse'
  groupBy?: Maybe<UserSubscriptionsAggregateGroupBy>
  count?: Maybe<UserSubscriptionsCountAggregate>
  min?: Maybe<UserSubscriptionsMinAggregate>
  max?: Maybe<UserSubscriptionsMaxAggregate>
}

export type UserSubscriptionsCountAggregate = {
  __typename?: 'UserSubscriptionsCountAggregate'
  id?: Maybe<Scalars['Int']>
  userId?: Maybe<Scalars['Int']>
  packagePriceId?: Maybe<Scalars['Int']>
  carId?: Maybe<Scalars['Int']>
  parentId?: Maybe<Scalars['Int']>
  startDate?: Maybe<Scalars['Int']>
  endDate?: Maybe<Scalars['Int']>
  kind?: Maybe<Scalars['Int']>
  createdAt?: Maybe<Scalars['Int']>
}

export type UserSubscriptionsMaxAggregate = {
  __typename?: 'UserSubscriptionsMaxAggregate'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  parentId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type UserSubscriptionsMinAggregate = {
  __typename?: 'UserSubscriptionsMinAggregate'
  id?: Maybe<Scalars['ID']>
  userId?: Maybe<Scalars['String']>
  packagePriceId?: Maybe<Scalars['String']>
  carId?: Maybe<Scalars['String']>
  parentId?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['DateTime']>
  endDate?: Maybe<Scalars['DateTime']>
  kind?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
}

export type WaitingList = {
  __typename?: 'WaitingList'
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email: Scalars['String']
}

export type WaitingListAggregateGroupBy = {
  __typename?: 'WaitingListAggregateGroupBy'
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type WaitingListConnection = {
  __typename?: 'WaitingListConnection'
  /** Paging information */
  pageInfo: PageInfo
  /** Array of edges. */
  edges: Array<WaitingListEdge>
  /** Fetch total count of records */
  totalCount: Scalars['Int']
}

export type WaitingListCountAggregate = {
  __typename?: 'WaitingListCountAggregate'
  firstName?: Maybe<Scalars['Int']>
  lastName?: Maybe<Scalars['Int']>
  phoneNumber?: Maybe<Scalars['Int']>
  email?: Maybe<Scalars['Int']>
}

export type WaitingListEdge = {
  __typename?: 'WaitingListEdge'
  /** The node containing the WaitingList */
  node: WaitingList
  /** Cursor for this node. */
  cursor: Scalars['ConnectionCursor']
}

export type WaitingListFilter = {
  and?: Maybe<Array<WaitingListFilter>>
  or?: Maybe<Array<WaitingListFilter>>
  firstName?: Maybe<StringFieldComparison>
  lastName?: Maybe<StringFieldComparison>
  phoneNumber?: Maybe<StringFieldComparison>
  email?: Maybe<StringFieldComparison>
}

export type WaitingListMaxAggregate = {
  __typename?: 'WaitingListMaxAggregate'
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type WaitingListMinAggregate = {
  __typename?: 'WaitingListMinAggregate'
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type WaitingListSort = {
  field: WaitingListSortFields
  direction: SortDirection
  nulls?: Maybe<SortNulls>
}

export enum WaitingListSortFields {
  FirstName = 'firstName',
  LastName = 'lastName',
  PhoneNumber = 'phoneNumber',
  Email = 'email',
}

export type UserGroup = {
  __typename?: 'UserGroup'
  id: Scalars['String']
  name: Scalars['String']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type Voucher = {
  __typename?: 'Voucher'
  id: Scalars['String']
  code: Scalars['String']
  descriptionEn: Scalars['String'] | undefined
  descriptionTh: Scalars['String'] | undefined
  percentDiscount: Scalars['Int']
  amount: Scalars['Int']
  limitPerUser: Scalars['Int']
  isAllPackages: Scalars['Boolean']
  userGroups: Array<UserGroup>
  packagePrices: Array<PackagePrice>
  startAt: Scalars['DateTime']
  endAt: Scalars['DateTime']
  createdAt: Scalars['DateTime']
  updatedAt: Scalars['DateTime']
}

export type VoucherInput = {
  id?: Maybe<Scalars['ID']>
  code?: Maybe<Scalars['String']>
  descriptionEn?: Maybe<Scalars['String']>
  descriptionTh?: Maybe<Scalars['String']>
  percentDiscount?: Maybe<Scalars['Float']>
  amount?: Maybe<Scalars['Float']>
  limitPerUser?: Maybe<Scalars['Float']>
  isAllPackages?: Maybe<Scalars['Boolean']>
  startAt?: Maybe<Scalars['DateTime']>
  endAt?: Maybe<Scalars['DateTime']>
}

export type VoucherFilter = {
  and?: Maybe<Array<UserFilter>>
  or?: Maybe<Array<UserFilter>>
  id?: Maybe<StringFieldComparison>
  firebaseId?: Maybe<StringFieldComparison>
  firstName?: Maybe<StringFieldComparison>
  lastName?: Maybe<StringFieldComparison>
  role?: Maybe<StringFieldComparison>
  disabled?: Maybe<BooleanFieldComparison>
  phoneNumber?: Maybe<StringFieldComparison>
  email?: Maybe<StringFieldComparison>
  kycStatus?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
  updatedAt?: Maybe<DateFieldComparison>
}

export type VoucherEventsInput = {
  __typename?: 'VoucherEventsInput'
  voucherId?: Maybe<Scalars['ID']>
  userId: Scalars['ID']
  event: Scalars['String']
  code: Scalars['String']
  descriptionEn: Scalars['String']
  descriptionTh: Scalars['String']
  percentDiscount: Scalars['Int']
  amount: Scalars['Int']
  limitPerUser: Scalars['Int']
  startAt: Scalars['DateTime']
  endAt: Scalars['DateTime']
  isAllPackages: Scalars['Boolean']
}

export type UserGroupFilter = {
  and?: Maybe<Array<UserFilter>>
  or?: Maybe<Array<UserFilter>>
  id?: Maybe<StringFieldComparison>
  name?: Maybe<StringFieldComparison>
  createdAt?: Maybe<DateFieldComparison>
  updatedAt?: Maybe<DateFieldComparison>
}
