export interface Reward {
  id: string
  rewardName: string
  rewardValue: string
  redeemPoint: number
  isActive: boolean
}

export interface CreateRewardRequest {
  rewardName: string
  redeemPoint: number
  rewardValue: string
}
