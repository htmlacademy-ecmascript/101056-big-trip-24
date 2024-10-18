import { getRandomArrayElement, getRandomNumber, getRandomBoolean, getRandomDate } from '../utils/common';
import { EVENTS_TYPES } from '../const';
import {nanoid} from 'nanoid';

const TIME_SKIP = 125;

const getOfferIdsByType = (offersMap, type) => {
  const offerIds = [];

  if (offersMap.has(type)) {
    const offersById = offersMap.get(type);

    offersById.forEach((_, id) => {
      offerIds.push(id);
    });
  }
  return offerIds;
};

const getRandomEvent = (date, destinationsList, offersMap) => {
  const firstDate = new Date(date);
  const secondDate = new Date(firstDate);
  const destinationsIds = destinationsList.map((destination) => destination.id);
  secondDate.setMinutes(firstDate.getMinutes() + TIME_SKIP);
  const randomType = getRandomArrayElement(EVENTS_TYPES).toLowerCase();
  const randomEvent = {
    'id': nanoid(),
    'base_price': getRandomNumber(499, 4999),
    'date_from': firstDate.toISOString(),
    'date_to': secondDate.toISOString(),
    'destination': getRandomArrayElement(destinationsIds),
    'is_favorite': getRandomBoolean(),
    'offers': getOfferIdsByType(offersMap, randomType),
    'type': randomType,
  };
  return randomEvent;
};

const getRandomEvents = (count, destinationsList, offersMap) => {
  const date = getRandomDate();
  const events = [];
  for (let i = 0; i < count; i++) {
    events.push(getRandomEvent(date, destinationsList, offersMap));
    date.setMinutes(date.getMinutes() + TIME_SKIP);
  }
  return events;
};

export { getRandomEvents };
