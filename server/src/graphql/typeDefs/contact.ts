const typeDefs = /* GraphQL */ `
  type Contact {
    id: String
    name: String
    created_at: String
    updated_at: String
    userId: String
    username: String
    email: String
    contactOwnerId: String
  }

  type Mutation {
    addContact(contactUsername: String!): Contact
  }
`;

export default typeDefs;
