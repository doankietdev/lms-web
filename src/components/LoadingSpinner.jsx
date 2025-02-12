import { Loader } from 'lucide-react'

// eslint-disable-next-line react/prop-types
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Loader className="animate-spin h-14 w-14 text-blue-600" />
      <p className="mt-4 text-xl font-semibold text-gray-500">{message}</p>
    </div>
  )
}

export default LoadingSpinner
