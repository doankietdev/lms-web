import { Search } from '@/components/Search'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const handleSearch = () => {
    if (searchQuery.trim() !== '') {
      navigate(`/course/search?query=${searchQuery}`)
    }
    setSearchQuery('')
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4">Find the Best Courses for You</h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn, and Up skills with our wide range of courses
        </p>

        <Search
          placeholder="Search Courses"
          value={searchQuery}
          onSearch={handleSearch}
          onChange={(value) => setSearchQuery(value)}
        />
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-200"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  )
}

export default HeroSection
