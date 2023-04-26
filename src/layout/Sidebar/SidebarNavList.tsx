import { ReactElement, Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import { hasAllowedRole } from 'auth/roles'
import { useAuth } from 'auth/AuthContext'
import { hasAllowedPrivilege } from 'auth/privileges'
import { SidebarItemsType } from './types'
import reduceChildRoutes from './reduceChildRoutes'

interface SidebarNavListProps {
  depth: number
  pages: SidebarItemsType[]
}

function SidebarNavList({ pages, depth }: SidebarNavListProps): ReactElement {
  const router = useLocation()
  const { getRole, getPrivileges } = useAuth()
  const currentRoute = router.pathname
  const currentUserRole = getRole()
  const currentUserPrivileges = getPrivileges()
  const filteredPages = pages.filter((page) => {
    const isValidRole = page.allowedRoles && hasAllowedRole(currentUserRole, page.allowedRoles)
    const isValidPrivilege =
      page.allowedPrivileges && hasAllowedPrivilege(currentUserPrivileges, page.allowedPrivileges)

    if (isValidPrivilege || isValidRole) {
      return page
    }
    return false
  })

  const childRoutes = filteredPages.reduce(
    (items, page) => reduceChildRoutes({ items, page, currentRoute, depth }),
    [] as JSX.Element[]
  )

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <Fragment>{childRoutes}</Fragment>
}

export default SidebarNavList
