import { AdminRoute, ProtectedRoute } from '@/components/ProtectedRoutes'
import PurchaseCourseProtectedRoute from '@/components/PurchaseCourseProtectedRoute'
import MainLayout from '@/layout/MainLayout'
import { AuthCallback } from '@/pages/AuthCallback'
import { ErrorPage } from '@/pages/ErrorPage'
import Dashboard from '@/pages/admin/Dashboard'
import Sidebar from '@/pages/admin/Sidebar'
import AddCourse from '@/pages/admin/course/AddCourse'
import CourseTable from '@/pages/admin/course/CourseTable'
import EditCourse from '@/pages/admin/course/EditCourse'
import CreateLecture from '@/pages/admin/lecture/CreateLecture'
import EditLecture from '@/pages/admin/lecture/EditLecture'
import CourseDetail from '@/pages/student/CourseDetail'
import CourseProgress from '@/pages/student/CourseProgress'
import Courses from '@/pages/student/Courses'
import HeroSection from '@/pages/student/HeroSection'
import MyLearning from '@/pages/student/MyLearning'
import Profile from '@/pages/student/Profile'
import SearchPage from '@/pages/student/SearchPage'
import { useRoutes } from 'react-router-dom'

export const Routes = () => {
  return useRoutes([
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
          element: <SearchPage />
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
        },
        {
          path: '*',
          element: <ErrorPage code="404" message="Page Not Found" />
        }
      ]
    }
  ])
}
