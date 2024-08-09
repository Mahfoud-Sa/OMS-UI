import axios, { AxiosRequestConfig } from 'axios'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { redirect } from 'react-router-dom'

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  auth: {
    username: process.env.REACT_APP_API_USERNAME as string,
    password: process.env.REACT_APP_API_PASSWORD as string
  }
})

type Config = AxiosRequestConfig<any> | undefined

function isAuth() {
  const isAuthenticated = useIsAuthenticated()
  if (isAuthenticated) return true

  redirect('login')
  return false
}

export function getApi<T>(url: string, config?: Config) {
  if (isAuth()) return axiosInstance.get<T>(url, config)
}

export function putApi<T>(url: string, data: any, config?: Config) {
  if (isAuth()) return axiosInstance.put<T>(url, data, config)
}

export function postApi<T>(url: string, data: any, config?: Config) {
  if (isAuth()) return axiosInstance.post<T>(url, data, config)
}

export function patchApi<T>(url: string, data: any, config?: Config) {
  if (isAuth()) return axiosInstance.patch<T>(url, data, config)
}

export function deleteApi<T>(url: string, config?: Config) {
  if (isAuth()) return axiosInstance.delete<T>(url, config)
}
