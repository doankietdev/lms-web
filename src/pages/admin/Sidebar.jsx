import { cn } from '@/lib/utils'
import { ChartNoAxesColumn, SquareLibrary } from 'lucide-react'
import { Outlet, NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="space-y-1 hidden lg:block w-[250px] sm:w-[300px] border-r border-gray-300 dark:border-gray-700  p-5 sticky top-0 h-screen">
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 p-3 transition-colors ease-in-out hover:bg-muted/50 rounded-md',
              {
                'bg-muted/70': isActive
              }
            )
          }
        >
          <ChartNoAxesColumn size={22} />
          <h1>Dashboard</h1>
        </NavLink>
        <NavLink
          to="course"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 p-3 transition-colors ease-in-out hover:bg-muted/50 rounded-md',
              {
                'bg-muted/50': isActive
              }
            )
          }
        >
          <SquareLibrary size={22} />
          <h1>Courses</h1>
        </NavLink>
      </div>
      <div className="flex-1 p-10 pr-5 relative">
        <Outlet />
      </div>
    </div>
  )
}

export default Sidebar
