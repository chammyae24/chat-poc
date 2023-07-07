interface SessionUser {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  accessToken?: string;
}

interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  created_at: string;
  updated_at: string;
  sentMessages: ?Message[];
  conversations: ?{
    conversation: Conversations;
  }[];
  contact: User[];
  token: ?string;
}

interface Message {
  id: string;
  content: string;
  sent_at: string;
  sender: {
    id: string;
    username: string;
  };
}

interface Conversations {
  id: string;
  name: ?string;
  created_at: string;
  updated_at: string;
  messages: ?Message[];
  lastMessage: ?Message;
  participants: ?User[];
}
