import CreateBtn from '@renderer/components/layouts/create-btn'
import Loader from '@renderer/components/layouts/loader'
import TablePagination from '@renderer/components/tables/table-pagination'
import { useToast } from '@renderer/components/ui/use-toast_1'
import { UserCard } from '@renderer/components/ui/UserCard'
import { deleteApi, getApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { DeliveryUserCardProps } from '@renderer/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { useSearchParams } from 'react-router-dom'
import Statistics from './_components/statistics'
import UsersSearch from './_components/users-search'

const Users = () => {
  const [usersData, setUsersData] = useState<DeliveryUserCardProps[] | undefined>(undefined)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('query')
  const page = searchParams.get('page')

  // get users
  const {
    data: fetchedData,
    isPending,
    isError,
    error
  } = useQuery({
    queryKey: ['users', query, page],
    queryFn: () =>
      getApi<{
        users: DeliveryUserCardProps[]
        total: number
        pageNumber: number
        pageSize: number
        pages: number
      }>('/users', {
        params: {
          pageNumber: page,
          firstName: query
        }
      })
  })
  const authUser = useAuthUser()
  const userRole = authUser()?.userType as string
  console.log('userRole', userRole)
  useEffect(() => {
    if (fetchedData?.data.users) {
      // extract the current user from the fetched data if it exists
      const filteredUsers = fetchedData.data.users.filter(
        (user) => user.id !== (authUser()?.id as string)
      )
      setUsersData(filteredUsers)
    }
  }, [fetchedData])

  useEffect(() => {
    if (fetchedData?.data.total) {
      setTotalUsers(fetchedData.data.total)
    }
  }, [fetchedData])

  // delete users
  const queryClient = useQueryClient()
  const { mutate } = useMutation({
    mutationFn: (id: string) => {
      return deleteApi(`/users/${id}`)
    },
    onSuccess: () => {
      toast({
        title: 'تم الحذف بنجاح',
        description: `تم إتمام العملية بنجاح`,
        variant: 'success'
      })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: () => {
      toast({
        title: 'فشلت علمية الحذف',
        description: `حصل خطأ ما`,
        variant: 'destructive'
      })
    }
  })

  if (isPending)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <Loader size={40} color={'#DA972E'} />
      </div>
    )

  if (isError) return <div>{error.message}</div>

  return (
    <section className="p-5">
      <Statistics totalUsers={totalUsers} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <UsersSearch />
          <CreateBtn
            disable={!gotRole('Add User') && userRole === 'بائع'}
            title={'إضافة مستخدم'}
            href={'new'}
            className="w-[200px]"
          />
        </div>

        <div className="p-4 h-96 overflow-auto my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {usersData?.map((user) => (
              <UserCard
                key={user.id}
                userId={user.id}
                userInfo={{ name: user.userName, role: user.userType, imagePath: user.imagePath }}
                contactInfo={{
                  fullName: user.fullName,
                  phone: user.phoneNumber,
                  workPlace: user.workPlace
                }}
                removeSelectedUser={(id) => mutate(id)}
              />
            ))}
          </div>
        </div>

        <TablePagination
          total={fetchedData?.data.total || 0}
          page={fetchedData?.data.pageNumber || 0}
          pageSize={fetchedData?.data.pageSize || 0}
        />
      </div>
    </section>
  )
}

export default Users
