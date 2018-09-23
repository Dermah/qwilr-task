import * as React from "react";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import AccountBalanceCard from "./components/AccountBalanceCard";
import Footer from "./components/Footer";
import Page from "./components/Page";

const client = new ApolloClient({
  uri: "http://192.168.1.4:4000"
});

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <Page>
          <AccountBalanceCard />
          <Footer />
        </Page>
      </ApolloProvider>
    );
  }
}

export default App;
