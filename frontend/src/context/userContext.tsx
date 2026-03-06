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

    // try to read cached user from localStorage first
    try {
      const cached = localStorage.getItem("user");
      if (cached) {
        setUser(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch (err) {
      // ignore localStorage errors
    }

    const fetchUser = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.user);
        try {
          localStorage.setItem("user", JSON.stringify(response.user));
        } catch (err) {
          // ignore storage errors
        }
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
    try {
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      // ignore storage errors
    }
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
