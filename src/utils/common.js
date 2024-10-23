const ESCAPE_KEY_CODE = 27;

const isEscapeKey = (evt) => evt.keyCode === ESCAPE_KEY_CODE;


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


export {
  convertKeysToCamelCase,
  isEscapeKey
};
