import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'video-react/dist/video-react.css'
import './App.css'
import { AdminRoute, ProtectedRoute } from './components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'
import MainLayout from './layout/MainLayout'
import { injectGetAccessTokenSilently } from './lib/utils'
import { AuthCallback } from './pages/AuthCallback'
import Dashboard from './pages/admin/Dashboard'
import Sidebar from './pages/admin/Sidebar'
import AddCourse from './pages/admin/course/AddCourse'
import CourseTable from './pages/admin/course/CourseTable'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import Courses from './pages/student/Courses'
import HeroSection from './pages/student/HeroSection'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import SearchPage from './pages/student/SearchPage'

const appRouter = createBrowserRouter([
  {
    path: '/auth',
    children: [
      {
        path: 'callback',
        element: <AuthCallback />
      }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        )
      },
      {
        path: 'my-learning',
        element: (
          <ProtectedRoute>
            <MyLearning />
          </ProtectedRoute>
        )
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'course/search',
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        )
      },
      {
        path: 'course-detail/:courseId',
        element: (
          <ProtectedRoute>
            <CourseDetail />
          </ProtectedRoute>
        )
      },
      {
        path: 'course-progress/:courseId',
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <CourseProgress />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminRoute>
              <Sidebar />
            </AdminRoute>
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'course',
            element: <CourseTable />
          },
          {
            path: 'course/create',
            element: <AddCourse />
          },
          {
            path: 'course/:courseId',
            element: <EditCourse />
          },
          {
            path: 'course/:courseId/lecture',
            element: <CreateLecture />
          },
          {
            path: 'course/:courseId/lecture/:lectureId',
            element: <EditLecture />
          }
        ]
      }
    ]
  }
])

function App() {
  const { getAccessTokenSilently } = useAuth0()

  injectGetAccessTokenSilently(getAccessTokenSilently)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getAccessTokenSilently()
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        /* empty */
      }
    }
    checkAuth()
  }, [getAccessTokenSilently])

  return (
    <main>
      <ThemeProvider>
        <RouterProvider router={appRouter} />
      </ThemeProvider>
    </main>
  )
}

export default App
