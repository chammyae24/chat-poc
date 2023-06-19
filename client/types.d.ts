interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  created_at: string;
  updated_at: string;
  sentMessages: ?Message[];
  conversations: ?Conversations[];
  contact: User[];
}

interface Message {
  id: string;
  content: string;
  sent_at: string;
  conversation_id: string;
  sender_id: string;
}

interface Conversations {
  id: string;
  name: ?string;
  created_at: string;
  updated_at: string;
  messages: ?Message[];
  participants: ?User[];
}
