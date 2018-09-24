import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withState } from "recompose";

import gql from "graphql-tag";
import { graphql, MutationFn, Query } from "react-apollo";

import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Zoom
} from "@material-ui/core";
import buyStockMutation from "../../queries/buyStockMutation";
import SellField from "./SellField";

const getFundsQuery = gql`
  query getHoldings {
    viewer {
      id
      holdings {
        id
        stock {
          id
          latestPrice
        }
        quantity
        purchasePrice
      }
    }
  }
`;

const styles: Styles = {
  spinner: {
    position: "absolute",
    right: "1.5em",
    top: "1.5em"
  }
};

interface InnerProps extends WithSheet<typeof styles> {
  mutate: MutationFn;
  mutationInFlight: boolean;
  mutating: (e: boolean) => void;
}

const AccountBalanceCard = ({
  classes,
  mutate,
  mutationInFlight,
  mutating
}: InnerProps) => (
  <Query query={getFundsQuery}>
    {({ loading, error, data }) => (
      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <Paper className={classes.root}>
          {mutationInFlight ? (
            <CircularProgress className={classes.spinner} size={25} />
          ) : null}
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Holding</TableCell>
                <TableCell numeric>Quantity</TableCell>
                <TableCell numeric>Purchase Price</TableCell>
                <TableCell numeric>Initial Value</TableCell>
                <TableCell numeric>Current Value</TableCell>
                <TableCell>Sell</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!loading &&
                !error &&
                data.viewer.holdings.map((holding: Holding) => {
                  return (
                    <TableRow key={holding.id}>
                      <TableCell>{holding.id}</TableCell>
                      <TableCell numeric>{holding.quantity}</TableCell>
                      <TableCell numeric>{holding.purchasePrice}</TableCell>
                      <TableCell numeric>
                        {(holding.quantity * holding.purchasePrice).toFixed(2)}
                      </TableCell>
                      <TableCell numeric>
                        {(holding.quantity * holding.stock.latestPrice).toFixed(
                          2
                        )}
                      </TableCell>
                      <TableCell>
                        <SellField
                          disabled={mutationInFlight}
                          onSell={async value => {
                            mutating(true);
                            try {
                              await mutate({
                                variables: {
                                  id: holding.id,
                                  quantity: -1 * parseInt(value, 10)
                                }
                              });
                            } catch (e) {
                              console.log(e);
                            }
                            mutating(false);
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
      </Zoom>
    )}
  </Query>
);

export default compose<InnerProps, {}>(
  withState("mutationInFlight", "mutating", false),
  graphql(buyStockMutation),
  injectSheet(styles)
)(AccountBalanceCard);
