import { getRandomArrayElement, getRandomNumber, getRandomBoolean, getRandomDate } from '../utils/utils';
import { EVENTS_TYPES } from '../const';

const TIME_SKIP = 125;

const getRandomEvent = (id, date, destinationsList) => {
  const firstDate = new Date(date);
  const secondDate = new Date(firstDate);
  const destinationsIds = destinationsList.map((destination) => destination.id);
  secondDate.setMinutes(firstDate.getMinutes() + TIME_SKIP);
  const randomEvent = {
    'id': `${id}4b62099-293f-4c3d-a702-94eec4a2808c`,
    'base_price': getRandomNumber(499, 4999),
    'date_from': firstDate.toISOString(),
    'date_to': secondDate.toISOString(),
    'destination': getRandomArrayElement(destinationsIds),
    'is_favorite': getRandomBoolean(),
    'offers': [
      '04c3e4e6-9053-42ce-b747-e281314baa31',
      '14c3e4e6-9053-42ce-b747-e281314baa31',
      '24c3e4e6-9053-42ce-b747-e281314baa31',
      '34c3e4e6-9053-42ce-b747-e281314baa31'
    ],
    'type': getRandomArrayElement(EVENTS_TYPES)
  };
  return randomEvent;
};

const getRandomEvents = (count, destinationsList) => {
  const date = getRandomDate();
  const events = [];
  for (let i = 0; i < count; i++) {
    events.push(getRandomEvent(i, date, destinationsList));
    date.setMinutes(date.getMinutes() + TIME_SKIP);
  }
  return events;
};

export { getRandomEvents };
