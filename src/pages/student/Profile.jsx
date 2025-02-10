import LoadingSpinner from '@/components/LoadingSpinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { API_ROOT, API_VERSION } from '@/configs/env'
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/userApi'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import Course from './Course'
import { useAuth0 } from '@auth0/auth0-react'

const USER_API = `${API_ROOT}/${API_VERSION}/user`

const Profile = () => {
  const [name, setName] = useState('')
  const [mediaProgress, setMediaProgress] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [openEditProfile, setOpenEditProfile] = useState(false)
  const { getAccessTokenSilently } = useAuth0()

  const { data, isLoading, refetch } = useLoadUserQuery()
  const [
    updateUser,
    { data: updateUserData, isLoading: updateUserIsLoading, isError, error, isSuccess }
  ] = useUpdateUserMutation()

  useEffect(() => {
    if (isLoading) return
    setName(data?.user?.name)
  }, [data?.user?.name, isLoading])

  const onFileChangeHandler = useCallback(
    async (e) => {
      const file = e.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('avatar', file)
      setMediaProgress(true)
      try {
        await axios.patch(`${USER_API}/change-avatar`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total))
          },
          headers: { Authorization: `Bearer ${await getAccessTokenSilently()}` }
        })

        await refetch().unwrap()

        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Failed to change avatar')
      } finally {
        setMediaProgress(false)
      }
    },
    [getAccessTokenSilently, refetch]
  )

  const updateUserHandler = async () => {
    try {
      await updateUser({
        name
      })
      await refetch().unwrap()
      setOpenEditProfile(false)
      toast.success('Edit profile successfully')
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Failed to edit profile')
    }
  }

  if (isLoading) return <LoadingSpinner message="Loading..." />

  const user = data && data.user

  return (
    <div className="max-w-4xl mx-auto px-4 my-10">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage src={user?.photoUrl || 'https://github.com/shadcn.png'} alt="@shadcn" />
          </Avatar>

          {mediaProgress ? (
            <div>
              <Progress value={uploadProgress} />
              <p>{uploadProgress}% uploaded</p>
            </div>
          ) : (
            <Input onChange={onFileChangeHandler} type="file" accept="image/*" />
          )}
        </div>
        <div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Button onClick={() => setOpenEditProfile(true)} size="sm" className="mt-2">
            Edit Profile
          </Button>
          <Dialog open={openEditProfile} onOpenChange={(open) => setOpenEditProfile(open)} >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="col-span-3"
                    disabled={mediaProgress}
                  />
                  {mediaProgress && (
                    <div>
                      <Progress value={uploadProgress} />
                      <p>{uploadProgress}% uploaded</p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler}>
                  {updateUserIsLoading || isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you&apos;re enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses.length === 0 ? (
            <h1>You haven&apos;t enrolled yet</h1>
          ) : (
            user?.enrolledCourses?.map((course) => <Course course={course} key={course._id} />)
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
