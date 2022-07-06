import { TFunction, Namespace } from 'react-i18next'

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

export const useActivityServiceList = (t: TFunction<Namespace>): ActivityService[] => {
  const services: ActivityService[] = [
    {
      id: 'subscription',
      label: t('carActivity.statuses.subscription'),
    },
    {
      id: 'preventiveMaintenance',
      label: t('carActivity.statuses.preventiveMaintenance'),
    },
    {
      id: 'reserved',
      label: t('carActivity.statuses.reserved'),
    },
    {
      id: 'pr',
      label: t('carActivity.statuses.pr'),
    },
    {
      id: 'marketing',
      label: t('carActivity.statuses.marketing'),
    },
    {
      id: 'breakdown',
      label: t('carActivity.statuses.breakdown'),
    },
    {
      id: 'repair',
      label: t('carActivity.statuses.repair'),
    },
    {
      id: 'internal',
      label: t('carActivity.statuses.internal'),
    },
    {
      id: 'carpool',
      label: t('carActivity.statuses.carpool'),
    },
    {
      id: 'b2bDelivered',
      label: t('carActivity.statuses.b2bDelivered'),
    },
    {
      id: 'b2bPendingDelivered',
      label: t('carActivity.statuses.b2bPendingDelivered'),
    },
    {
      id: 'redPlate',
      label: t('carActivity.statuses.redPlate'),
    },
    {
      id: 'other',
      label: t('carActivity.statuses.other'),
    },
  ]
  return services
}

export const getServiceLabel = (service: string, t: TFunction<Namespace>): string => {
  switch (service) {
    case ActivityServices.Subscription: {
      return t('carActivity.statuses.subscription')
    }
    case ActivityServices.PreventiveMaintenance: {
      return t('carActivity.statuses.preventiveMaintenance')
    }
    case ActivityServices.Reserved: {
      return t('carActivity.statuses.reserved')
    }
    case ActivityServices.PR: {
      return t('carActivity.statuses.pr')
    }
    case ActivityServices.Marketing: {
      return t('carActivity.statuses.marketing')
    }
    case ActivityServices.Breakdown: {
      return t('carActivity.statuses.breakdown')
    }
    case ActivityServices.Repair: {
      return t('carActivity.statuses.repair')
    }
    case ActivityServices.Internal: {
      return t('carActivity.statuses.internal')
    }
    case ActivityServices.Carpool: {
      return t('carActivity.statuses.carpool')
    }
    case ActivityServices.B2BDelivered: {
      return t('carActivity.statuses.b2bDelivered')
    }
    case ActivityServices.B2BPendingDelivered: {
      return t('carActivity.statuses.b2bPendingDelivered')
    }
    case ActivityServices.RedPlate: {
      return t('carActivity.statuses.redPlate')
    }
    case ActivityServices.Other: {
      return t('carActivity.statuses.other')
    }
  }
  return ''
}
