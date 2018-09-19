import { GraphQLServer } from "graphql-yoga";

const typeDefs = `
  type Query {
    viewer: User
  }

  type User {
    id: ID!
    cash: Float!
  }

  type Mutation {
    modifyFunds (changeAmount: Float!): ModifyFundsPayload
  }
  type ModifyFundsPayload {
    user: User
    newFundsAmount: Float
  }
`;

const SPUTNIK_USER_ID = "sputnik-12345";
let cashInHand = 0;

const resolvers = {
  Query: {
    viewer: () => ({ id: SPUTNIK_USER_ID })
  },
  User: {
    cash: () => cashInHand
  },
  Mutation: {
    modifyFunds: (_, { changeAmount }) => {
      if (cashInHand + changeAmount < 0) {
        throw new Error(`Not enough funds to withdraw $${changeAmount * -1}.`);
      }
      cashInHand += changeAmount;

      return {
        user: { id: SPUTNIK_USER_ID },
        newFundsAmount: cashInHand
      };
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("Server is running on http://localhost:4000"));
