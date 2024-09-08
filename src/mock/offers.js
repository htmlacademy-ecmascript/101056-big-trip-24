import { getRandomNumber} from '../utils/utils';

const OFFERS_COUNT = 4;

const getRandomOffer = (id) => {
  const offer = {
    'id': `${id }4c3e4e6-9053-42ce-b747-e281314baa31`,
    'title': `Upgrade ${ id}`,
    'price': getRandomNumber(19,499)
  };
  return offer;
};

const getRandomOffers = (type) => {
  const randomOffers = [
    {
      'type': type,
      'offers': []
    }
  ];

  for (let i = 0; i < OFFERS_COUNT; i ++) {
    randomOffers[0].offers.push(getRandomOffer(i));
  }
  return randomOffers;
};

export { getRandomOffers };
