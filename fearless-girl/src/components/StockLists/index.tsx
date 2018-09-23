import * as React from "react";
import { Query } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import gql from "graphql-tag";

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

const styles: Styles = {};

interface InnerProps extends WithSheet<typeof styles> {}

const StockLists = () => (
  <React.Fragment>
    <Query query={getStockLists}>
      {({ loading, error, data }) => {
        if (loading) {
          return <React.Fragment>Loading</React.Fragment>;
        } else {
          return (
            <React.Fragment>
              {JSON.stringify(data.lists.gainers)}
            </React.Fragment>
          );
        }
      }}
    </Query>
  </React.Fragment>
);

export default compose<InnerProps, {}>(injectSheet(styles))(StockLists);
