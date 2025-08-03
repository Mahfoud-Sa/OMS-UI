// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { postApi } from '@renderer/lib/http'
import { gotRole } from '@renderer/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit'
import { Link, useNavigate } from 'react-router-dom'
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
  const qc = useQueryClient()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const handleSignOut = () => {
    setIsSigningOut(true)
    postApi('/Account/Logout', {})
      .then(() => {
        signOut()
        qc.clear()
        navigate('login')
      })
      .finally(() => {
        setIsSigningOut(false)
      })
  }
  const auth = useAuthUser()

  if (issAuthenticated()) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="justify-between w-44 border">
          <Button variant="ghost" className="relative flex gap-1">
            <img
              className="w-[35px] h-[35px]"
              src={auth()?.imagePath || userIcon}
              alt={'Unknown User'}
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/50'
              }}
            />
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {auth()?.userName || 'Unknown User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {auth()?.userType || 'Unknown User'}
              </p>
            </div>
            <ChevronDown size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {gotRole('Get Profile') && (
            <>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Link to="/profile" className=" block w-full">
                    الملف الشخصي
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
            تسجيل الخروج
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  return null
}
