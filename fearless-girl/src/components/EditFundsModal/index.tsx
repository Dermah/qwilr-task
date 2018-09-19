import * as React from "react";

import injectSheet, { WithSheet } from "react-jss";
import { compose } from "recompose";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = {};

interface Props {
  open: boolean;
}
interface InnerProps extends WithSheet<typeof styles>, Props {}

const Page = ({ classes, open }: InnerProps) => (
  <Dialog open={true}>
    <DialogTitle>Modify funds</DialogTitle>
  </Dialog>
);

export default compose<InnerProps, Props>(injectSheet(styles))(Page);
