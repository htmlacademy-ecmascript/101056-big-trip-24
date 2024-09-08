import { getRandomEvents } from '../mock/events';
import { getRandomOffers } from '../mock/offers';
import { getRandomDestinations } from '../mock/destinations';
import { convertKeysToCamelCase } from '../utils/utils';

const EVENTS_COUNT = 3;

const createUserEvents = () => {
  const offersList = convertKeysToCamelCase(getRandomOffers());
  const destinationsList = convertKeysToCamelCase(getRandomDestinations());
  const eventsList = convertKeysToCamelCase(getRandomEvents(EVENTS_COUNT, destinationsList));

  const destinationsMap = new Map(destinationsList.map((destination) => [destination.id, destination]));
  const offers = offersList[0].offers;

  const mergedEvents = eventsList.map((event) => {
    const destinationData = destinationsMap.get(event.destination);

    const offersData = event.offers
      .map((offerId) => offers.find((offer) => offer.id === offerId))
      .filter(Boolean);

    return {
      ...event,
      destination: {
        id: destinationData.id,
        name: destinationData.name,
        description: destinationData.description,
        pictures: destinationData.pictures,
      },
      offers: offersData
    };
  });

  return Array.from(new Map(mergedEvents.map((event) => [event.id, event])).values());
};

export default class EventsConnector {
  get userEvents () {
    return structuredClone(createUserEvents());
  }
}
