import { GraphQLServer } from "graphql-yoga";

import { IEXClient } from "iex-api";
import * as _fetch from "isomorphic-fetch";

const iex = new IEXClient(_fetch);

const typeDefs = `
  # Data source for stocks: Data provided for free by [IEX](https://iextrading.com/developer). View [IEX’s Terms of Use](https://iextrading.com/api-exhibit-a/).
  type Query {
    # The currently logged in user. There is no authentication at this time
    viewer: User
    # Field for querying stock information
    stock (
      id: ID!
    ): Stock
  }

  type User {
    id: ID!
    # The amount of funds current available to the user for purchasing stocks with
    cash: Float!
  }

  type Stock {
    # The same as the stock code (i.e. GOOG for google)
    id: ID!
    # From IEX: "the IEX real time price, the 15 minute delayed market price, or the previous close price"
    latestPrice: Float
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
    viewer: () => ({ id: SPUTNIK_USER_ID }),
    stock: async (_, { id }) => {
      const quote = await iex.stockQuote(id);
      return {
        id: quote.symbol,
        latestPrice: quote.latestPrice
      };
    }
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
