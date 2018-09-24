import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import gql from "graphql-tag";
import { graphql, MutationFn, Query } from "react-apollo";

import {
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

const styles: Styles = {};

interface InnerProps extends WithSheet<typeof styles> {
  mutate: MutationFn;
}

const AccountBalanceCard = ({ classes, mutate }: InnerProps) => (
  <Query query={getFundsQuery}>
    {({ loading, error, data }) => (
      <Zoom in={true} style={{ transitionDelay: "200ms" }}>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Holding</TableCell>
                <TableCell numeric>Quantity</TableCell>
                <TableCell numeric>Purchase Price</TableCell>
                <TableCell numeric>Total Initial Value</TableCell>
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
                        {holding.quantity * holding.purchasePrice}
                      </TableCell>
                      <TableCell>
                        <SellField
                          onSell={value =>
                            mutate({
                              variables: {
                                id: holding.id,
                                quantity: -1 * parseInt(value, 10)
                              }
                            })
                          }
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
  graphql(buyStockMutation),
  injectSheet(styles)
)(AccountBalanceCard);
