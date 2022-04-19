import axios from 'axios'
import config from 'config'
import ls from 'localstorage-slim'
import { STORAGE_KEYS } from 'auth/AuthContext'

export const BaseApi = axios.create({
  baseURL: config.evmeBff,
  /*baseURL: 'https://run.mocky.io/v3/',*/
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
