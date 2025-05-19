
import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"
import { useMobile } from "@/hooks/use-mobile"

const sidebarVariants = cva(
  "h-screen border-r flex flex-col transition-all duration-300",
  {
    variants: {
      variant: {
        default: "w-64",
        collapsed: "w-16",
        mobile: "absolute left-0 z-50 bg-background",
        hidden: "hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const SidebarContext = React.createContext<{
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  collapsed: false,
  setCollapsed: () => {},
  mobileOpen: false,
  setMobileOpen: () => {},
})

export const SidebarProvider = ({
  children,
  initialCollapsed = false,
  initialMobileOpen = false,
}: {
  children: React.ReactNode
  initialCollapsed?: boolean
  initialMobileOpen?: boolean
}) => {
  const [collapsed, setCollapsed] = React.useState(initialCollapsed)
  const [mobileOpen, setMobileOpen] = React.useState(initialMobileOpen)

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export const SidebarTrigger = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setMobileOpen } = useSidebar()
  const isMobile = useMobile()

  if (!isMobile) {
    return null
  }

  return (
    <button
      className={cn("p-2", className)}
      onClick={() => setMobileOpen((prev) => !prev)}
      {...props}
    >
      {children || "☰"}
    </button>
  )
}

export const Sidebar = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { collapsed, mobileOpen } = useSidebar()
  const isMobile = useMobile()

  const variant = React.useMemo(() => {
    if (isMobile) {
      return mobileOpen ? "mobile" : "hidden"
    }
    return collapsed ? "collapsed" : "default"
  }, [collapsed, isMobile, mobileOpen])

  return (
    <div
      className={cn(sidebarVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const SidebarHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { collapsed, setCollapsed } = useSidebar()
  const isMobile = useMobile()

  return (
    <div
      className={cn(
        "h-16 border-b flex items-center px-4 justify-between",
        className
      )}
      {...props}
    >
      {children || (
        <>
          <div className="flex items-center space-x-2">
            {!collapsed && <span className="font-semibold">Dashboard</span>}
          </div>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted"
            >
              {collapsed ? "→" : "←"}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export const SidebarContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)} {...props}>
      {children}
    </div>
  )
}

export const SidebarFooter = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("h-16 border-t flex items-center p-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const SidebarGroup = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
}

export const SidebarGroupLabel = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { collapsed } = useSidebar()

  if (collapsed) {
    return null
  }

  return (
    <div
      className={cn("text-sm font-medium text-muted-foreground mb-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const SidebarGroupContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export const SidebarMenu = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => {
  return <ul {...props}>{children}</ul>
}

export const SidebarMenuItem = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => {
  return <li {...props}>{children}</li>
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    active?: boolean
    asChild?: boolean
  }
>(({ className, active, asChild = false, children, ...props }, ref) => {
  const { collapsed } = useSidebar()
  const Comp = asChild ? React.Fragment : "button"
  const childProps = asChild ? {} : props

  return (
    <Comp {...childProps}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50",
          active && "bg-accent/50 font-medium text-accent-foreground",
          collapsed ? "justify-center p-2" : "",
          className
        )}
        ref={asChild ? undefined : ref}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return child
          }
          if (typeof child === "string" && !collapsed) {
            return child
          }
          return null
        })}
      </div>
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"
