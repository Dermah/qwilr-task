import * as React from "react";

import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";

const client = new ApolloClient({
  uri: "http://192.168.1.4:4000"
});

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <div>
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
