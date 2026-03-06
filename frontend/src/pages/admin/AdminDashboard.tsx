import { useUserAuth } from "@/hooks/useUserAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AdminDashboard = () => {
  useUserAuth();

  return <DashboardLayout />;
};

export default AdminDashboard;
