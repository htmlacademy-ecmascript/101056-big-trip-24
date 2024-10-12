import { getRandomEvents } from '../mock/events';
import { getRandomOffers } from '../mock/offers';
import { getRandomDestinations } from '../mock/destinations';
import { convertKeysToCamelCase } from '../utils/common';

const EVENTS_COUNT = 6;

const createUserEvents = (offersList, destinationsList, eventsList) => {
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
  #offersList = convertKeysToCamelCase(getRandomOffers());
  #destinationsList = convertKeysToCamelCase(getRandomDestinations());
  #eventsList = convertKeysToCamelCase(getRandomEvents(EVENTS_COUNT, this.#destinationsList));

  get userEvents () {
    return structuredClone(createUserEvents(this.#offersList, this.#destinationsList, this.#eventsList));
  }

  get destinationsList () {
    return this.#destinationsList;
  }
}
