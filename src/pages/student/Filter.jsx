import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetCategoriesQuery } from '@/features/api/categoryApi'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortByPrice, setSortByPrice] = useState('')

  const { data, isLoading } = useGetCategoriesQuery()

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      const newCategories = prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId]

      handleFilterChange(newCategories, sortByPrice)
      return newCategories
    })
  }

  const selectByPriceHandler = (selectedValue) => {
    setSortByPrice(selectedValue)
    handleFilterChange(selectedCategories, selectedValue)
  }

  const categories = data?.categories || []

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-lg">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort by price</SelectLabel>
              <SelectItem value="low">Low to High</SelectItem>
              <SelectItem value="high">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-lg">Categories</h1>
        <div>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <CategorySkeleton key={idx} />
            ))
          ) : (
            categories?.map((category, index) => (
              <div key={index} className="flex items-center space-x-2 my-2">
                <Checkbox
                  id={category._id}
                  onCheckedChange={() => handleCategoryChange(category._id)}
                />
                <Label className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {category.categoryTitle}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const CategorySkeleton = () => {
  return (
    <div className="flex items-center space-x-2 my-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-12" />
    </div>
  )
}

export default Filter
