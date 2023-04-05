export enum ActivityServices {
  Subscription = 'subscription',
  PreventiveMaintenance = 'preventiveMaintenance',
  Reserved = 'reserved',
  PR = 'PR',
  Marketing = 'marketing',
  Breakdown = 'breakdown',
  Repair = 'repair',
  Internal = 'internal',
  Carpool = 'carpool',
  B2BDelivered = 'b2bDelivered',
  B2BPendingDelivered = 'b2bPendingDelivered',
  RedPlate = 'redPlate',
  Other = 'other',
}

export interface ActivityService {
  id: string
  label: string
}
