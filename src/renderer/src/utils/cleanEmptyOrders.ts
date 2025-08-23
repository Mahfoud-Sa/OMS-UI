import { deleteApi, getApi } from '@renderer/lib/http'
import { Item, Order } from '@renderer/types/api'

// Configuration
const PAGE_SIZE = 1000 // Number of orders to fetch per request
const DRY_RUN = true // Set to false to actually delete orders

/**
 * Fetches all orders from the system in batches
 */
const getAllOrders = async (): Promise<Order[]> => {
  try {
    // Get the first page to determine total count
    const firstPage = await getApi<{
      total: number
      orders: Order[]
      pageNumber: number
      pageSize: number
      pages: number
    }>('/Orders', { params: { pageSize: PAGE_SIZE, page: 1 } })

    const totalPages = firstPage.data.pages
    let allOrders = [...firstPage.data.orders]

    // Fetch remaining pages
    for (let page = 2; page <= totalPages; page++) {
      console.log(`Fetching orders page ${page}/${totalPages}`)
      const response = await getApi<{
        orders: Order[]
      }>('/Orders', { params: { pageSize: PAGE_SIZE, page } })
      allOrders = [...allOrders, ...response.data.orders]
    }

    console.log(`Fetched a total of ${allOrders.length} orders`)
    return allOrders
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }
}

/**
 * Checks if an order has any items
 */
const checkOrderItems = async (orderId: number): Promise<boolean> => {
  try {
    const response = await getApi<Item[]>(`/Orders/${orderId}/OrderItems`)
    return response.data.length > 0
  } catch (error) {
    console.error(`Error checking items for order ${orderId}:`, error)
    // Consider order as having items if there's an error to avoid accidental deletion
    return true
  }
}

/**
 * Deletes an order
 */
const deleteOrder = async (orderId: number): Promise<void> => {
  try {
    await deleteApi(`/Orders/${orderId}`)
    console.log(`Order ${orderId} deleted successfully`)
  } catch (error) {
    console.error(`Error deleting order ${orderId}:`, error)
    throw error
  }
}

/**
 * Main function to clean up orders with no items
 */
export const cleanEmptyOrders = async (): Promise<void> => {
  console.log('Starting empty orders cleanup...')
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN - No actual deletion' : 'LIVE - Orders will be deleted'}`)

  try {
    // Get all orders
    const allOrders = await getAllOrders()
    console.log(`Found ${allOrders.length} orders in total`)

    // Track empty orders
    const emptyOrders: Order[] = []

    // Process each order
    for (let i = 0; i < allOrders.length; i++) {
      const order = allOrders[i]
      console.log(`Processing order ${i + 1}/${allOrders.length}: ID ${order.id}`)

      // Check if order has items
      const hasItems = await checkOrderItems(order.id)

      if (!hasItems) {
        console.log(`Order ${order.id} has no items - marked for deletion`)
        emptyOrders.push(order)

        // Delete if not in dry run mode
        if (!DRY_RUN) {
          await deleteOrder(order.id)
        }
      }
    }

    // Summary
    console.log('\n--- CLEANUP SUMMARY ---')
    console.log(`Total orders processed: ${allOrders.length}`)
    console.log(`Orders with no items: ${emptyOrders.length}`)

    if (emptyOrders.length > 0) {
      console.log('\nEmpty order IDs:')
      emptyOrders.forEach((order) => {
        console.log(
          `- Order ID: ${order.id}, Bill No: ${order.billNo}, Created: ${new Date(order.createAt).toLocaleDateString()}`
        )
      })

      if (DRY_RUN) {
        console.log('\nThis was a DRY RUN. No orders were deleted.')
        console.log('To actually delete these orders, set DRY_RUN = false in the script.')
      } else {
        console.log('\nAll empty orders have been deleted.')
      }
    } else {
      console.log('No empty orders found. Nothing to delete.')
    }
  } catch (error) {
    console.error('Error in cleanup process:', error)
  }
}
