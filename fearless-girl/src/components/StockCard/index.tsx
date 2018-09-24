import * as React from "react";
import { graphql } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withHandlers, withState } from "recompose";

import gql from "graphql-tag";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
  Zoom
} from "@material-ui/core";

const buyStock = gql`
  mutation buyStockMutation($id: ID!, $quantity: Int!) {
    buyStock(id: $id, quantity: $quantity) {
      user {
        id
        cash
        holdings {
          id
          stock {
            id
          }
          quantity
          purchasePrice
        }
      }
    }
  }
`;

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

interface Props {
  stock: Stock;
  transitionDelay?: number;
}

interface InnerProps extends WithSheet<typeof styles>, Props {
  qty: string;
  editQty: (e: string) => void;
  executeBuy: () => void;
}

const StockCard = ({
  qty,
  editQty,
  classes,
  stock,
  executeBuy,
  transitionDelay = 0
}: InnerProps) => (
  <Zoom in={true} style={{ transitionDelay: `${transitionDelay}ms` }}>
    <Card className={classes.card}>
      <CardContent>
        <div className={classes.header}>
          <Typography variant="headline" component="h2">
            {stock.id}
          </Typography>
          <Typography variant="subheading">${stock.latestPrice}</Typography>
        </div>
        <Typography variant="subheading" component="h3">
          {stock.name}
        </Typography>
      </CardContent>
      <CardActions>
        <TextField
          placeholder="Quantity..."
          value={qty}
          onChange={e => editQty(e.target.value)}
          type="number"
        />
        <Button
          disabled={qty === ""}
          onClick={() => executeBuy()}
          color="primary"
        >
          Buy
        </Button>
      </CardActions>
    </Card>
  </Zoom>
);

export default compose<Props, Props>(
  withState("qty", "editQty", ""),
  graphql(buyStock),
  withHandlers({
    executeBuy: ({ stock, qty, mutate }) => () => {
      mutate({ variables: { id: stock.id, quantity: qty } });
    }
  }),
  injectSheet(styles)
)(StockCard);
