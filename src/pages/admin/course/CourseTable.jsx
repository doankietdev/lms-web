import LoadingSpinner from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useGetCreatorCourseQuery } from '@/features/api/courseApi'
import { Edit } from 'lucide-react'
import moment from 'moment'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal'
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer'
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal'
  },
  {
    invoice: 'INV006',
    paymentStatus: 'Pending',
    totalAmount: '$200.00',
    paymentMethod: 'Bank Transfer'
  },
  {
    invoice: 'INV007',
    paymentStatus: 'Unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'Credit Card'
  }
]

const CourseTable = () => {
  const { data, isLoading, refetch } = useGetCreatorCourseQuery()
  const navigate = useNavigate()

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isLoading) return <LoadingSpinner message="Loading..." />

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button onClick={() => navigate(`create`)}>Create a new course</Button>
      </div>
      <Table className="mt-3">
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead className="w-[100px]">Price (USD)</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[200px]">Created At</TableHead>
            <TableHead className="w-[200px]">Updated At</TableHead>
            <TableHead className="w-[200px]">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell onClick={() => navigate(`${course._id}`)} className='cursor-pointer' >{course.courseTitle}</TableCell>
              <TableCell className="font-medium">{course?.coursePrice || 'NA'}</TableCell>
              <TableCell>
                {' '}
                <Badge>{course.isPublished ? 'Published' : 'Draft'}</Badge>{' '}
              </TableCell>
              <TableCell>{moment(course.createdAt).format('YYYY-MM-DD hh:mm:ss A')}</TableCell>
              <TableCell>{moment(course.updatedAt).format('YYYY-MM-DD hh:mm:ss A')}</TableCell>
              <TableCell>
                <Button size="sm" variant="ghost" onClick={() => navigate(`${course._id}`)}>
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default CourseTable
