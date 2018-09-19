import * as React from "react";

import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";
import injectSheet, { WithSheet } from "react-jss";
import { compose, withHandlers, withState } from "recompose";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";

const getFundsQuery = gql`
  query getFunds {
    viewer {
      id
      cash
    }
  }
`;

const modifyFundsMutation = gql`
  mutation modifyFunds($changeAmount: Float!) {
    modifyFunds(changeAmount: $changeAmount) {
      user {
        id
        cash
      }
      newFundsAmount
    }
  }
`;

const styles = {
  actionBar: {
    justifyContent: "space-between"
  },
  input: {
    marginTop: "1em"
  }
};

interface Props {
  open: boolean;
}
interface InnerProps extends WithSheet<typeof styles>, Props {
  inputAmount: string;
  onChangeAmount: (e: any) => void;
}

const Page = ({ classes, inputAmount, onChangeAmount, open }: InnerProps) => (
  <Dialog open={open}>
    <DialogTitle>Modify funds</DialogTitle>
    <Mutation mutation={modifyFundsMutation}>
      {modifyFunds => (
        <React.Fragment>
          <DialogContent>
            <DialogContentText>
              Add or remove funds from your account.
            </DialogContentText>
            <Query query={getFundsQuery}>
              {({ loading, error, data }) => (
                <DialogContentText>
                  You currently have ${data && data.viewer && data.viewer.cash}{" "}
                  in funds
                </DialogContentText>
              )}
            </Query>
            <FormControl className={classes.input} fullWidth>
              <InputLabel htmlFor="amount-field">Amount</InputLabel>
              <Input
                id="amount-field"
                autoFocus
                type="number"
                value={inputAmount}
                onChange={onChangeAmount}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>
          </DialogContent>
          <DialogActions className={classes.actionBar}>
            <Button
              onClick={() =>
                modifyFunds({
                  variables: {
                    changeAmount: Number.parseFloat(inputAmount) * -1
                  }
                })
              }
            >
              Withdraw
            </Button>
            <Button
              color="primary"
              onClick={() =>
                modifyFunds({
                  variables: { changeAmount: Number.parseFloat(inputAmount) }
                })
              }
            >
              Deposit
            </Button>
          </DialogActions>
        </React.Fragment>
      )}
    </Mutation>
  </Dialog>
);

export default compose<InnerProps, Props>(
  withState("inputAmount", "editAmount", 0),
  withHandlers({
    onChangeAmount: ({ editAmount }) => (
      e: React.SyntheticEvent<HTMLInputElement>
    ) => editAmount(e.currentTarget.value)
  }),
  injectSheet(styles)
)(Page);
