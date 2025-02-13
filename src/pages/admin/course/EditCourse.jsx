import LoadingSpinner from '@/components/LoadingSpinner'
import RichTextEditor from '@/components/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { useGetCategoriesQuery } from '@/features/api/categoryApi'
import {
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation
} from '@/features/api/courseApi'
import { COURSE_LEVELS } from '@/utils/constants'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: '',
    subTitle: '',
    description: '',
    category: '',
    courseLevel: '',
    coursePrice: '',
    courseThumbnail: ''
  })
  const [previewThumbnail, setPreviewThumbnail] = useState('')

  const params = useParams()
  const courseId = params.courseId
  const {
    data: courseByIdData,
    isLoading: courseByIdLoading,
    refetch
  } = useGetCourseByIdQuery(courseId)

  const { data: { categories } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery()

  const [publishCourse] = usePublishCourseMutation()

  useEffect(() => {
    if (courseByIdData?.course) {
      const course = courseByIdData?.course
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category?._id,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: ''
      })
      setPreviewThumbnail(course.courseThumbnail)
    }
  }, [courseByIdData])

  const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation()

  const changeEventHandler = (e) => {
    const { name, value } = e.target
    setInput({ ...input, [name]: value })
  }

  const selectCategory = (value) => {
    setInput({ ...input, category: value })
  }
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value })
  }
  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setInput({ ...input, courseThumbnail: file })
      const fileReader = new FileReader()
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result)
      fileReader.readAsDataURL(file)
    }
  }

  const updateCourseHandler = async () => {
    const formData = new FormData()
    formData.append('courseTitle', input.courseTitle)
    formData.append('subTitle', input.subTitle)
    formData.append('description', input.description)
    formData.append('category', input.category)
    formData.append('courseLevel', input.courseLevel)
    formData.append('coursePrice', input.coursePrice)
    formData.append('courseThumbnail', input.courseThumbnail)

    await editCourse({ formData, courseId })
  }

  const publishStatusHandler = async (action) => {
    try {
      const response = await publishCourse({ courseId, query: action })
      if (response.data) {
        refetch()
        toast.success(response.data.message)
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to publish or unpublish course')
    }
  }

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || 'Course update.')
    }
    if (error) {
      toast.error(error.data?.message || 'Failed to update course')
    }
  }, [isSuccess, error, data?.message])

  return courseByIdLoading || categoriesLoading ? (
    <LoadingSpinner />
  ) : (
    <>
      <Link to="/instructor/course">
        <Button size="icon" variant="outline" className="rounded-full">
          <ArrowLeft size={16} />
        </Button>
      </Link>

      <Card className="mt-4">
        <CardHeader className="flex-row justify-between">
          <div>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Make changes to your course here. Click save when you&apos;re done.
            </CardDescription>
          </div>
          <div className="space-x-4">
            <Link to="lecture">
              <Button>View course content</Button>
            </Link>
            <Button
              disabled={courseByIdData?.course.lectures.length === 0}
              onClick={() =>
                publishStatusHandler(courseByIdData?.course.isPublished ? 'false' : 'true')
              }
            >
              {courseByIdData?.course.isPublished ? 'Unpublished' : 'Publish'}
            </Button>
            <Button variant="destructive">Remove</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div className="space-y-1">
            <Label>Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
            />
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <RichTextEditor input={input} setInput={setInput} />
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
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
            <div className="space-y-1">
              <Label>Course Level</Label>
              <Select value={input.courseLevel || undefined} onValueChange={selectCourseLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    {Object.values(COURSE_LEVELS).map(({ CODE, LABEL }) => (
                      <SelectItem key={CODE} value={CODE}>
                        {LABEL}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Price (USD)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div className="space-x-1">
            <Label>Course Thumbnail</Label>
            <Input type="file" onChange={selectThumbnail} accept="image/*" className="w-fit" />
            {previewThumbnail && (
              <img src={previewThumbnail} className="!mt-3" alt="Course Thumbnail" />
            )}
          </div>
          <div className="space-x-4">
            <Link to="/instructor/course">
              <Button variant="outline">Back</Button>
            </Link>
            <Button disabled={isLoading} onClick={updateCourseHandler}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default CourseTab
