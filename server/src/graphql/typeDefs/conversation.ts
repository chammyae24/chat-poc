const typeDefs = /* GraphQL */ `
  type Participant {
    id: String
    username: String
    email: String
  }

  type Conversation {
    id: String
    name: String
    created_at: String
    updated_at: String
    messages: [Message]
    participants: [Participant]
  }

  type Query {
    getConversation(id: String!): Conversation
  }

  type Mutation {
    createConversation(name: String, participants: [String!]!): Conversation
  }
`;

export default typeDefs;
