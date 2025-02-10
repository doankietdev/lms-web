import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCash } from '@/lib/utils'
import { Link } from 'react-router-dom'

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="h-full overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt="course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>
        <CardContent className="px-5 py-4 space-y-2">
          <div>
            <p className="font-bold text-lg truncate">{course.courseTitle}</p>
            <p className="mt-1 text-sm truncate">{course.subTitle}</p>
          </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={course.creator?.photoUrl || 'https://github.com/shadcn.png'}
                  alt="@shadcn"
                />
                <AvatarFallback>N/A</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm">{course.creator?.name}</p>
            </div>
          <div className="flex items-center gap-2">
            <Badge
              title="ab"
              className={'px-2 py-1 text-xs rounded-full'}
            >
              {course.courseLevel}
            </Badge>
            <Badge
              className={'px-2 py-1 text-xs rounded-full'}
            >
              {course.enrolledStudents.length}
            </Badge>
          </div>
          <div className="text-lg font-bold">
            <span>{course.coursePrice === 0 ? 'Free' : formatCash(course.coursePrice)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default Course
