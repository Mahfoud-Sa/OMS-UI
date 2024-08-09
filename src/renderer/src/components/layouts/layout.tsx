import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div>
      <span>Sidebar</span>
      <Outlet />
    </div>
  )
}

export default RootLayout
