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
    sender: Sender
  }

  type Mutation {
    sendMessage(conversation_id: String!, content: String!): Message
  }

  type Subscription {
    message: Message
  }
`;

export default typeDefs;
