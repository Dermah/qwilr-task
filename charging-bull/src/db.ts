let cashInHand = 0;

const holdings: {
  [key: string]: {
    quantity: number;
    purchasePrice: number;
  };
} = {};

const getCashInHand = () => cashInHand;

const modifyFunds = (change: number) => {
  if (cashInHand + change < 0) {
    throw new Error("Could not change to negative dollars");
  } else {
    cashInHand += change;
    return cashInHand;
  }
};

const getHoldings = () =>
  Object.keys(holdings).map(id => ({ id, ...holdings[id] }));

const getHolding = (id: string) => {
  if (holdings[id]) {
    return {
      id: id,
      ...holdings[id]
    };
  }
};

const changeHolding = (
  id: string,
  changeQuantity: number,
  purchasePrice?: number
) => {
  if (!holdings[id] && changeQuantity > 0) {
    return (holdings[id] = {
      quantity: changeQuantity,
      purchasePrice: purchasePrice
    });
  } else if (holdings[id] && holdings[id].quantity + changeQuantity > 0) {
    return (holdings[id] = {
      quantity: holdings[id].quantity + changeQuantity,
      purchasePrice:
        changeQuantity > 0
          ? // Weighted average of previous price and current price
            (holdings[id].purchasePrice * holdings[id].quantity +
              changeQuantity * purchasePrice) /
            (holdings[id].quantity + changeQuantity)
          : // Selling shares doesn't change the purchase price
            holdings[id].purchasePrice
    });
  } else if (holdings[id] && holdings[id].quantity + changeQuantity === 0) {
    return delete holdings[id];
  }
  throw new Error("Bad request");
};

export { getCashInHand, modifyFunds, getHoldings, getHolding, changeHolding };
