import gql from "graphql-tag";

const buyStockMutation = gql`
  mutation buyStockMutation($id: ID!, $quantity: Int!) {
    buyStock(id: $id, quantity: $quantity) {
      user {
        id
        cash
        holdings {
          id
          stock {
            id
          }
          quantity
          purchasePrice
        }
      }
    }
  }
`;

export default buyStockMutation;
