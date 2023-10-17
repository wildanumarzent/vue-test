import { API_IMGBB_URL } from '@/constants/env'
import axios from 'axios'
// import { logOnDev } from '@/utils/logger'

const instance = axios.create({
  baseURL: API_IMGBB_URL,
  headers: {
    Accept: 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  config.params = {
    expiration: '600',
    key: 'cbd97bc44df6d6c0da3581d72de65274',
    ...config.params
  }
  return config
})

export default instance
