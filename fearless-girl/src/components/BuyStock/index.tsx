import * as React from "react";
import { graphql, Query } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withHandlers, withState } from "recompose";

import { isNetworkRequestInFlight } from "apollo-client/core/networkStatus";
import buyStockMutation from "../../queries/buyStockMutation";

import { CircularProgress, TextField, Typography } from "@material-ui/core";
import gql from "graphql-tag";
import StockCard from "../StockCard";

const styles: Styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    margin: "1em",
    width: "250px"
  },
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between"
  }
};

const stockQuery = gql`
  query stockQuery($id: ID!) {
    stock(id: $id) {
      id
      name
      latestPrice
    }
  }
`;

interface InnerProps extends WithSheet<typeof styles> {
  stockCode: string;
  editStockCode: (e: string) => void;
  executeBuy: () => void;
  data: any;
}

const BuyStockArea = ({
  stockCode,
  editStockCode,
  classes,
  executeBuy,
  data
}: InnerProps) => (
  <React.Fragment>
    <Typography variant="title">Stock Lookup</Typography>
    <TextField
      value={stockCode}
      onChange={e => editStockCode(e.target.value)}
      title="Code"
    />

    <Query query={stockQuery} variables={{ id: stockCode }}>
      {({ networkStatus, error, data: stockData }) => {
        if (stockCode === "") {
          return <div />;
        } else if (isNetworkRequestInFlight(networkStatus)) {
          return (
            <React.Fragment>
              <CircularProgress /> Searching...
            </React.Fragment>
          );
        } else if (error) {
          return <div>Could not find stock code</div>;
        } else if (stockData && stockData.stock) {
          return <StockCard stock={stockData.stock} />;
        }
        return <div>Unknown error occured</div>;
      }}
    </Query>
  </React.Fragment>
);

export default compose<InnerProps, {}>(
  withState("stockCode", "editStockCode", ""),
  graphql(buyStockMutation),
  withHandlers({
    executeBuy: ({ stock, qty, mutate }) => () => {
      mutate({ variables: { id: stock.id, quantity: qty } });
    }
  }),
  injectSheet(styles)
)(BuyStockArea);
