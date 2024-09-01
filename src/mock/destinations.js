import { getRandomArrayElement, getRandomString, getRandomNumber} from '../utils/utils';
import { getSentences } from '../const';

const SENTENCES = getSentences();

const getRandomDescription = () => {
  let randomDescription = '';
  for (let i = 0; i < getRandomNumber(1,5); i ++) {
    randomDescription += getRandomArrayElement(SENTENCES);
  }
  return randomDescription;
};

const getRandomDestination = (id) => {
  const destination = {
    'id': `${id }fe416cq-10xa-ye10-8077-2fs9a01edcab`,
    'description': getRandomDescription(),
    'name': getRandomString(10),
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${ getRandomNumber(1,100)}`,
        'description': getRandomDescription()
      }
    ]
  };
  return destination;
};

const getRandomDestinations = (count) => {
  const destinations = [];
  for (let i = 0; i < count; i ++) {
    destinations.push(getRandomDestination(i));
  }
  return destinations;
};

export { getRandomDestinations };
