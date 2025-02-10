import { Search } from '@/components/Search'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetSearchCourseQuery } from '@/features/api/courseApi'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Filter from './Filter'
import SearchResult from './SearchResult'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortByPrice, setSortByPrice] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice
  })

  const isEmpty = !isLoading && data?.courses.length === 0

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories)
    setSortByPrice(price)
  }

  const handleSearch = () => {
    navigate(`/course/search?query=${searchQuery}`)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row gap-10">
        <div>
          <div>
            <h1 className="font-bold text-lg">Result for &quot;{query}&quot;</h1>
          </div>
          <Separator className="my-4" />
          <Filter handleFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1">
          <Search
            placeholder="Search Courses"
            value={searchQuery}
            onSearch={handleSearch}
            onChange={(value) => setSearchQuery(value)}
          />
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx, thisArray) => (
              <>
                <CourseSkeleton key={idx} />
                {idx !== thisArray?.length - 1 && <Separator className="my-4" />}
              </>
            ))
          ) : isEmpty ? (
            <CourseNotFound />
          ) : (
            data?.courses?.map((course, idx) => (
              <>
                <SearchResult key={course._id} course={course} />
                {idx !== data?.courses?.length - 1 && <Separator className="my-4" />}
              </>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPage

const CourseNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-32 dark:bg-gray-900 p-6">
      <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
      <h1 className="font-bold text-2xl md:text-4xl text-gray-800 dark:text-gray-200 mb-2">
        Course Not Found
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
        Sorry, we couldn&apos;t find the course you&apos;re looking for.
      </p>
      <Link to="/" className="italic">
        <Button variant="link">Browse All Courses</Button>
      </Link>
    </div>
  )
}

const CourseSkeleton = () => {
  return (
    <div className="flex-1 flex flex-col md:flex-row justify-between border-gray-300 py-4">
      <div className="h-32 w-full md:w-64">
        <Skeleton className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-col gap-2 flex-1 px-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-6 w-20 mt-2" />
      </div>

      <div className="flex flex-col items-end justify-center mt-4 md:mt-0">
        <Skeleton className="h-6 w-12" />
      </div>
    </div>
  )
}

