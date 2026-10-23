import { useState } from 'react'
import { KeyRound, LogOut, User as UserIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { ChangePasswordDialog } from '@/features/auth/ChangePasswordDialog'
import { ROUTES } from '@/routes'

export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  if (!user) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-ring flex items-center gap-2 rounded-full">
          <Avatar initials={user.avatarInitials} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="space-y-1">
            <p className="text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs font-normal text-muted">{user.email}</p>
            <Badge tone={user.role === 'ADMIN' ? 'brand' : user.role === 'MANAGER' ? 'warning' : 'info'}>
              {user.role === 'ADMIN' ? 'Admin' : user.role === 'MANAGER' ? 'Manager' : 'Trainee'}
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === 'TRAINEE' && (
            <DropdownMenuItem onSelect={() => navigate(ROUTES.profile)}>
              <UserIcon className="h-4 w-4" /> My Profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setChangePasswordOpen(true)
            }}
          >
            <KeyRound className="h-4 w-4" /> Change Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              void logout().then(() => navigate(ROUTES.login))
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </>
  )
}
