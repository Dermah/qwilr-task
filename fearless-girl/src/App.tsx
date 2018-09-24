import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import AccountBalanceCard from "./components/AccountBalanceCard";
import BuyStock from "./components/BuyStockArea";
import Footer from "./components/Footer";
import Holdings from "./components/Holdings";
import Page from "./components/Page";
import StockLists from "./components/StockLists";

const client = new ApolloClient({
  uri: "http://192.168.1.4:4000"
});

const styles: Styles = {
  top: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  }
};

interface InnerProps extends WithSheet<typeof styles> {}

class App extends React.Component<InnerProps> {
  public render() {
    return (
      <ApolloProvider client={client}>
        <Page>
          <div className={this.props.classes.top}>
            <AccountBalanceCard />
            <Holdings />
          </div>
          <BuyStock />
          <StockLists />
          <Footer />
        </Page>
      </ApolloProvider>
    );
  }
}

export default compose<InnerProps, {}>(injectSheet(styles))(App);
