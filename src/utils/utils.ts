export const convertCentToYuanString = (amount) => {
  if (amount % 100 === 0) {
    return `${amount / 100}`;
  }
  return `${Math.floor(amount / 100)}.${amount % 100}`;
}

export const convertYuanStringToCent = (amount) => {
  const [yuanStr, decimalStr] = amount.split('.');
  const yuan = BigInt(yuanStr);
  const decimal = decimalStr ? BigInt(decimalStr) : 0n;
  return Number(yuan * 100n + decimal);
}