export const generateRandomNumber = (): number => {
  const crypto = window.crypto;
  return crypto
    ? crypto.getRandomValues(new Uint32Array(1))[0]
    : parseInt((Math.random() * 10000000000).toString());
};

export default generateRandomNumber;
