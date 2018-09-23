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
  return (holdings[id] = {
    quantity: changeQuantity,
    purchasePrice: purchasePrice
  });
};

export { getCashInHand, modifyFunds, getHoldings, getHolding, changeHolding };
