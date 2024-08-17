import userIcon from '@renderer/components/icons/user.svg'
import CreateBtn from '@renderer/components/layouts/create-btn'
import { useToast } from '@renderer/components/ui/use-toast'
import { UserCard } from '@renderer/components/ui/UserCard'
import { useState } from 'react'
import Statistics from './_components/statistics'
import UsersSearch from './_components/users-search'

const Users = () => {
  const initialUserData = [
    {
      id: '1',
      name: 'User 1',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '2',
      name: 'User 2',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '3',
      name: 'User 3',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '4',
      name: 'User 4',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '5',
      name: 'User 5',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '6',
      name: 'User 6',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '7',
      name: 'User 7',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '8',
      name: 'User 8',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '9',
      name: 'User 9',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '10',
      name: 'User 10',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '11',
      name: 'User 11',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '12',
      name: 'User 12',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '13',
      name: 'User 13',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '14',
      name: 'User 14',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '15',
      name: 'User 15',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '16',
      name: 'User 16',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '17',
      name: 'User 17',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    }
    // Add more user data as needed
  ]

  const [usersData, setUsersData] = useState(initialUserData)
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)
  const { toast } = useToast()

  const removeSelectedUser = (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        const deletedUserData = usersData.find((user) => user.id === id)
        const updateUsersData = usersData.filter((user) => user.id !== id)
        setUsersData(updateUsersData)
        toast({
          title: 'تم الحذف بنجاح',
          description: `تم حذف ${deletedUserData?.name} بنجاح`,
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
      setUsersData(initialUserData)
      setSelectedRole(undefined)
      return
    }
    const updateUsersData = initialUserData.filter((user) => user.role === role)
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {usersData.map((user) => (
              <UserCard
                key={user.id}
                userId={user.id}
                userInfo={{ name: user.name, role: user.role, imageSrc: user.imageSrc }}
                contactInfo={{ phone: user.phone, date: user.date }}
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
