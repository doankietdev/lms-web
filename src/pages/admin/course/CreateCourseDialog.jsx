import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useGetCategoriesQuery } from '@/features/api/categoryApi'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const CreateCourseDialog = () => {
  const [courseTitle, setCourseTitle] = useState('')
  const [category, setCategory] = useState('')
  const [open, setOpen] = useState(false)

  const [createCourse, { isLoading }] = useCreateCourseMutation()
  const { data: { categories = [] } = {}, isLoading: getCategoriesLoading, isSuccess } = useGetCategoriesQuery()

  useEffect(() => {
    if (isSuccess) {
      setCategory(categories[0]?._id)
    }
  }, [categories, isSuccess])

  const getSelectedCategory = (value) => {
    setCategory(value)
  }

  const createCourseHandler = async () => {
    try {
      await createCourse({ courseTitle, category }).unwrap()
      setOpen(false)
      setCourseTitle('')
      setCategory('')
      toast.success('Create new course successfully')
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to create new course')
    }
  }

  return getCategoriesLoading ? (
    <LoadingSpinner />
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create new course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
          <DialogDescription>
            Let&apos;s add some basic details for your new course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select value={category} onValueChange={getSelectedCategory}>
              <SelectTrigger className="w-full max-w-[300px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories?.map((category) => (
                    <SelectItem key={category?._id} value={category?._id}>
                      {category?.categoryTitle}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline" className="w-full">Cancel</Button>
          </DialogClose>
          <Button disabled={isLoading} onClick={createCourseHandler}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateCourseDialog
