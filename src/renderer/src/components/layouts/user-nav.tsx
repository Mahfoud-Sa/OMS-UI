// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react'
import { useIsAuthenticated, useSignOut } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import userIcon from '../icons/user.svg'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

export type userData = {
  user: {
    name: string
    image: string
    id: number
  }
}

export function UserNav() {
  const navigate = useNavigate()
  const issAuthenticated = useIsAuthenticated()
  const signOut = useSignOut()
  const handleSignOut = () => {
    signOut()
    navigate('login')
  }
  // const auth = useAuthUser()

  if (issAuthenticated()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="justify-between w-44 border">
          <Button variant="ghost" className="relative flex gap-1">
            {/* <Avatar className=''> */}
            <img className="w-[35px] h-[35px]" src={userIcon} alt={'Unknown User'} />
            {/* {!session.user?.image && <span>{session.user?.employeeName}</span>}  */}
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{'Unknown User'}</p>
              <p className="text-xs leading-none text-muted-foreground">{'Unknown User'}</p>
            </div>
            <ChevronDown size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>الملف الشخصي</DropdownMenuItem>
            <DropdownMenuItem disabled>الإعدادات</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>تسجيل الخروج</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null
}
