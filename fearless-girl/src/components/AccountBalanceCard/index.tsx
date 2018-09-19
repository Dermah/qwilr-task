import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withState } from "recompose";

import gql from "graphql-tag";
import { Query } from "react-apollo";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
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

const styles: Styles = {
  actionArea: {
    flexDirection: "row-reverse"
  }
};

interface InnerProps extends WithSheet<typeof styles> {
  modalOpen: boolean;
  changeModalOpen: (open: boolean) => void;
}

const AccountBalanceCard = ({
  modalOpen,
  changeModalOpen,
  classes
}: InnerProps) => (
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
        <CardActions className={classes.actionArea}>
          <Button color="primary" onClick={() => changeModalOpen(true)}>
            Change Balance
          </Button>
        </CardActions>
        <EditFundsModal open={modalOpen} />
      </Card>
    )}
  </Query>
);

export default compose<InnerProps, {}>(
  withState("modalOpen", "changeModalOpen", false),
  injectSheet(styles)
)(AccountBalanceCard);
