import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CreateTask from "@/pages/admin/CreateTask";
import ManageTasks from "@/pages/admin/ManageTasks";
import ManageUsers from "@/pages/admin/ManageUsers";
import UserDashboard from "@/pages/user/UserDashboard";
import MyTasks from "@/pages/user/MyTasks";
import ViewTaskDetails from "@/pages/user/ViewTaskDetails";

const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create-task" element={<CreateTask />} />
          <Route path="/admin/tasks" element={<ManageTasks />} />
          <Route path="/admin/users" element={<ManageUsers />} />
        </Route>

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/tasks" element={<MyTasks />} />
          <Route path="/user/task-details/:id" element={<ViewTaskDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
