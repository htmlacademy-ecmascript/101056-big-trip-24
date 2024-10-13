import { getRandomNumber } from '../utils/common';
import { nanoid } from 'nanoid';
import { EVENTS_TYPES } from '../const';

const OFFERS_COUNT = 2;

const getRandomOffer = (index) => {
  const offer = {
    'id': nanoid(),
    'title': `Upgrade ${index}`,
    'price': getRandomNumber(19, 499)
  };
  return offer;
};

const getRandomOffersOfSameType = (type) => {
  const offers = [];
  for (let i = 0; i < OFFERS_COUNT; i++) {
    offers.push(getRandomOffer(i));
  }
  return {
    'type': type.toLowerCase(),
    'offers': offers
  };
};

const getRandomOffers = () => {
  const randomOffers = EVENTS_TYPES.map((type) => getRandomOffersOfSameType(type));
  return randomOffers;
};

export { getRandomOffers };
