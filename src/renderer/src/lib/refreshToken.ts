import createRefresh from 'react-auth-kit/createRefresh'
import { axiosInstance } from './http'

export const refresh = createRefresh({
  interval: 10, // The time in sec to refresh the Access token
  // @ts-ignore
  refreshApiCallback: async (param) => {
    try {
      const response = await axiosInstance.post('/refresh', param, {
        headers: { Authorization: `Bearer ${param.authToken}` }
      })
      console.log('Refreshing')
      return {
        isSuccess: true,
        newAuthToken: response.data.token,
        newAuthTokenExpireIn: 10,
        newRefreshTokenExpiresIn: 60
      }
    } catch (error) {
      console.error(error)
      return {
        isSuccess: false
      }
    }
  }
})
