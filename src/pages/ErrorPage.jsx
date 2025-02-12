import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

// eslint-disable-next-line react/prop-types
export const ErrorPage = ({ code, message }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <span className="text-[40px] md:text-[120px] font-bold tracking-widest text-center">{code}</span>
      <h1 className="text-[24px] md:text-[38px] font-bold tracking-widest capitalize text-center">{message}</h1>
      <Link to="/" className="mt-[20px] md:mt-[40px]">
        <Button>Back to Home Page</Button>
      </Link>
    </div>
  )
}
