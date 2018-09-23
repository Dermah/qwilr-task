interface Stock {
  id: string;
  name: string;
  latestPrice: number;
}

interface Holding {
  id: string;
  stock: Stock;
  quantity: number;
  purchasePrice: number;
}
