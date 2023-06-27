const typeDefs = /* GraphQL */ `
  type Session {
    name: String
    email: String
    token: String
  }

  type User {
    id: String
    username: String
    email: String
    created_at: String
    conversations: [Conversation]
    contacts: [Contact]
  }

  type Query {
    login(username: String!, password: String!): Session
    getLoginUser: User
  }

  type SignUpMsg {
    message: String
  }

  type Mutation {
    signUp(username: String!, email: String!, password: String!): SignUpMsg
    randomNumber: Float
  }

  type Subscription {
    randomNumber: Float!
  }
`;

export default typeDefs;
