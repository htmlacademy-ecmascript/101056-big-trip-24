import { getRandomEvents } from '../mock/events';
import { getRandomOffers } from '../mock/offers';
import { getRandomDestinations } from '../mock/destinations';
import { convertKeysToCamelCase } from '../utils/utils';

const EVENTS_COUNT = 1;

export default class EventsConnector {
  #offersList = structuredClone(convertKeysToCamelCase(getRandomOffers()));
  #destinationsList = structuredClone(convertKeysToCamelCase(getRandomDestinations()));
  #eventsList;

  constructor() {
    this.#eventsList = structuredClone(convertKeysToCamelCase(getRandomEvents(EVENTS_COUNT, this.#destinationsList)));

    const destinationsMap = new Map(this.#destinationsList.map((destination) => [destination.id, destination]));

    const offers = this.#offersList[0].offers;

    this.mergedEvents = this.#eventsList.map((event) => {
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
  }

  getEvents() {
    return Array.from(new Map(this.mergedEvents.map((event) => [event.id, event])).values());
  }
}
