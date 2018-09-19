import * as React from "react";

import ApolloClient, { gql } from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import Page from "./components/Page";

const client = new ApolloClient({
  uri: "http://192.168.1.4:4000"
});

class App extends React.Component {
  public render() {
    return (
      <ApolloProvider client={client}>
        <Page>
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
              <Card>
                <CardContent>
                  Did you know you have{" "}
                  {(data &&
                    data.viewer &&
                    typeof data.viewer.cash === "number" &&
                    data.viewer.cash.toString()) ||
                    "some"}{" "}
                  dollarydoos?
                </CardContent>
              </Card>
            )}
          </Query>
        </Page>
      </ApolloProvider>
    );
  }
}

export default App;
