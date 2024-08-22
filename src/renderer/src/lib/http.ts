import axios, { AxiosRequestConfig } from 'axios'
// import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
// import { redirect } from 'react-router-dom'

export const axiosInstance = axios.create({
  baseURL: 'http://mjeedsalem12-001-site1.htempurl.com',
  auth: {
    username: '11189255',
    password: '60-dayfreetrial'
  },
  headers: {
    'Access-Control-Allow-Origin': true
  }
})

type Config = AxiosRequestConfig<any> | undefined

// function isAuth() {
//   const isAuthenticated = useIsAuthenticated()
//   console.log(isAuthenticated)
//   if (isAuthenticated) return true

//   redirect('login')
//   return false
// }

export function getApi<T>(url: string, config?: Config) {
  // if (isAuth()) return
  return axiosInstance.get<T>(url, config)
}

// export function putApi<T>(url: string, data: any, config?: Config) {
//   if (isAuth()) return axiosInstance.put<T>(url, data, config)
// }

export function postApi<T>(url: string, data: any, config?: Config) {
  // if (isAuth()) return
  // console.log(url)
  return axiosInstance.post<T>(url, data, config)
}

// export function patchApi<T>(url: string, data: any, config?: Config) {
//   if (isAuth()) return axiosInstance.patch<T>(url, data, config)
// }

export function deleteApi<T>(url: string, config?: Config) {
  // if (isAuth()) return axiosInstance.delete<T>(url, config)
  return axiosInstance.delete<T>(url, config)
}
