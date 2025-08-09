import { NavLink, useLocation } from "react-router-dom"
import { 
  User, 
  Palette, 
  Link as LinkIcon, 
  Crown, 
  Image, 
  Layout, 
  BarChart,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Account", url: "/dashboard", icon: User },
  { title: "Customize", url: "/dashboard?tab=customize", icon: Palette },
  { title: "Links", url: "/dashboard?tab=links", icon: LinkIcon },
  { title: "Premium", url: "/premium", icon: Crown },
  { title: "Image Host", url: "/image-host", icon: Image },
  { title: "Templates", url: "/templates", icon: Layout },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path.includes('?tab=')) {
      const [pathname, search] = path.split('?')
      const urlParams = new URLSearchParams(location.search)
      const tabParam = new URLSearchParams(search).get('tab')
      return currentPath === pathname && urlParams.get('tab') === tabParam
    }
    return currentPath === path && (!path.includes('dashboard') || location.search === '')
  }

  return (
    <Sidebar
      className={`bg-background/95 backdrop-blur-sm border-r border-smoke-800/50 relative z-30 ${collapsed ? "w-14" : "w-64"}`}
      collapsible="icon"
    >
      <SidebarContent className="bg-background/95 backdrop-blur-sm h-full">
        {/* Header */}
        <div className={`p-4 border-b border-smoke-800/50 ${collapsed ? "px-2" : ""}`}>
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-smoke-100">guns.lol</h2>
                <p className="text-xs text-smoke-400">Assets Uploader</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`
                      text-smoke-400 hover:text-smoke-100 hover:bg-smoke-800/50 rounded-lg transition-all
                      ${isActive(item.url) ? "bg-primary/20 text-primary border-r-2 border-primary" : ""}
                    `}
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/dashboard"}
                      className={({ isActive: navIsActive }) => `
                        flex items-center gap-2 w-full ${!collapsed ? 'px-3 py-2' : 'justify-center p-2'}
                        ${isActive(item.url) ? "text-primary" : "text-smoke-400 hover:text-smoke-100"}
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}