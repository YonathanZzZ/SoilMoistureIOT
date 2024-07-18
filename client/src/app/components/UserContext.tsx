'use client'

import { createContext, ReactNode, useState, Dispatch, SetStateAction, useEffect } from "react";
import cookies from 'js-cookie';

interface UserData {
  id: number;
  name: string;
}

interface UserContextValue {
  user: UserData | null;
  setUser: Dispatch<SetStateAction<UserData | null>>;
}

export const UserContext = createContext<UserContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    //extract user info from cookie, if exists
    const userCookie = cookies.get('user');
    if(!userCookie){
      return;
    }

    setUser(JSON.parse(userCookie));
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
