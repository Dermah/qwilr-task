import * as React from "react";
import { Query } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import gql from "graphql-tag";

import { Typography } from "@material-ui/core";
import StockCard from "../StockCard";

const getStockLists = gql`
  query getStockLists {
    lists {
      gainers {
        id
        name
        latestPrice
      }
    }
  }
`;

const styles: Styles = {
  listSection: {
    display: "flex",
    flexWrap: "wrap"
  },
  section: {
    marginTop: "1em"
  }
};

interface InnerProps extends WithSheet<typeof styles> {}

const StockLists = ({ classes }: InnerProps) => (
  <section className={classes.section}>
    <Query query={getStockLists}>
      {({ loading, error, data }) => {
        if (loading) {
          return <React.Fragment>Loading</React.Fragment>;
        } else {
          return (
            <React.Fragment>
              <Typography variant="display1">Today's Gainers</Typography>
              <div className={classes.listSection}>
                {(data.lists.gainers as Stock[]).map((stock, i) => (
                  <StockCard key={i} stock={stock} transitionDelay={i * 50} />
                ))}
              </div>
            </React.Fragment>
          );
        }
      }}
    </Query>
  </section>
);

export default compose<InnerProps, {}>(injectSheet(styles))(StockLists);
