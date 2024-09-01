// Interface
import { ICalculateTotal } from '@app/interface';

export const calculateTotal = ({
  transaction_type = 'buy',
  quantity = 0,
  price = 0,
  tax = 0,
}: ICalculateTotal) => {
  let result = 0;
  if (transaction_type === 'buy') {
    const calculate = Number(quantity) * Number(price) + Number(tax);
    result = Number(calculate);
    return result;
  }

  if (transaction_type === 'sell') {
    const calculate = Number(quantity) * Number(price) - Number(tax);
    result = Number(calculate);
    return result;
  }
};
