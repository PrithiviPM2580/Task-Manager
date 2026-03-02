import { Outlet } from "react-router-dom";

interface Props {
  allowedRoles: string[];
}

const PrivateRoute = ({ allowedRoles }: Props) => {
  return <Outlet />;
};

export default PrivateRoute;
