import CreateBtn from '@renderer/components/layouts/create-btn'
import TablePagination from '@renderer/components/tables/table-pagination'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { useToast } from '@renderer/components/ui/use-toast'
import { UserCard } from '@renderer/components/ui/UserCard'
import { deleteApi, getApi } from '@renderer/lib/http'
import { DeliveryUserCardProps } from '@renderer/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
    queryKey: ['users', query],
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

  useEffect(() => {
    if (fetchedData?.data.users) {
      setUsersData(fetchedData.data.users)
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

  // filter users

  return (
    <section className="p-5">
      <Statistics totalUsers={totalUsers} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <UsersSearch />
          <CreateBtn title={'إضافة مستخدم'} href={'new'} className="w-[200px]" />
        </div>

        <div className="p-4 h-96 overflow-auto mt-4">
          {isPending && <Skeleton className="h-96" />}
          {isError && <div>{error.message}</div>}
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

        <TablePagination total={11} page={fetchedData?.data.pageNumber || 1} pageSize={10} />
      </div>
    </section>
  )
}

export default Users
