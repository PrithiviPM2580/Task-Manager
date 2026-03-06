import DashboardLayout from "@/components/layout/DashboardLayout";
import { useUserAuth } from "@/hooks/useUserAuth";

const UserDashboard = () => {
  useUserAuth();
  return <DashboardLayout />;
};

export default UserDashboard;
