import { getUserProfile } from "@/services/auth.service";
import React, { createContext, useState, useEffect } from "react";

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

    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = (userData: any) => {
    setUser(userData);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
