/* eslint-disable react/prop-types */
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'

export const Search = ({
  onSearch = () => {},
  onChange = () => {},
  value = '',
  placeholder = '',
  containerClass = ''
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
      className={cn(containerClass, 'flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden mb-6')}
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-grow border-none focus-visible:ring-0 px-6 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
      <Button
        type="submit"
        className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800"
      >
        Search
      </Button>
    </form>
  )
}
