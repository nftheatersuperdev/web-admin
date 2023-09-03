/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable no-restricted-imports */
import config from 'config'
import axios from 'axios'
import ls from 'localstorage-slim'
import { browserName } from 'react-device-detect'
import { STORAGE_KEYS } from 'auth/AuthContext'
import packageInfo from '../../package.json'

export const AdminBffAPI = axios.create({
  baseURL: config.nftheaterAPI,
})

AdminBffAPI.interceptors.request.use(
  async (config) => {
    const token = ls.get<string | null | undefined>(STORAGE_KEYS.TOKEN)
    const account = ls.get<string | null | undefined>(STORAGE_KEYS.ACCOUNT)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const timestamp = Math.floor(+new Date() / 1000)
    config.headers.timestamp = timestamp
    config.headers.user_agent = browserName
    config.headers.application_version = packageInfo.version
    config.headers.module = account

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
