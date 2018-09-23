import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import { Card, CardContent, Typography } from "@material-ui/core";

const styles: Styles = {
  card: {
    margin: "1em",
    width: "250px"
  }
};

interface Props {
  stock: Stock;
}

interface InnerProps extends WithSheet<typeof styles>, Props {}

const StockCard = ({ classes, stock }: InnerProps) => (
  <Card className={classes.card}>
    <CardContent>
      <Typography variant="headline" component="h2">
        {stock.id}
      </Typography>
      <Typography variant="subheading" component="h3">
        {stock.name}
      </Typography>
    </CardContent>
  </Card>
);

export default compose<Props, Props>(injectSheet(styles))(StockCard);
