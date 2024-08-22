import CreateBtn from '@renderer/components/layouts/create-btn'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { useToast } from '@renderer/components/ui/use-toast'
import { UserCard } from '@renderer/components/ui/UserCard'
import { deleteApi, getApi } from '@renderer/lib/http'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Statistics from './_components/statistics'
import UsersSearch from './_components/users-search'

const Users = () => {
  interface DeliveryUserCardProps {
    id: string
    fullName: string
    userName: string
    userType: string
    imagePath?: string
    phone: string
    workPlace: string
  }

  // Add more user data as needed
  const {
    data: fetchedData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      getApi<{ users: DeliveryUserCardProps[] }>('/api/Users', { params: { page: 1, pageSize: 2 } })
  })
  useEffect(() => {
    if (fetchedData?.data.users) {
      setUsersData(fetchedData.data.users)
    }
  }, [fetchedData])

  console.log(fetchedData)

  const [usersData, setUsersData] = useState<DeliveryUserCardProps[] | undefined>(undefined)
  console.log(usersData)
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (id: string) => {
      return deleteApi(`/api/Users/${id}`)
    }
    // onMutate: async (id) => {
    //   // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries(['users'])
    //   // Snapshot the previous value
    //   const previousUsers = queryClient.getQueryData('Users')
    //   // Optimistically update to the new value
    //   queryClient.setQueryData('Users', (old) => {
    //     return old.filter((user) => user.id !== id)
    //   })
    //   // Return a context object with the snapshotted value
    //   return { previousUsers }
    // },
    // onError: (err, variables, context) => {
    //   // If the mutation failed, use the context value to roll back
    //   queryClient.setQueryData('users', context.previousUsers)
    // },
    // onSettled: () => {
    //   queryClient.invalidateQueries('users')
    // }
  })

  const removeSelectedUser = async (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        // request to delete user by id
        mutation.mutate(id)
        const deletedUserData = usersData?.find((user) => user.id === id)
        const updateUsersData = usersData?.filter((user) => user.id !== id)
        setUsersData(updateUsersData)
        toast({
          title: 'تم الحذف بنجاح',
          description: `تم حذف ${deletedUserData?.fullName} بنجاح`,
          variant: 'success'
        })

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
  const filterUsersByRole = (role: string | undefined) => {
    if (!role) {
      setUsersData(usersData)
      setSelectedRole(undefined)
      return
    }
    const updateUsersData = usersData?.filter((user) => user.userType === role)
    setUsersData(updateUsersData)
    setSelectedRole(role)
  }
  return (
    <section className="p-5">
      <Statistics selectedRole={selectedRole} filterData={(role) => filterUsersByRole(role)} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <UsersSearch />
          <CreateBtn title={'إضافة مستخدم'} href={'new'} className="w-[200px]" />
        </div>
        <div className="p-4 h-96 overflow-auto mt-4">
          {isLoading && <Skeleton className="h-96" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {usersData?.map((user) => (
              <UserCard
                key={user.id}
                userId={user.id}
                userInfo={{ name: user.userName, role: user.userType, imagePath: user.imagePath }}
                contactInfo={{
                  fullName: user.fullName,
                  phone: user.phone,
                  workPlace: user.workPlace
                }}
                removeSelectedUser={(id) => removeSelectedUser(id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Users
