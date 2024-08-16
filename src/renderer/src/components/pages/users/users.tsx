import CreateBtn from '@renderer/components/layouts/create-btn'
import { DeliveryAgentCard } from '@renderer/components/ui/DeliveryAgentCard'
import { useState } from 'react'
import userIcon from '../../icons/user.svg'
import Statistics from './_components/statistics'
import UsersSearch from './_components/users-search'
import './users.css'

const Users = () => {
  const initialAgentData = [
    {
      id: '1',
      name: 'Agent 1',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '2',
      name: 'Agent 2',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '3',
      name: 'Agent 3',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '4',
      name: 'Agent 4',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '5',
      name: 'Agent 5',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '6',
      name: 'Agent 6',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '7',
      name: 'Agent 7',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '8',
      name: 'Agent 8',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '9',
      name: 'Agent 9',
      role: 'manager',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '10',
      name: 'Agent 10',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '11',
      name: 'Agent 11',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '12',
      name: 'Agent 12',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '13',
      name: 'Agent 13',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '14',
      name: 'Agent 14',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '15',
      name: 'Agent 15',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '16',
      name: 'Agent 16',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    },
    {
      id: '17',
      name: 'Agent 17',
      role: 'retailer',
      imageSrc: userIcon,
      phone: '123-456-7890',
      date: '2000-02-12'
    }
    // Add more agent data as needed
  ]

  const [agentData, setAgentData] = useState(initialAgentData)
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined)

  const removeSelectedAgent = (id: string) => {
    const updatedAgentData = agentData.filter((agent) => agent.id !== id)
    setAgentData(updatedAgentData)
  }
  const filterAgentsByRole = (role: string | undefined) => {
    if (!role) {
      setAgentData(initialAgentData)
      setSelectedRole(undefined)
      return
    }
    const updatedAgentData = initialAgentData.filter((agent) => agent.role === role)
    setAgentData(updatedAgentData)
    setSelectedRole(role)
  }
  return (
    <section className="p-5">
      <Statistics selectedRole={selectedRole} filterData={(role) => filterAgentsByRole(role)} />
      <div className="bg-white rounded-lg min-h-[500px] p-7 shadow-sm mt-6">
        <div className="flex gap-3 flex-row h-[50px]">
          <UsersSearch />
          <CreateBtn title={'إضافة مستخدم'} href={'new'} className="w-[200px]" />
        </div>
        <div className="p-4 h-96 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agentData.map((agent) => (
              <DeliveryAgentCard
                key={agent.id}
                agentId={agent.id}
                agentInfo={{ name: agent.name, role: agent.role, imageSrc: agent.imageSrc }}
                contactInfo={{ phone: agent.phone, date: agent.date }}
                removeSelectedAgent={(id) => removeSelectedAgent(id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Users
