import { SidebarItemsType } from './types'
import SidebarNavListItem from './SidebarNavListItem'
import SidebarNavList from './SidebarNavList'

interface ReduceChildRoutesProps {
  depth: number
  page: SidebarItemsType
  items: JSX.Element[]
  currentRoute: string
}

const reduceChildRoutes = ({
  items,
  page,
  depth,
  currentRoute,
}: ReduceChildRoutesProps): JSX.Element[] => {
  const isActive = currentRoute === page.href

  if (page.children) {
    const isOpen = page.children.find((children) => children.href === currentRoute)

    items.push(
      <SidebarNavListItem
        depth={depth}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        open={!!isOpen}
        title={page.title}
        href={page.href}
        isActive={isActive}
      >
        <SidebarNavList depth={depth + 1} pages={page.children} />
      </SidebarNavListItem>
    )
  } else {
    items.push(
      <SidebarNavListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={page.title}
        badge={page.badge}
        title={page.title}
        isActive={isActive}
      />
    )
  }

  return items
}

export default reduceChildRoutes
