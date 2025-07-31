import { gotRole } from '@renderer/lib/utils'
import { UserIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Icons } from '../icons/icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from './dialog'

interface DeliveryUserCardProps {
  userId: string
  userInfo: UserInfoProps
  contactInfo: ContactInfoProps
  removeSelectedUser: (id: string) => void
}
interface ContactInfoProps {
  fullName: string
  phone: string
  workPlace: string
}
interface UserInfoProps {
  name: string
  role: string
  imagePath?: string
}

const UserInfo: React.FC<UserInfoProps> = ({ name, role, imagePath }) => {
  return (
    <div className="flex gap-2 items-center w-full text-right">
      <img
        loading="lazy"
        src={imagePath || 'https://placehold.co/50'}
        className="object-cover shrink-0 self-stretch my-auto rounded-lg aspect-square w-[50px]"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/50'
        }}
        alt={`${name} - ${role}`}
      />
      <div className="flex flex-col self-stretch my-auto w-[107px]">
        <h2 className="text-base font-medium text-zinc-900">{name}</h2>
        <p className="text-sm leading-none text-orange-400">{role}</p>
      </div>
    </div>
  )
}

const ContactInfo: React.FC<ContactInfoProps> = ({ fullName, phone, workPlace }) => {
  const PhoneIcon = Icons.phone
  const MapPin = Icons.mapPin
  return (
    <div className="flex flex-col items-start self-start mt-5 w-full text-sm leading-none text-center max-w-[153px] text-zinc-900">
      <div className="flex gap-1.5 items-center self-stretch w-full">
        <UserIcon className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square" />
        <p className="self-stretch my-auto">{fullName}</p>
      </div>
      <div className="flex gap-1.5 items-center mt-2 whitespace-nowrap">
        <PhoneIcon className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square" />
        <p className="self-stretch my-auto">{phone}</p>
      </div>
      <div className="flex gap-1.5 items-center mt-2">
        <MapPin className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square" />
        <p className="self-stretch my-auto">{workPlace}</p>
      </div>
    </div>
  )
}

export const UserCard: React.FC<DeliveryUserCardProps> = ({
  userInfo,
  contactInfo,
  userId,
  removeSelectedUser
}) => {
  const MoreVerticalIcon = Icons.ellipsis
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  return (
    <>
      <section className="flex gap-4 items-center">
        <div className="flex flex-col justify-center self-stretch my-auto rounded-xl border border-solid border-slate-400 min-h-[165px] w-[250px] p-2">
          <div className="flex justify-center items-start w-full">
            <div className="flex flex-col w-auto">
              <UserInfo {...userInfo} />
              <ContactInfo {...contactInfo} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreVerticalIcon className="object-contain shrink-0 w-6 aspect-square" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {gotRole('Get User') && (
                    <Link to={`/users/${userId}`}>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                    </Link>
                  )}
                  {userInfo.role !== 'مشرف' && (
                    <DropdownMenuItem
                      onClick={() => {
                        setIsDialogOpen(true)
                      }}
                      // backgroundColor="orange"
                      // color="white"
                      className="btn"
                    >
                      حذف
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف المستخدم</DialogTitle>
          </DialogHeader>
          <DialogDescription>هل انت متاكد من حذف المستخدم؟</DialogDescription>
          <DialogFooter className="gap-4">
            <button
              onClick={() => {
                removeSelectedUser(userId)
                setIsDialogOpen(false)
              }}
              className="bg-red-500 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
            >
              نعم
            </button>
            <DialogClose asChild>
              <button>لا</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
