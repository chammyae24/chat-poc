import { Dispatch, SetStateAction, createContext, useContext } from "react";

type Auth = {
  authUser: SessionUser | null;
  setAuthUser: Dispatch<SetStateAction<SessionUser | null>>;
};

export const AuthContext = createContext<Auth>({
  authUser: null,
  setAuthUser: () => {}
});

const useAuthContext = () => useContext(AuthContext);

export default useAuthContext;
