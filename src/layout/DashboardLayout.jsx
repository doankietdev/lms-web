import DashboardNavbar from '@/components/DashboardNavbar'
import { Outlet } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex-1 mt-16">{children ? children : <Outlet />}</div>
    </div>
  )
}

export default DashboardLayout
