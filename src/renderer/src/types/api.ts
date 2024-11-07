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
  createdAt: string
}
export type OrderItemTable = {
  id: number
  productName: string
  fabric: string
  productDesignName: string
  quantity: number
  productionTeamName: string
}
export type OrderItem = {
  id: number
  productDesignId: number
  fabric: string
  quantity: number
  note: string
  productionTeamId: number
  orderId: number
  images: string[]
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
  month: string
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
export interface OrderHistory {
  id: number
  actionName: string
  createdAt: string
  userName: string
  orderId: number
}
export interface OrderTimeline {
  id: number
  receivedAt: string
  deliveredAt: string
  status: number
  orderId: number
  productionTeamId: number
  productionTeamName: string | null
}

// export type Order = {
//   id: number
//   billNo: string
//   customerName: string
//   createAt: string
//   orderState: number
//   sellingPrice: number
// }

export type Order = {
  id: number
  billNo: string
  customerName: string
  createAt: string
  deliveryAt: string
  readyAt: string
  deliveryNote: string
  orderState: number
  costPrice: number
  sellingPrice: number
  customerNo: string
  userId: number | null
  userName: string | null
  note: string
  items: Item[]
  history: History[]
  timelines: Timeline[]
}

export type Item = {
  id: number
  productDesignId: number
  productName: string
  factoryName: string
  fabric: string
  quantity: number
  note: string
  productionTeamId: number
  orderId: number
  images: string[]
  timelines: Timeline[]
}

// export type OrderHistory = {
//   id: number
//   actionName: string
//   createdAt: string
//   userName: string
//   orderId: number
// }

type Timeline = {
  id: number
  receivedAt: string
  deliveredAt: string
  status: number
  orderId: number
  productionTeamId: number
  productionTeamName: string | null
  productionLineId: number
  productionLineName: string
}

export type Factory = {
  id: number
  name: string
  location: string
  createdAt: string
}

export type ProductionLines = {
  id: number
  name: string
  factoryId: number
}

export interface NewOrderProp {
  id: number
  billNo: string
  customerName: string
  customerNo: string
  createAt: string
  deliveryAt: string
  readyAt: string
  deliveryNote: string
  userName: string
  note: string
  orderState: number
  costPrice: number
  sellingPrice: number
  userId: number
  items: OrderItem[]
  history: OrderHistory[]
  timelines: OrderTimeline[]
}

export interface FactoryInterface {
  id: string
  name: string
  location: string
  createdAt: string
  productionLinesCount?: number
  teamsCount?: number
  productionLines?: ProductionLineProps[]
}

export interface localNewProduct {
  id?: number
  productId: number
  fabric: string
  factoryId: number
  image: File
  note: string
  productDesignId: number
  productionLineId: number
  productionTeamId: number
  quantity: number
}
