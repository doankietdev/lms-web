import LoadingSpinner from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation
} from '@/features/api/courseProgressApi'
import { CheckCircle, CheckCircle2, CirclePlay } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import Confetti from 'react-confetti'
import { useNavigate, useParams } from 'react-router-dom'
import { useWindowSize } from 'react-use'

const CourseProgress = () => {
  const { width, height } = useWindowSize()
  const [completedCourse, setCompletedCourse] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
  const courseId = params.courseId
  const { data, isLoading, refetch } = useGetCourseProgressQuery(courseId)

  const [updateLectureProgress, { data: updateLectureData, isLoading: updateLectureLoading }] =
    useUpdateLectureProgressMutation()

  const [currentLecture, setCurrentLecture] = useState(null)

  const { courseDetails, progress, completed: isCourseCompleted } = data?.data ?? {}
  const { courseTitle } = courseDetails || {}

  const initialLecture = currentLecture || courseDetails?.lectures[0]

  useEffect(() => {
    if (updateLectureData?.data?.isCourseCompleted) {
      setCompletedCourse(true)

      const timer = setTimeout(() => {
        setCompletedCourse(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [updateLectureData?.data?.isCourseCompleted])

  useEffect(() => {
    if (courseDetails?.lectures && !courseDetails?.lectures?.length) {
      navigate(`/course-detail/${courseId}`)
    }
  }, [courseDetails?.lectures, courseDetails?.lectures?.length, courseId, navigate])

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed)
  }

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId })
    refetch()
  }

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture)
  }

  const handleCompleteLecture = async () => {
    await handleLectureProgress(currentLecture?._id || initialLecture?._id)
  }

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <>
      {completedCourse && (
        <>
          <Dialog open={completedCourse} onOpenChange={(open) => setCompletedCourse(open)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Completed The Course</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                Congratulations! You have completed the course 🎉
              </div>
            </DialogContent>
          </Dialog>
          <Confetti gravity={0.15} className="!z-[100]" width={width} height={height} />
        </>
      )}

      <div className="max-w-7xl mx-auto p-4">
        {/* Display course name  */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold flex justify-center items-center gap-4">
            {courseTitle}
            {isCourseCompleted && (
              <Badge variant="outline" className="bg-green-200 text-green-600">
                Completed
              </Badge>
            )}
          </h1>
          <Button disabled={isCourseCompleted} onClick={handleCompleteLecture} variant="outline">
            {updateLectureLoading ? (
              'Loading...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Mark as complete</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Video section  */}
          <div className="flex-1 md:w-4/6 h-fit rounded-lg shadow-lg p-4">
            {(currentLecture?.videoUrl || initialLecture?.videoUrl) && (
              <div>
                <video
                  src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                  controls
                  className="w-full h-auto md:rounded-lg"
                  onEnded={() => handleLectureProgress(currentLecture?._id || initialLecture?._id)}
                />
              </div>
            )}
            {/* Display current watching lecture title */}
            <div className="mt-4">
              <h3 className="font-medium text-3xl">
                {currentLecture?.lectureTitle || initialLecture?.lectureTitle}
              </h3>
              <p className='mt-2 text-sm'>
                {`Updated ${moment(currentLecture?.updatedAt || initialLecture?.updatedAt).format('LL')}`}
              </p>
              <p
                className="mt-6 text-2xl"
                dangerouslySetInnerHTML={{
                  __html: currentLecture?.description || initialLecture?.description
                }}
              />
            </div>
          </div>
          {/* Lecture Sidebar  */}
          <div className="flex flex-col w-full md:w-2/6 border-t md:border-t-0 md:border-l border-gray-200 md:pl-4 pt-4 md:pt-0">
            <h2 className="font-semibold text-xl mb-4">Course Lectures</h2>
            <div className="flex-1 overflow-y-auto">
              {courseDetails?.lectures.map((lecture, index) => (
                <Card
                  key={lecture._id}
                  className={`mb-3 hover:cursor-pointer transition transform ${
                    lecture._id === currentLecture?._id || lecture._id === initialLecture?._id
                      ? 'bg-gray-200 dark:dark:bg-gray-800'
                      : ''
                  } `}
                  onClick={() => handleSelectLecture(lecture)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      {isLectureCompleted(lecture._id) ? (
                        <CheckCircle2 size={24} className="text-green-500 mr-2" />
                      ) : (
                        <CirclePlay size={24} className="text-gray-500 mr-2" />
                      )}
                      <div>
                        <CardTitle className="text-lg font-medium">{`${index + 1}. ${
                          lecture.lectureTitle
                        }`}</CardTitle>
                      </div>
                    </div>
                    {isLectureCompleted(lecture._id) && (
                      <Badge variant={'outline'} className="bg-green-200 text-green-600">
                        Completed
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseProgress
