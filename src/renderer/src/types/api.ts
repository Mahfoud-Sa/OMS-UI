import { LucideProps } from 'lucide-react'
import { ForwardRefExoticComponent, RefAttributes } from 'react'

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
  orderId?: string
}

export type Item = {
  id: number
  productDesignId: number
  productName: string
  factoryName: string
  fabric: string
  file?: string
  quantity: number
  note: string
  productionTeamId: number
  orderId: number
  productDesignName: string

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
  file?: File
  factoryId: number
  image?: File
  images: File[]
  note: string
  productDesignId: number
  productionLineId: number
  productionTeamId: number
  quantity: number
}
export interface cardsInterface {
  title: string
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  value: number | string
  iconClassName: string
  iconBgWrapperColor: string
}
export interface DailyReportInfo {
  returnReportCards: (cards: cardsInterface[]) => void
}
export enum Roles {
  Roles = 'Roles',
  OrdersStatesReporter = 'Orders States Reporter',
  RecetPassword = 'Recet Password',
  DeleteUser = 'Delete User',
  UpdateUser = 'Update User',
  GetProducts = 'Get Products',
  AddUser = 'Add User',
  GetOrder = 'Get Order',
  GetOrders = 'Get Orders',
  DeleteFactory = 'Delete Factory',
  Admin = 'Admin',
  GetUsers = 'Get Users',
  DeleteOrder = 'Delete Order',
  DeliveryDatesReporter = 'Delivery Dates Reporter',
  ChangePassword = 'Change Password',
  GetFactories = 'Get Factories',
  GetUser = 'Get User',
  AddOrder = 'Add Order',
  DeleteProduct = 'Delete Product',
  GetFactory = 'Get Factory',
  UpdateOrder = 'Update Order',
  DailyReporter = 'Daily Reporter',
  OrdersProductionReporter = 'Orders Production Reporter',
  UpdateProfile = 'Update Profile',
  UpdateProduct = 'Update Product',
  GetProfile = 'Get Profile',
  AddFactory = 'Add Factory',
  AddProduct = 'Add Product',
  FactoryCharts = 'Factory charts',
  UpdateFactory = 'Update Factory',
  GetProduct = 'Get Product'
}
