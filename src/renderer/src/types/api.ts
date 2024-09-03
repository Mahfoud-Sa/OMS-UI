export type LogInResponse = {
  accessToken: string
  expiresIn: number
  refreshToken: string
  tokenType: string
}

export type StatisticalUserCards = {
  active: number
  inactive: number
  allUser: number
}

export type Product = {
  id: number
  name: string
  quantity: number
  creatAt: string
}
