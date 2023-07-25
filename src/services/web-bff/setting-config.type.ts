import { Pagination } from 'services/web-bff/response.type'

export interface SystemConfig {
  configId: string
  configName: string
  configValue: string
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
}
export interface SystemConfigResponse extends Response {
  data: {
    config: SystemConfig[]
    pagination: Pagination
  }
}

export interface SystemConfigInputRequest {
  configName?: string
  startCreatedDate?: string
  endCreatedDate?: string
  startUpdatedDate?: string
  endUpdatedDate?: string
}

export interface SystemConfigListRequest {
  data?: SystemConfigInputRequest
  page?: number
  size?: number
}

export interface SystemConfigListProps {
  configName?: string
  startCreatedDate?: string
  endCreatedDate?: string
  startUpdatedDate?: string
  endUpdatedDate?: string
  size?: number
  page?: number
}
