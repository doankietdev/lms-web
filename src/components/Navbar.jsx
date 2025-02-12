/* eslint-disable react/prop-types */
import DarkMode from '@/DarkMode'
import { userLoggedOut } from '@/features/userSlice'
import { useAuth0 } from '@auth0/auth0-react'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Menu, School } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from './ui/sheet'

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0()
  const { user } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  const logoutHandler = async () => {
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } })
      dispatch(userLoggedOut())
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      /* empty */
    }
  }

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <Link to="/" className="flex items-center gap-2">
          <School size={'30'} />
          <h1 className="hidden md:block font-extrabold text-2xl">LMS</h1>
        </Link>
        {/* User icons and dark mode icon  */}
        <div className="flex items-center gap-4">
          {!isAuthenticated && (
            <Button variant="outline" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
          <DarkMode />
          {isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage
                    src={user?.photoUrl || 'https://github.com/shadcn.png'}
                    alt="@shadcn"
                  />
                  <AvatarFallback>N/A</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Link to="profile" className="flex gap-3 justify-center items-center">
                    <Avatar>
                      <AvatarImage
                        src={user?.photoUrl || 'https://github.com/shadcn.png'}
                        alt="@shadcn"
                      />
                      <AvatarFallback>N/A</AvatarFallback>
                    </Avatar>
                    {user?.name}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    {' '}
                    <Link to="profile">My Profile</Link>{' '}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="my-learning">My learning</Link>
                  </DropdownMenuItem>
                  {/* {user?.role === 'instructor' && ( */}
                    <>
                      <DropdownMenuItem>
                        <Link to="/admin/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  {/* )} */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {/* Mobile device  */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <Link to="/" className="flex items-center gap-2">
          <School size={'30'} />
          <h1 className="font-extrabold text-2xl">LMS</h1>
        </Link>

        <div>
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Button variant="outline" onClick={() => loginWithRedirect()}>
                Login
              </Button>
            )}
            <DarkMode />
            {isAuthenticated && <MobileNavbar user={user} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar

const MobileNavbar = ({ user }) => {
  const { logout } = useAuth0()
  const dispatch = useDispatch()

  const logoutHandler = async () => {
    try {
      await logout({ logoutParams: { returnTo: window.location.origin } })
      dispatch(userLoggedOut())
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" className="rounded-full" variant="outline">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-center mt-5 space-y-0">
          <SheetTitle>
            <Link to="/" className="flex items-center gap-2">
              <School size={'26'} />
              <h1 className="font-extrabold text-xl">LMS</h1>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <Separator className="mr-2" />
        <nav className="flex flex-col space-y-4">
          <Link to="/my-learning">My Learning</Link>
          <Link to="/profile">Edit Profile</Link>
          {user?.role === 'instructor' && <Link to="/admin/dashboard">Dashboard</Link>}
        </nav>
        <SheetClose asChild>
          <p className="cursor-pointer" onClick={logoutHandler}>
            Log out
          </p>
        </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
