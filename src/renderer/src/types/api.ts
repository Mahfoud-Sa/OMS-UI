export type LogInResponse = {
  token: string
  expireIn: number
  refreshToken: string
  tokenType: string
  id?: string
  message?: string
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

export type User = {
  roles: string[] // Assuming roles is an array of strings
  id: string
  userName: string
  firstName: string
  lastName: string
  employDate: string // Date string in ISO format
  phoneNumber: string
  userType: string // User type is a string (e.g., "مشرف")
  workPlace: string
  imagePath: string
  createdAt?: string
}
export interface ProductionTeam {
  id?: string
  name: string
  phone: string
  newTeam?: boolean
  productionLineId?: string
}

export interface ProductionLineProps {
  id?: string
  name: string
  phone?: string
  teamsCount: number
  teams?: ProductionTeam[] // Include teams here
}
export interface LineChartResponse {
  monthe: string
  sales: {
    name: string
    sales: number
  }[]
}

export interface MixedBarCharterProps {
  name: string
  sales: number
}
export interface NoneMixedBarCharterProps {
  month: string
  sales: number
}
