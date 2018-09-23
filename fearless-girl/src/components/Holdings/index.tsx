import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import gql from "graphql-tag";
import { Query } from "react-apollo";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";

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

interface InnerProps extends WithSheet<typeof styles> {}

const AccountBalanceCard = ({ classes }: InnerProps) => (
  <Query query={getFundsQuery}>
    {({ loading, error, data }) => (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Holding</TableCell>
              <TableCell numeric>Quantity</TableCell>
              <TableCell numeric>Purchase Price</TableCell>
              <TableCell numeric>Initial Value</TableCell>
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
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    )}
  </Query>
);

export default compose<InnerProps, {}>(injectSheet(styles))(AccountBalanceCard);
