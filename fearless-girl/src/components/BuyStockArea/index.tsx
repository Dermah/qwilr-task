import * as React from "react";
import { Query } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withState } from "recompose";

import { isNetworkRequestInFlight } from "apollo-client/core/networkStatus";

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
  },
  section: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-around",
    minHeight: "200px",
    width: "100%"
  },
  title: {
    marginTop: "2em"
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
}

const BuyStockArea = ({ stockCode, editStockCode, classes }: InnerProps) => (
  <>
    <Typography className={classes.title} variant="display1">
      Stock Lookup
    </Typography>
    <section className={classes.section}>
      <TextField
        value={stockCode}
        onChange={e => editStockCode(e.target.value)}
        label="Stock code"
      />

      <Query query={stockQuery} variables={{ id: stockCode }}>
        {({ networkStatus, error, data: stockData }) => {
          if (stockCode === "") {
            return <div />;
          } else if (isNetworkRequestInFlight(networkStatus)) {
            return (
              <div>
                <CircularProgress /> Searching...
              </div>
            );
          } else if (error) {
            return <div>Could not find stock code</div>;
          } else if (stockData && stockData.stock) {
            return <StockCard stock={stockData.stock} />;
          }
          return <div>Unknown error occured</div>;
        }}
      </Query>
    </section>
  </>
);

export default compose<InnerProps, {}>(
  withState("stockCode", "editStockCode", ""),
  injectSheet(styles)
)(BuyStockArea);
