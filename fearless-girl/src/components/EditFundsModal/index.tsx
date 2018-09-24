import * as React from "react";

import gql from "graphql-tag";
import { Mutation, Query } from "react-apollo";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose, withHandlers, withState } from "recompose";

import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
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

const styles: Styles = {
  actionBar: {
    justifyContent: "space-between"
  },
  input: {
    marginBottom: "1em",
    marginTop: "1em"
  },
  resultBar: {
    justifyContent: "center"
  },
  spinner: {
    position: "absolute",
    right: "1.5em",
    top: "1.5em"
  }
};

interface Props {
  open: boolean;
  onClose: () => void;
}
interface InnerProps extends WithSheet<typeof styles>, Props {
  inputAmount: string;
  onChangeAmount: (e: any) => void;
}

const Page = ({
  classes,
  inputAmount,
  onChangeAmount,
  open,
  onClose
}: InnerProps) => (
  <Dialog onClose={onClose} open={open}>
    <Mutation
      mutation={modifyFundsMutation}
      onCompleted={() => setTimeout(onClose, 2000)}
    >
      {(
        modifyFunds,
        { error: mutationError, loading: mutationLoading, data: mutationData }
      ) => (
        <React.Fragment>
          {mutationLoading && (
            <CircularProgress className={classes.spinner} size={25} />
          )}
          <DialogTitle>Modify funds</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Add or remove funds from your account.
            </DialogContentText>
            <Query query={getFundsQuery}>
              {({ loading, error, data }) => (
                <DialogContentText>
                  You currently have $
                  {data &&
                    data.viewer &&
                    data.viewer.cash &&
                    data.viewer.cash.toFixed(2)}{" "}
                  in funds
                </DialogContentText>
              )}
            </Query>
            <FormControl className={classes.input} fullWidth>
              <InputLabel htmlFor="amount-field">Amount</InputLabel>
              <Input
                id="amount-field"
                autoFocus
                disabled={mutationLoading}
                type="number"
                value={inputAmount}
                onChange={onChangeAmount}
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              />
            </FormControl>

            {mutationError && (
              <DialogContentText>
                {mutationError.graphQLErrors.reduce(
                  (fullMessage, error) => fullMessage + error.message,
                  "Error: "
                )}
              </DialogContentText>
            )}
          </DialogContent>
          {!!mutationData ? (
            <DialogActions className={classes.resultBar}>
              <Button disabled>Success!</Button>
            </DialogActions>
          ) : (
            <DialogActions className={classes.actionBar}>
              <Button
                disabled={
                  inputAmount === "" || mutationLoading || !!mutationData
                }
                onClick={() => {
                  modifyFunds({
                    variables: {
                      changeAmount: Number.parseFloat(inputAmount) * -1
                    }
                  });
                }}
              >
                Withdraw
              </Button>
              <Button
                disabled={
                  inputAmount === "" || mutationLoading || !!mutationData
                }
                color="primary"
                onClick={() => {
                  modifyFunds({
                    variables: {
                      changeAmount: Number.parseFloat(inputAmount)
                    }
                  });
                }}
              >
                Deposit
              </Button>
            </DialogActions>
          )}
        </React.Fragment>
      )}
    </Mutation>
  </Dialog>
);

export default compose<InnerProps, Props>(
  withState("inputAmount", "editAmount", ""),
  withHandlers({
    onChangeAmount: ({ editAmount }) => (
      e: React.SyntheticEvent<HTMLInputElement>
    ) => editAmount(e.currentTarget.value)
  }),
  injectSheet(styles)
)(Page);
