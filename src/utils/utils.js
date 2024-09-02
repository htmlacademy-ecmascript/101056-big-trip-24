const ESCAPE_KEY_CODE = 27;

const isEscapeKey = (evt) => evt.keyCode === ESCAPE_KEY_CODE;

const getRandomNumber = (from, to) => {
  const lower = Math.ceil(Math.min(from, to));
  const upper = Math.floor(Math.max(from, to));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomString = (desiredStringLength = 1) => {
  const primer = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < desiredStringLength; i++) {
    randomString += primer.charAt(getRandomNumber(0, primer.length - 1));
  }
  return randomString;
};

const getRandomBoolean = () => Math.random() >= 0.5;

const getRandomArrayElement = (items) => items[getRandomNumber(0, items.length - 1)];

const getRandomDate = () => {
  const today = new Date();
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(today.getFullYear() + 1);

  const randomTime = Math.random() * (oneYearFromNow - today) + today.getTime();

  return new Date(randomTime);
};

export {
  getRandomNumber,
  getRandomString,
  getRandomBoolean,
  getRandomDate,
  getRandomArrayElement,
  isEscapeKey
};
