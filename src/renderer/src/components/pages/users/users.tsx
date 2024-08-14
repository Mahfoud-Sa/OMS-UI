import CreateBtn from '@renderer/components/layouts/create-btn'
import { DeliveryAgentCard } from '@renderer/components/ui/DeliveryAgentCard'
import userIcon from '../../icons/user.svg'
import Statistics from './_components/statistics'
import UsersSearch from './_components/users-search'
import './users.css'

const Users = () => {
  const agentData = [
    {
      agentInfo: { name: 'Agent 1', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 2', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 3', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 4', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 5', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 6', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 7', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    },
    {
      agentInfo: { name: 'Agent 8', role: 'مدير', imageSrc: userIcon },
      contactInfo: { phone: '123-456-7890', date: '2000-02-12' }
    }
    // Add more agent data as needed
  ]
  return (
    <section className="p-5">
      <Statistics />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <UsersSearch />
          <CreateBtn title={'إضافة مستخدم'} href={'new'} className="w-[200px]" />
        </div>
        <div className="p-4 h-96 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agentData.map((agent, index) => (
              <DeliveryAgentCard
                key={index}
                agentInfo={agent.agentInfo}
                contactInfo={agent.contactInfo}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Users
