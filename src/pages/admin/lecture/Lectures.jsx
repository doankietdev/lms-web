import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { useGetCourseLectureQuery } from '@/features/api/courseApi'
import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Lecture from './Lecture'
import CreateLectureDialog from './CreateLectureDialog'
import { useEffect } from 'react'

const Lectures = () => {
  const params = useParams()
  const courseId = params.courseId

  const { data: lectureData, isLoading: lectureLoading, refetch } = useGetCourseLectureQuery(courseId)

  useEffect(() => {
    refetch()
  }, [refetch])

  if (lectureLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Link to={`/instructor/course/${courseId}`}>
        <Button size="icon" variant="outline" className="rounded-full">
          <ArrowLeft size={16} />
        </Button>
      </Link>
      <div className="mt-4">
        <h1 className="font-bold text-2xl capitalize">{lectureData?.courseTitle}</h1>
        <div className='flex items-center justify-between'>
          <h2 className="mt-1 font-medium text-lg">Course Content</h2>
          <CreateLectureDialog onSuccess={() => refetch()} />
        </div>
      </div>
      <div className="space-y-4 mt-4">
        {lectureData.lectures.length === 0 ? (
          <p>No lectures available</p>
        ) : (
          lectureData.lectures.map((lecture, index) => (
            <Lecture key={lecture._id} lecture={lecture} courseId={courseId} index={index} />
          ))
        )}
      </div>
    </>
  )
}

export default Lectures
