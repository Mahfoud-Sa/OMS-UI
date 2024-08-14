import CreateBtn from '@renderer/components/layouts/create-btn'
import Statistics from './_components/statistics'
import UsersSearch from './_components/users-search'

const Users = () => {
  return (
    <section className="p-5">
      <Statistics />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-5">
        <div className="flex gap-3 flex-row h-[50px]">
          <UsersSearch />
          <CreateBtn title={'إضافة مستخدم'} href={'new'} className="w-[200px]" />
        </div>
      </div>
    </section>
  )
}

export default Users
