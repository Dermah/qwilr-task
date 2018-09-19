import * as React from "react";

import injectSheet, { WithSheet } from "react-jss";
import { compose } from "recompose";

const styles = {
  page: {
    margin: "1em"
  }
};

interface Props {
  children: React.ReactFragment;
}
interface InnerProps extends WithSheet<typeof styles>, Props {}

const Page = ({ classes, children }: InnerProps) => (
  <div className={classes.page}>{children}</div>
);

export default compose(injectSheet(styles))(Page);
