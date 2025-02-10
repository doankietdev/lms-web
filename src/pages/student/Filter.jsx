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
import { useGetCategoriesQuery } from '@/features/api/categoryApi'
import { useState } from 'react'

// eslint-disable-next-line react/prop-types
const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [sortByPrice, setSortByPrice] = useState('')

  const { data } = useGetCategoriesQuery()

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

  const categories = data?.categories|| []

  return (
    <div className="w-full md:w-[20%]">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
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
      <div>
        <h1 className="font-semibold mb-2">CATEGORY</h1>
        {categories?.map((category, index) => (
          <div key={index} className="flex items-center space-x-2 my-2">
            <Checkbox id={category._id} onCheckedChange={() => handleCategoryChange(category._id)} />
            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {category.categoryTitle}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Filter
