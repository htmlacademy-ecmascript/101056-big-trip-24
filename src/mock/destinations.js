import { getRandomArrayElement, getRandomNumber} from '../utils/common';
import { SENTENCES, CITIES } from '../const';

const getRandomDescription = () => {
  let randomDescription = '';
  for (let i = 0; i < getRandomNumber(1,5); i ++) {
    randomDescription += getRandomArrayElement(SENTENCES);
  }
  return randomDescription;
};

const getRandomDestination = (id) => {
  const destination = {
    'id': `${id }fa5cb75-a1fe-4b77-a83c-0e528e910e04`,
    'description': getRandomDescription(),
    'name': CITIES[id],
    'pictures': [
      {
        'src': `https://loremflickr.com/248/152?random=${ getRandomNumber(1,100)}`,
        'description': getRandomDescription()
      }
    ]
  };
  return destination;
};

const getRandomDestinations = () => {
  const destinations = [];
  for (let i = 0; i < CITIES.length; i ++) {
    destinations.push(getRandomDestination(i));
  }
  return destinations;
};

export { getRandomDestinations };
