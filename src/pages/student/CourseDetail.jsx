import BuyCourseButton from '@/components/BuyCourseButton'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi'
import { formatCash } from '@/lib/utils'
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'

const CourseDetail = () => {
  const [previewLecture, setPreviewLecture] = useState(null)
  const params = useParams()
  const courseId = params.courseId
  const navigate = useNavigate()
  const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId)
  const [isFree, setIsFree] = useState(false)

  const { course, purchased, isOwner } = data || {}

  useEffect(() => {
    if (isLoading) return
    setIsFree(() => course?.coursePrice === 0)
  }, [course?.coursePrice, isLoading])

  const handleContinueCourse = () => {
    navigate(`/course-progress/${courseId}`)
  }

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <>
      <div className="space-y-5">
        <div className="bg-[#2D2F31] text-white">
          <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
            <h1 className="font-bold text-2xl md:text-3xl">{course?.courseTitle}</h1>
            <p className="text-base md:text-lg">{course?.subTitle}</p>
            <p>
              Created By{' '}
              <span className="text-[#C0C4FC] underline italic">{course?.creator.name}</span>
            </p>
            <div className="flex items-center gap-2 text-sm">
              <BadgeInfo size={16} />
              <p>Last updated {moment(course?.createdAt).format('YYYY-MM-DD') ?? 'N/A'}</p>
            </div>
            <p>Students enrolled: {course?.enrolledStudents.length}</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
          <div className="w-full lg:w-1/2 space-y-5">
            <h1 className="font-bold text-xl md:text-2xl">Description</h1>
            <p className="text-lg" dangerouslySetInnerHTML={{ __html: course.description }} />
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>{course?.lectures?.length ?? 0} lectures</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.lectures.map((lecture, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span>
                        {lecture?.isPreviewFree ? <PlayCircle size={14} /> : <Lock size={14} />}
                      </span>
                      <p>{`${idx + 1}. ${lecture.lectureTitle}`}</p>
                    </div>
                    {lecture?.isPreviewFree && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setPreviewLecture(lecture)}
                      >
                        Preview
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="w-full lg:w-1/3">
            <Card>
              <CardContent className="p-4 flex flex-col">
                <div className="w-full aspect-video mb-4">
                  <ReactPlayer
                    width="100%"
                    height={'100%'}
                    url={course.lectures[0]?.videoUrl}
                    controls={true}
                  />
                </div>
                <h1 className="text-lg md:text-xl font-semibold flex items-center gap-4">
                  {formatCash(course?.coursePrice)}
                  {purchased && !isFree && !isOwner && (
                    <Badge variant="outline" className="bg-green-600 text-white">
                      Purchased
                    </Badge>
                  )}
                  {isFree && (
                    <Badge variant="outline" className="bg-green-600 text-white">
                      Free
                    </Badge>
                  )}
                  {isOwner && (
                    <Badge variant="outline" className="bg-orange-600 text-white">
                      Owner
                    </Badge>
                  )}
                </h1>
              </CardContent>
              <CardFooter className="flex justify-center p-4">
                {purchased || isOwner || isFree ? (
                  <Button
                    disabled={!course?.lectures?.length}
                    onClick={handleContinueCourse}
                    className="w-full"
                  >
                    Continue Course
                  </Button>
                ) : (
                  <BuyCourseButton courseId={courseId} />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={!!previewLecture} onOpenChange={(open) => !open && setPreviewLecture(null)}>
        <DialogContent
          style={{
            maxWidth: '60vw',
            maxHeight: '90vh',
            gap: '0'
          }}
        >
          <DialogHeader>
            <DialogDescription>Course Lecture Preview</DialogDescription>
            <DialogTitle className="!mt-4 text-3xl">{previewLecture?.lectureTitle}</DialogTitle>
          </DialogHeader>

          <div className="mt-3 flex flex-col gap-3  overflow-y-scroll">
            {previewLecture?.videoUrl && (
              <ReactPlayer
                width={'100%'}
                height={'100%'}
                url={previewLecture?.videoUrl}
                controls={true}
              />
            )}
            <p
              className="text-2xl"
              dangerouslySetInnerHTML={{
                __html: previewLecture?.description
              }}
            />
          </div>

          <DialogFooter>
            {/* <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
          {updateUserIsLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            'Save Changes'
          )}
        </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CourseDetail
