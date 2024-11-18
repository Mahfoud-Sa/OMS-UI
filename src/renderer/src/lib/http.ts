import axios, { AxiosRequestConfig } from 'axios'

const token = localStorage.getItem('_auth')
// const tokenType = localStorage.getItem('_auth_type') || 'Bearer'
console.log('token', token)

export const axiosInstance = axios.create({
  baseURL: import.meta.env.RENDERER_VITE_REACT_APP_API_URL,
  headers: {
    // eslint-disable-next-line prettier/prettier
    'Authorization': `Bearer ${token}`
  }
})

type Config = AxiosRequestConfig<any> | undefined

export function getApi<T>(url: string, config?: Config) {
  return axiosInstance.get<T>(url, config)
}

export function postApi<T>(url: string, data: any, config?: Config) {
  return axiosInstance.post<T>(url, data, config)
}

export function putApi<T>(url: string, data: any, config?: Config) {
  return axiosInstance.put<T>(url, data, config)
}

export function patchApi<T>(url: string, data: any, config?: Config) {
  return axiosInstance.patch<T>(url, data, config)
}

export function deleteApi<T>(url: string, config?: Config) {
  return axiosInstance.delete<T>(url, config)
}
