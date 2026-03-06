import { Link } from "react-router-dom";
import { LogOutIcon, SettingsIcon, UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "./ui/sidebar";
import { useUser } from "@/context/userContext";

const Navbar = () => {
  const { user } = useUser();
  const displayUser = user ?? {
    name: "",
    email: "",
    role: "",
    profileImageUrl: "",
  };

  return (
    <header className="p-4 flex items-center justify-between sticky bg-background top-0 z-10">
      {/* Left */}
      <SidebarTrigger />
      {/* Right */}
      <nav className="flex items-center gap-4">
        <Link to="/">Dashboard</Link>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={displayUser.profileImageUrl} />
              <AvatarFallback>
                {(displayUser.name || "").charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={15}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="icon" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="icon" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive">
                <LogOutIcon className="icon" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Navbar;
