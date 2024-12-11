import axios, { AxiosRequestConfig } from 'axios'

// const token = localStorage.getItem('_auth')
// const tokenType = localStorage.getItem('_auth_type') || 'Bearer'
// console.log('token', token)

export const axiosInstance = axios.create({
  baseURL: import.meta.env.RENDERER_VITE_REACT_APP_API_URL,
  // headers: {
  //   // eslint-disable-next-line prettier/prettier
  //   'Authorization': `Bearer ${token}`
  // }
})

type Config = AxiosRequestConfig<any> | undefined

export function getApi<T>(url: string, config?: Config) {

  const token = localStorage.getItem('_auth')

  return axiosInstance.get<T>(url, {
    headers:{
      "Authorization" : `Bearer ${token}`
    },
    ...config
  })
}

export function postApi<T>(url: string, data: any, config?: Config) {

  const token = localStorage.getItem('_auth')

  return axiosInstance.post<T>(url, data, {
    headers:{
      ...config?.headers,
      "Authorization" : `Bearer ${token}`
    },
    ...config
  })
}

export function putApi<T>(url: string, data: any, config?: Config) {
  const token = localStorage.getItem('_auth')

  return axiosInstance.put<T>(url, data, {
    headers:{
      ...config?.headers,
      "Authorization" : `Bearer ${token}`
    },
    ...config
  })
}

export function patchApi<T>(url: string, data: any, config?: Config) {
  const token = localStorage.getItem('_auth')

  return axiosInstance.patch<T>(url, data, {
    headers:{
      ...config?.headers,
      "Authorization" : `Bearer ${token}`
    },
    ...config
  })
}

export function deleteApi<T>(url: string, config?: Config) {
  
  const token = localStorage.getItem('_auth')

  return axiosInstance.delete<T>(url, {
    headers:{
      ...config?.headers,
      "Authorization" : `Bearer ${token}`
    },
    ...config
  })
}
