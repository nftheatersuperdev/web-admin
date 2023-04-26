import { Role } from 'auth/roles'

export interface SidebarItemsType {
  id: string
  href: string
  title: string
  icon: React.FC<unknown>
  children: SidebarItemsType[]
  badge?: string
  allowedRoles?: Role[]
}
