import { getUserProfile } from "@/services/auth.service";
import React, { createContext, useState, useEffect } from "react";
import { toast } from "sonner";

export const UserContext = createContext<
  | {
      user: any;
      loading: boolean;
      updateUser: (userData: any) => void;
      clearUser: () => void;
    }
  | undefined
>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.user);
      } catch (error) {
        toast.error("Failed to fetch user profile. Please login again.");
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = (userData: any) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
