import { useUser } from "@/context/userContext";
import Navbar from "../Navbar";
import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../AppSidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const { user } = useUser();
  const mappedUser = user
    ? {
        name: (user as any).name ?? (user as any).fullName ?? "",
        email: (user as any).email ?? "",
        role: (user as any).role ?? "",
        profileImageUrl:
          (user as any).profileImageUrl ?? (user as any).profileImage ?? "",
      }
    : { name: "", email: "", role: "", profileImageUrl: "" };
  return (
    <>
      <div className="flex">
        <SidebarProvider>
          <AppSidebar user={mappedUser} />
          <main className="w-full">
            <Navbar />
            <div className="px-4">
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;
