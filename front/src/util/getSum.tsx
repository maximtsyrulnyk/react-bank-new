export const getSum = (amount: number | string): string => {
  if (isNaN(Number(amount))) {
    return "Invalid amount";
  }

  const formattedAmount: string = new Intl.NumberFormat("en-UA", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(amount));

  return formattedAmount;
};
