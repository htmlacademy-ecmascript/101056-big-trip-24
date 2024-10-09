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

const convertToCamelCase = (str) => str.replace(/(_\w)/g, (match) => match[1].toUpperCase());

const convertKeysToCamelCase = (items) => {
  if (Array.isArray(items)) {
    return items.map(convertKeysToCamelCase);
  }
  if (items !== null && typeof items === 'object') {
    return Object.entries(items).reduce((newItems, [key, value]) => {
      newItems[convertToCamelCase(key)] = convertKeysToCamelCase(value);
      return newItems;
    }, {});
  }
  return items;
};

const updateItem = (items, update) => items.map((item) => item.id === update.id ? update : item);

export {
  updateItem,
  getRandomNumber,
  getRandomString,
  getRandomBoolean,
  getRandomDate,
  getRandomArrayElement,
  convertKeysToCamelCase,
  isEscapeKey
};
