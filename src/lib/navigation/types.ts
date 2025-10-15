export type UserRole = "admin" | "manager" | "user" | "viewer"

export interface AppSidebarProps {
  userRole?: UserRole
}