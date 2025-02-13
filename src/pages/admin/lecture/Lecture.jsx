import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Edit } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate()
  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`)
  }
  return (
    <Card className="rounded-md">
      <CardContent className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
          <p className="font-semibold">
            Lecture {index + 1}.
          </p>
          <p>
            {lecture.lectureTitle}
          </p>
        </div>
        <Edit
          onClick={goToUpdateLecture}
          size={20}
          className=" cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        />
      </CardContent>
    </Card>
  )
}

export default Lecture
