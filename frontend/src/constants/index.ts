import {
  CalendarCheckIcon,
  LayoutDashboardIcon,
  SquarePlusIcon,
  UsersIcon,
} from "lucide-react";

export const ADMIN_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Manage Tasks",
    url: "/admin/tasks",
    icon: CalendarCheckIcon,
  },
  {
    title: "Create Task",
    url: "/admin/create-task",
    icon: SquarePlusIcon,
  },
  {
    title: "Team Members",
    url: "/admin/users",
    icon: UsersIcon,
  },
];

export const USER_SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/user/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "My Tasks",
    url: "/user/tasks",
    icon: CalendarCheckIcon,
  },
];
