import axios from 'axios'
import ls from 'localstorage-slim'
import { STORAGE_KEYS } from 'auth/AuthContext'
import config from 'config'

export const BaseApi = axios.create({
  baseURL: config.evmeBff,
})

BaseApi.interceptors.request.use(
  (config) => {
    const token = ls.get<string | null | undefined>(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
