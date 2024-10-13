import { getRandomEvents } from '../mock/events';
import { getRandomOffers } from '../mock/offers';
import { getRandomDestinations } from '../mock/destinations';
import { convertKeysToCamelCase } from '../utils/common';

const EVENTS_COUNT = 5;

export default class EventsConnector {
  #destinationsList = convertKeysToCamelCase(getRandomDestinations());
  #offersMap = this.#createOffersMap(convertKeysToCamelCase(getRandomOffers()));
  #eventsList = convertKeysToCamelCase(getRandomEvents(EVENTS_COUNT, this.#destinationsList, this.#offersMap));

  #createOffersMap(data) {
    const offersMap = new Map();
    data.forEach((item) => {
      const { type, offers } = item;
      const offersById = new Map();

      offers.forEach((offer) => {
        const { id, title, price } = offer;
        offersById.set(id, { title, price });
      });

      offersMap.set(type, offersById);
    });

    return offersMap;
  }

  #getOfferById(type, id) {
    const offersById = this.#offersMap.get(type);
    const offer = offersById.get(id);
    const { title, price } = offer;
    return { id, title, price };
  }

  #createUserEvents() {
    const destinationsMap = new Map(this.#destinationsList.map((destination) => [destination.id, destination]));

    const mergedEvents = this.#eventsList.map((event) => {
      const destinationData = destinationsMap.get(event.destination);

      const offersData = event.offers
        .map((offerId) => this.#getOfferById(event.type, offerId))
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
  }

  get userEvents() {
    return structuredClone(this.#createUserEvents());
  }

  get destinationsList() {
    return this.#destinationsList;
  }
}
