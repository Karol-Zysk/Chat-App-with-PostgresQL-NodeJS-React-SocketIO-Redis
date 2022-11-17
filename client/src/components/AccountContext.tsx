import { useNavigate } from "react-router";
import React, { useState, useEffect, ReactElement } from "react";

interface AccountProps {
  children: any;
}
interface ContextProps {
  user: { loggedIn: boolean };
  setUser: React.Dispatch<React.SetStateAction<{ loggedIn: boolean }>>;
}

export const AccountContext = React.createContext<ContextProps>();

const UserContext = ({ children }: AccountProps) => {
  const [user, setUser] = useState({ loggedIn: false });
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3000/auth/login", {
      credentials: "include",
    })
      .catch((err) => {
        setUser({ loggedIn: false });
        return;
      })
      .then((r) => {
        if (!r || !r.ok || r.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (!data) {
          setUser({ loggedIn: false });
          return;
        }
        setUser({ ...data });
        navigate("/home");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
