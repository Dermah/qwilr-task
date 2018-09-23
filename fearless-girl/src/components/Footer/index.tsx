import * as React from "react";
import injectSheet, { Styles, WithSheet } from "react-jss";
import { compose } from "recompose";

import InfoIcon from "@material-ui/icons/Info";

const styles: Styles = {
  footer: {
    alignItems: "center",
    color: "#cccccc",
    display: "flex",
    justifyContent: "center",
    marginBottom: "1em",
    marginTop: "1em",
    width: "100%",

    "@global a": {
      color: "#cccccc"
    }
  },
  icon: {
    margin: "0.5em"
  }
};

interface InnerProps extends WithSheet<typeof styles> {}

const Footer = ({ classes }: InnerProps) => (
  <div className={classes.footer}>
    <InfoIcon className={classes.icon} />{" "}
    <span>
      Data provided for free by{" "}
      <a href="https://iextrading.com/developer" target="_blank">
        IEX
      </a>
      . View{" "}
      <a href="https://iextrading.com/api-exhibit-a/" target="_blank">
        IEX’s Terms of Use
      </a>
    </span>
  </div>
);

export default compose<InnerProps, {}>(injectSheet(styles))(Footer);
