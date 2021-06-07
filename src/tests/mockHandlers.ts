import { graphql } from 'msw'
import getCars from './mockData/getCars.json'
import getSubscriptions from './mockData/getSubscriptions.json'
import getAdditionalExpenses from './mockData/getAdditionalExpenses.json'

export const mockHandlers = [
  // ===========================================================================
  // EVme API
  // ===========================================================================
  graphql.query('GetCars', (_req, res, ctx) => {
    return res(ctx.data(getCars))
  }),

  graphql.query('GetAnyThingHereToFake', (_req, res, ctx) => {
    const fakeData = {
      name: ' Long',
      age: 20,
    }
    return res(
      ctx.data({
        login: {
          fakeData,
        },
      })
    )
  }),

  graphql.query('GetSubscriptions', (_req, res, ctx) => {
    return res(ctx.data(getSubscriptions))
  }),

  graphql.query('GetExpenses', (_req, res, ctx) => {
    return res(ctx.data(getAdditionalExpenses))
  }),

  graphql.mutation('createCar', (_req, res, ctx) => {
    return res(
      ctx.data({
        createCar: {
          id: 'vjojfwe-fakeId',
        },
      })
    )
  }),

  graphql.mutation('addCarsToCarModel', (_req, res, ctx) => {
    return res(
      ctx.data({
        addCarsToCarModel: {
          id: 'vjojfwe-fakeId',
          brand: 'fake brand',
          model: 'fake model',
        },
      })
    )
  }),
  // INFO: Keep this error for testing failed cases
  // return res(
  //   ctx.errors([
  //     {
  //       message: 'Fake error',
  //       errorType: 'FakeError',
  //     },
  //   ])
  // )
]
