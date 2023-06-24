const typeDefs = /* GraphQL */ `
  type Sender {
    id: String
    username: String
  }

  type Message {
    id: String
    content: String
    sent_at: String
    conversation_id: String
    sender_id: String
    sender: Sender
  }
`;

export default typeDefs;
