import { graphql } from 'msw'
import getCars from './mockData/getCars.json'

export const mockHandlers = [
  // ===========================================================================
  // EVme API
  // ===========================================================================
  graphql.query('GetCars', (_req, res, ctx) => {
    return res(ctx.data(getCars))
  }),
]
