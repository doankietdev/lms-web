import { resetError } from '@/features/errorSlice'
import MainLayout from '@/layout/MainLayout'
import { ErrorPage } from '@/pages/ErrorPage'
import { ERROR_TYPES } from '@/utils/constants'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const ErrorBoundary = ({ children }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const errorType = useSelector((state) => state.error.errorType)

  useEffect(() => {
    dispatch(resetError())
  }, [dispatch, location.pathname])

  if (errorType) {
    return (
      <MainLayout>
        {errorType === ERROR_TYPES.NOT_FOUND && <ErrorPage code="404" message="Page Not Found" />}
      </MainLayout>
    )
  }

  return children
}
