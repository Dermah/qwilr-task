import * as React from "react";

import gql from "graphql-tag";
import { Query } from "react-apollo";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";

import EditFundsModal from "../EditFundsModal";

const getFundsQuery = gql`
  query getFunds {
    viewer {
      id
      cash
    }
  }
`;

const AccountBalanceCard = () => (
  <Query query={getFundsQuery}>
    {({ loading, error, data }) => (
      <Card>
        <CardHeader title="Account Balance" />
        <CardContent>
          $
          {(data &&
            data.viewer &&
            typeof data.viewer.cash === "number" &&
            data.viewer.cash.toString()) ||
            "-"}
        </CardContent>
        <EditFundsModal open={true} />
      </Card>
    )}
  </Query>
);

export default AccountBalanceCard;
