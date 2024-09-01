import { getRandomArrayElement, getRandomNumber, getRandomBoolean, getRandomDate } from '../utils/utils';
import { getEventsTypes, getCities } from '../const';

const CITIES = Object.keys(getCities());
const EVENTS_TYPES = getEventsTypes();

const getRandomEvent = (id, date) => {
  const firstDate = new Date(date);
  const secondDate = new Date(firstDate);
  secondDate.setDate(firstDate.getDate() + 10);
  secondDate.setDate(firstDate.getDate() + 10);

  const randomEvent = {
    'id': `${id }4b62099-293f-4c3d-a702-94eec4a2808c`,
    'base_price': getRandomNumber(499, 4999),
    'date_from': firstDate.toISOString(),
    'date_to': secondDate.toISOString(),
    'destination': getRandomArrayElement(CITIES),
    'is_favorite': getRandomBoolean(),
    'offers': [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
      'b4c3e4e6-9053-42ce-b747-e281314baa32',
      'b4c3e4e6-9053-42ce-b747-e281314baa33',
      'b4c3e4e6-9053-42ce-b747-e281314baa34'
    ],
    'type': getRandomArrayElement(EVENTS_TYPES)
  };
  return randomEvent;
};

const getRandomEvents = (count) => {
  const date = getRandomDate();
  const destinations = [];
  for (let i = 0; i < count; i ++) {
    destinations.push(getRandomEvent(i, date));
    date.setDate(date.getDate() + 10);
  }
  return destinations;
};

export { getRandomEvents };
