import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 mt-16">{children ? children : <Outlet />}</div>
    </div>
  )
}

export default MainLayout
