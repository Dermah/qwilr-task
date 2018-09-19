import * as React from "react";

import injectSheet, { WithSheet } from "react-jss";
import { compose } from "recompose";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = {
  actionBar: {
    justifyContent: "space-between"
  }
};

interface Props {
  open: boolean;
}
interface InnerProps extends WithSheet<typeof styles>, Props {}

const Page = ({ classes, open }: InnerProps) => (
  <Dialog open={true}>
    <DialogTitle>Modify funds</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Add or remove funds from your account.
      </DialogContentText>
      <DialogContentText>You currently have funds</DialogContentText>
    </DialogContent>
    <DialogActions className={classes.actionBar}>
      <Button>Remove</Button>
      <Button color="primary">Add</Button>
    </DialogActions>
  </Dialog>
);

export default compose<InnerProps, Props>(injectSheet(styles))(Page);
