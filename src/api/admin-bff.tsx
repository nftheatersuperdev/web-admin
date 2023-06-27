/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable no-restricted-imports */
import config from 'config'
import axios from 'axios'
import ls from 'localstorage-slim'
import { browserName } from 'react-device-detect'
import { STORAGE_KEYS } from 'auth/AuthContext'
import { fetchIpAddress } from 'components/GetIpAddress'
import { version } from '../../package.json'

export const AdminBffAPI = axios.create({
  baseURL: config.evmeAdminBff,
})

AdminBffAPI.interceptors.request.use(
  async (config) => {
    const token = ls.get<string | null | undefined>(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const ipAddress = await fetchIpAddress()
    if (ipAddress) {
      config.headers['x-forwarded-for'] = ipAddress
    }
    const timestamp = Math.floor(+new Date() / 1000)
    config.headers.timestamp = timestamp
    config.headers.user_agent = browserName
    config.headers.application_version = version
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

AdminBffAPI.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error.response.data)
  }
)
