import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState
} from "react";

type Props = {
  children: ReactNode;
};

type ConversationContextType = {
  conversations: ConversationStateType;
  setConversations: Dispatch<SetStateAction<ConversationStateType>>;
};

export type ConversationStateType = {
  [key: string]: Message[];
};

const ConversationContext = createContext<ConversationContextType>({
  conversations: {},
  setConversations: () => null
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSetConversations = () =>
  useContext(ConversationContext).setConversations;

// eslint-disable-next-line react-refresh/only-export-components
export const useConversations = (id: string) => {
  const { conversations } = useContext(ConversationContext);

  if (conversations[id]) {
    return conversations[id];
  } else {
    return null;
  }
};

const ConversationProvider = ({ children }: Props) => {
  const [conversations, setConversations] = useState<ConversationStateType>({});

  return (
    <ConversationContext.Provider value={{ conversations, setConversations }}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
