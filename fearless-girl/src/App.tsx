import * as React from "react";

import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";

import "./App.css";

import logo from "./logo.svg";

const client = new ApolloClient({
  uri: "http://192.168.1.4:4000"
});

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <Query
            query={gql`
              {
                viewer {
                  cash
                }
              }
            `}
          >
            {({ loading, error, data }) => (
              <p className="App-intro">
                Did you know you have{" "}
                {(data &&
                  data.viewer &&
                  typeof data.viewer.cash === "number" &&
                  data.viewer.cash.toString()) ||
                  "some"}{" "}
                dollarydoos?
              </p>
            )}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
