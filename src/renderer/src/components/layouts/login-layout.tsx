import { Outlet } from 'react-router-dom'
import { Toaster } from '../ui/toaster'

const LoginRootLayout = () => {
  return (
    <>
      <div className="flex bg-muted">
        <div className="hidden md:block"></div>
        <div className="flex flex-auto flex-col">
          <main className="">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </div>
    </>
  )
}

export default LoginRootLayout
