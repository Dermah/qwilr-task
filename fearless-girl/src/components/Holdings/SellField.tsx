import * as React from "react";
import { compose, withState } from "recompose";

import { Button, TextField } from "@material-ui/core";

interface SellFieldProps {
  onSell: (e: string) => void;
}
interface SellFieldInnerProps extends SellFieldProps {
  value: string;
  changeValue: (e: string) => void;
}

const SellField = compose<SellFieldInnerProps, SellFieldProps>(
  withState("value", "changeValue", "")
)(({ value, changeValue, onSell }) => (
  <>
    <TextField
      value={value}
      onChange={e => changeValue(e.target.value)}
      placeholder="Quantity..."
      type="number"
    />
    <Button
      disabled={value === "" || parseInt(value, 10) <= 0}
      onClick={() => onSell(value)}
    >
      Sell
    </Button>
  </>
));

export default SellField;
