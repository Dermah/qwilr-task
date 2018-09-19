import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    viewer: User
  }

  type User {
    cash: Float!
  }
`;

let cashInHand = 0;

const resolvers = {
  Query: {
    viewer: () => ({})
  },
  User: {
    cash: () => cashInHand
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("Server is running on http://localhost:4000"));
