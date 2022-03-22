/* eslint-disable @typescript-eslint/no-explicit-any */
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export interface StringFieldComparison {
  is?: Maybe<boolean>
  isNot?: Maybe<boolean>
  eq?: Maybe<string>
  neq?: Maybe<string>
  gt?: Maybe<string>
  gte?: Maybe<string>
  lt?: Maybe<string>
  lte?: Maybe<string>
  like?: Maybe<string>
  notLike?: Maybe<string>
  iLike?: Maybe<string>
  notILike?: Maybe<string>
  in?: Maybe<string[]>
  notIn?: Maybe<string[]>
}

export interface NumberFieldComparison {
  is?: Maybe<boolean>
  isNot?: Maybe<boolean>
  eq?: Maybe<number>
  neq?: Maybe<number>
  gt?: Maybe<number>
  gte?: Maybe<number>
  lt?: Maybe<number>
  lte?: Maybe<number>
  like?: Maybe<number>
  notLike?: Maybe<number>
  iLike?: Maybe<number>
  notILike?: Maybe<number>
  in?: Maybe<number[]>
  notIn?: Maybe<number[]>
}

export interface DateRangeFieldComparison {
  startDate: any
  endDate: any
}

export interface BooleanFieldComparison {
  is?: Maybe<boolean>
  isNot?: Maybe<boolean>
}
