import * as React from "react";
import { graphql } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withHandlers, withState } from "recompose";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Zoom
} from "@material-ui/core";
import buyStockMutation from "../../queries/buyStockMutation";

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
  mutationInFlight: boolean;
}

const StockCard = ({
  qty,
  editQty,
  classes,
  stock,
  executeBuy,
  transitionDelay = 0,
  mutationInFlight
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
        {mutationInFlight ? (
          <CircularProgress />
        ) : (
          <Button
            disabled={qty === ""}
            onClick={() => executeBuy()}
            color="primary"
          >
            Buy
          </Button>
        )}
      </CardActions>
    </Card>
  </Zoom>
);

export default compose<Props, Props>(
  withState("qty", "editQty", ""),
  withState("mutationInFlight", "mutating", false),
  graphql(buyStockMutation),
  withHandlers({
    executeBuy: ({ stock, qty, editQty, mutate, mutating }) => async () => {
      mutating(true);
      try {
        await mutate({ variables: { id: stock.id, quantity: qty } });
      } catch (e) {
        mutating(false);
      }
      editQty("");
      mutating(false);
    }
  }),
  injectSheet(styles)
)(StockCard);
