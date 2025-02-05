import { Loader } from 'lucide-react'

const LoadingSpinner = ({ message = 'Loading, please wait...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader className="animate-spin h-14 w-14 text-blue-600" />
      <p className="mt-4 text-base font-semibold text-gray-700">{message}</p>
    </div>
  )
}

export default LoadingSpinner
