import { rest } from 'msw'

export const mockHandlers = [
  // ===========================================================================
  // Auth0
  // ===========================================================================
  rest.get(`firebase-url`, (_req, res, ctx) => {
    return res(ctx.json({ test: 'hello world' }))
  }),
]
