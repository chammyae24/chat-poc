"use client";
import { useSession } from "next-auth/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

type Props = {
  children: ReactNode;
};

type SocketProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
  setId: Dispatch<SetStateAction<string | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
};

const SocketContext = createContext<SocketProps>({
  socket: undefined,
  setId: () => {},
  setToken: () => {}
});

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  return socket;
};

export const useSetSocket = () => {
  const { setId, setToken } = useContext(SocketContext);
  return { setId, setToken };
};

export function SocketProvider({ children }: Props) {
  const [id, setId] = useState<string>();
  const [token, setToken] = useState<string>();
  const [socket, setSocket] =
    useState<Socket<DefaultEventsMap, DefaultEventsMap>>();

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.accessToken) {
      setToken(session.user.accessToken);
    }
  }, [session?.user.accessToken]);

  useEffect(() => {
    if (!id && !token) return;
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
      query: { id, token }
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [id, token]);

  // console.log({ id, token });

  return (
    <SocketContext.Provider value={{ socket, setId, setToken }}>
      {children}
    </SocketContext.Provider>
  );
}
