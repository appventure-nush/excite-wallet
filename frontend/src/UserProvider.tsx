import { createContext, useCallback, useEffect, useState } from "react";
import { UserDetails } from "./types/user";
import { getUser } from "./api";

export const UserContext = createContext<{
  user: UserDetails | null | undefined;
  updateUser: () => Promise<void>;
}>({
  user: null,
  updateUser: async () => {},
});

function usersEqual(
  oldUser: UserDetails | null | undefined,
  newUser: UserDetails | null,
) {
  if (oldUser === undefined) {
    return false;
  }
  if (oldUser === newUser) {
    return true; // both are null
  }
  if (oldUser === null || newUser === null) {
    return false; // one is null, the other is not
  }

  return (
    oldUser.username === newUser.username &&
    oldUser.type === newUser.type &&
    oldUser.balance === newUser.balance
  );
}

function UserProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDetails | null | undefined>(undefined);
  useEffect(() => {
    getUser().then(setUser);
  }, []);
  const updateUser = useCallback(async () => {
    const newUser = await getUser();
    if (usersEqual(user, newUser)) {
      return;
    }
    setUser(newUser);
  }, [user]);
  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default UserProvider;
