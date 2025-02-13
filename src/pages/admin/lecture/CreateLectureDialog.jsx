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
import { useCreateLectureMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

// eslint-disable-next-line react/prop-types
const CreateLectureDialog = ({ onSuccess = () => {} }) => {
  const [lectureTitle, setLectureTitle] = useState('')
  const params = useParams()
  const courseId = params.courseId
  const [open, setOpen] = useState(false)

  const [createLecture, { isLoading }] = useCreateLectureMutation()

  const createLectureHandler = async () => {
    try {
      await createLecture({ lectureTitle, courseId }).unwrap()
      setOpen(false)
      setLectureTitle('')
      onSuccess()
      toast.success('Create lecture successfully')
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to create new course')
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create new lecture</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Lecture</DialogTitle>
            <DialogDescription>
              Let&apos;s add lectures, add some basic details for your new lecture
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                type="text"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isLoading} onClick={createLectureHandler}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CreateLectureDialog
