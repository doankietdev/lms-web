import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { API_ROOT, API_VERSION } from '@/configs/env'
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation
} from '@/features/api/courseApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import ReactPlayer from 'react-player'
import { useAuth0 } from '@auth0/auth0-react'
import RichTextEditor from '@/components/RichTextEditor'
import LoadingSpinner from '@/components/LoadingSpinner'

const MEDIA_API = `${API_ROOT}/${API_VERSION}/media`

const LectureTab = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [input, setInput] = useState({
    lectureTitle: '',
    description: '',
    videoUrl: '',
    isPreviewFree: false
  })
  const [mediaProgress, setMediaProgress] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [btnDisable, setBtnDisable] = useState(false)
  const { courseId, lectureId } = useParams()
  const navigate = useNavigate()

  const { data: lectureData, isLoading: lectureByIdLoading } = useGetLectureByIdQuery(lectureId)
  const lecture = lectureData?.lecture

  useEffect(() => {
    if (lecture) {
      setInput((prev) => ({
        ...prev,
        lectureTitle: lecture.lectureTitle,
        description: lecture.description,
        isPreviewFree: lecture.isPreviewFree
      }))
    }
  }, [lecture])

  const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation()
  const [removeLecture, { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess }] =
    useRemoveLectureMutation()

  const fileChangeHandler = async (e) => {
    setBtnDisable(true)
    const file = e.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      setMediaProgress(true)
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total))
          },
          headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` }
        })

        if (res.data.success) {
          setInput((prev) => ({
            ...prev,
            videoUrl: res.data?.data?.url
          }))
          toast.success(res.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error('video upload failed')
      } finally {
        setMediaProgress(false)
        setBtnDisable(false)
      }
    }
  }

  const editLectureHandler = async () => {
    await editLecture({
      ...input,
      courseId,
      lectureId
    })
  }

  const removeLectureHandler = async () => {
    await removeLecture(lectureId)
  }

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message)
    }
    if (error) {
      toast.error(error.data?.message)
    }
  }, [isSuccess, error, data?.message, courseId])

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData?.message)
      navigate(`/admin/course/${courseId}/lecture`)
    }
  }, [courseId, navigate, removeData?.message, removeSuccess])

  return lectureByIdLoading ? (
    <LoadingSpinner />
  ) : (
    <Card>
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle>Edit Lecture</CardTitle>
          <CardDescription className="mt-2">Make changes and click save when done.</CardDescription>
        </div>
        <Button disbaled={removeLoading} variant="destructive" onClick={removeLectureHandler}>
          {removeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            'Remove Lecture'
          )}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className='flex flex-col gap-3'>
          <Label>Title</Label>
          <Input
            value={input.lectureTitle}
            onChange={(e) => setInput((prev) => ({ ...prev, lectureTitle: e.target.value }))}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className='flex flex-col gap-3'>
          <Label>Description</Label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>
        <div className='flex flex-col gap-3'>
          <Label>
            Video <span className="text-red-500">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            disabled={btnDisable}
            onChange={fileChangeHandler}
            placeholder="Ex. Introduction to Javascript"
            className="w-fit"
          />
          {(input.videoUrl || lecture?.videoUrl) && (
            <div className="mt-4">
              <ReactPlayer url={input.videoUrl || lecture?.videoUrl} controls />
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            checked={input.isPreviewFree}
            onCheckedChange={(value) => setInput((prev) => ({ ...prev, isPreviewFree: value }))}
            id="airplane-mode"
          />
          <Label htmlFor="airplane-mode">Free Preview</Label>
        </div>

        {mediaProgress && (
          <div>
            <Progress value={uploadProgress} />
            <p>{uploadProgress}% uploaded</p>
          </div>
        )}

        <div className='mt-2'>
          <Button disabled={isLoading} onClick={editLectureHandler}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Update Lecture'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LectureTab
