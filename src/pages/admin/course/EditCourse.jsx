import { Link } from 'react-router-dom'
import CourseTab from './CourseTab'
import { Button } from '@/components/ui/button'

const EditCourse = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">Add detail information regarding course</h1>
        <Link to="lecture">
          <Button>Go lectures page</Button>
        </Link>
      </div>
      <CourseTab />
    </div>
  )
}

export default EditCourse
