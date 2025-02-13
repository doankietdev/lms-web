import LoadingSpinner from '@/components/LoadingSpinner'
import RichTextEditor from '@/components/RichTextEditor'
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
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

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

  const [editLecture, { isLoading }] = useEditLectureMutation()
  const [removeLecture, { isLoading: removeLoading }] = useRemoveLectureMutation()

  const fileChangeHandler = async (e) => {
    setBtnDisable(true)
    const file = e.target.files[0]
    if (!file) return

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
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to upload video')
    } finally {
      setMediaProgress(false)
      setBtnDisable(false)
    }
  }

  const editLectureHandler = async () => {
    try {
      await editLecture({
        ...input,
        courseId,
        lectureId
      }).unwrap()
      navigate(`/instructor/course/${courseId}/lecture`)
      toast.success('Edit lecture successfully')
    } catch (error) {
      toast.error(error.data?.message)
    }
  }

  const removeLectureHandler = async () => {
    try {
      await removeLecture(lectureId).unwrap()
      navigate(`/instructor/course/${courseId}/lecture`)
      toast.success('Remove lecture successfully')
    } catch (error) {
      toast.error(error.data?.message)
    }
  }

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
      <CardContent className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label>Title</Label>
          <Input
            value={input.lectureTitle}
            onChange={(e) => setInput((prev) => ({ ...prev, lectureTitle: e.target.value }))}
            type="text"
            placeholder="Ex. Introduction to Javascript"
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Description</Label>
          <RichTextEditor input={input} setInput={setInput} />
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-[400px] flex flex-col gap-3">
            <Label>
              Video <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="video/*"
              disabled={btnDisable}
              onChange={fileChangeHandler}
              className="w-full"
            />
            {mediaProgress && (
              <div>
                <Progress value={uploadProgress} />
                <p className="text-center mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>
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

        <div className="mt-2">
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
