import * as React from "react";
import { compose, withState } from "recompose";

import { Button, TextField } from "@material-ui/core";

interface SellFieldProps {
  onSell: (e: string) => void;
  disabled: boolean;
}
interface SellFieldInnerProps extends SellFieldProps {
  value: string;
  changeValue: (e: string) => void;
}

const SellField = compose<SellFieldInnerProps, SellFieldProps>(
  withState("value", "changeValue", "")
)(({ value, changeValue, onSell, disabled }) => (
  <>
    <TextField
      disabled={disabled}
      value={value}
      onChange={e => changeValue(e.target.value)}
      placeholder="Quantity..."
      type="number"
    />
    <Button
      disabled={disabled || value === "" || parseInt(value, 10) <= 0}
      onClick={() => onSell(value)}
    >
      Sell
    </Button>
  </>
));

export default SellField;
