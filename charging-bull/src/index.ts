import { GraphQLServer } from "graphql-yoga";

import { IEXClient } from "iex-api";
import { QuoteResponse } from "iex-api/apis/stocks";
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

    # Interesting lists of Stocks to consider
    lists: StockLists
  }

  type User {
    id: ID!

    # The amount of funds current available to the user for purchasing stocks with
    cash: Float!

    holdings: [Holding]
  }

  type Stock {
    # The same as the stock code (i.e. GOOG for google)
    id: ID!
    # The name of the company
    name: String!
    # From IEX: "the IEX real time price, the 15 minute delayed market price, or the previous close price"
    latestPrice: Float!
  }

  type Holding {
    stock: Stock!
    purchasePrice: Float!
  }

  type StockLists {
    gainers: [Stock]
  }

  type Mutation {
    modifyFunds (changeAmount: Float!): ModifyFundsPayload!
    buyStock (id: ID!, quantity: Int!): BuyStockPayload!
  }
  type ModifyFundsPayload {
    user: User!
    newFundsAmount: Float!
  }
  type BuyStockPayload {
    user: User!
    holding: Holding!
  }
`;

const SPUTNIK_USER_ID = "sputnik-12345";
let cashInHand = 0;

const quoteToStock = (iexQuote: QuoteResponse) => ({
  id: iexQuote.symbol,
  name: iexQuote.companyName,
  latestPrice: iexQuote.latestPrice
});

const resolvers = {
  Query: {
    viewer: () => ({ id: SPUTNIK_USER_ID }),
    stock: async (_, { id }) => {
      const quote = await iex.stockQuote(id);
      return quoteToStock(quote);
    },
    lists: () => ({})
  },
  User: {
    cash: () => cashInHand
  },
  StockLists: {
    gainers: async () =>
      (await iex.stockMarketListTopTen("gainers")).map(quoteToStock)
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
    },
    buyStock: async (_, { id, quantity }) => {
      // The string 'Unknown symbol' is returned if iex.stockQuote fails
      const quote = (await iex.stockQuote(id)) as string | QuoteResponse;
      if (typeof quote === "string") {
        throw new Error(`Could not get quote for '${id}'`);
      }

      const cost = quote.latestPrice * quantity;
      if (cost > cashInHand) {
        throw new Error(
          `Not enough funds to pay for ${quantity} of ${id} (need ${cost})`
        );
      } else if (cost <= 0) {
        throw new Error(`Invalid quantity`);
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log("Server is running on http://localhost:4000"));
