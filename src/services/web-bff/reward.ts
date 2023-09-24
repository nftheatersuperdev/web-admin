import { AdminBffAPI } from 'api/admin-bff'
import { CreateRewardRequest, Reward } from './reward-type'

export const getRewardList = async (): Promise<Reward[]> => {
  const response = await AdminBffAPI.get('/v1/rewards')
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const createReward = async (data: CreateRewardRequest): Promise<Response> => {
  const response = await AdminBffAPI.post('/v1/reward', data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response
}
