import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatCash } from '@/lib/utils'
import React from 'react'
import { Link } from 'react-router-dom'

const SearchResult = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 md:gap-4">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full md:w-auto"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnial"
          className="w-full md:w-56 object-cover rounded"
        />
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="font-bold text-lg md:text-xl truncate">{course.courseTitle}</h1>
          <p className="text-sm truncate">{course.subTitle}</p>
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
          <div className='flex items-center gap-2'>
            <Badge className="w-fit mt-2 md:mt-0">{course.courseLevel}</Badge>
            <Badge className={'px-2 py-1 text-xs rounded-full'}>
              {course?.enrolledStudents?.length}
            </Badge>
          </div>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto">
        <p className="font-bold text-lg md:text-xl">
          {course.coursePrice === 0 ? 'Free' : formatCash(course.coursePrice)}
        </p>
      </div>
    </div>
  )
}

export default SearchResult
