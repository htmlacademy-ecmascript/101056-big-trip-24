import { getRandomEvents } from '../mock/events';
import { getRandomOffers } from '../mock/offers';
import { getRandomDestinations } from '../mock/destinations';
import { convertKeysToCamelCase } from '../utils/common';

const EVENTS_COUNT = 5;

export default class EventsConnector {
  #destinationsList = convertKeysToCamelCase(getRandomDestinations());
  #offersMap = this.#initializeOffersMap(convertKeysToCamelCase(getRandomOffers()));
  #clonedOffersMap = structuredClone(this.#offersMap);
  #eventsList = convertKeysToCamelCase(getRandomEvents(EVENTS_COUNT, this.#destinationsList, this.#clonedOffersMap));

  #initializeOffersMap (data) {
    return data.reduce((offersMap, { type, offers }) => {
      const offersById = new Map(
        offers.map(({ id, title, price }) => [id, { title, price, isActive: false }])
      );
      offersMap.set(type, offersById);
      return offersMap;
    }, new Map());
  }

  #updateOffersActivity () {
    this.#eventsList.forEach(({ offers: eventOffers, type }) => {
      const offersById = this.#clonedOffersMap.get(type);
      eventOffers.forEach((offerId) => {
        const offer = offersById.get(offerId);
        if (offer) {
          offer.isActive = true;
        }
      });
    });
  }

  constructor () {
    this.#updateOffersActivity();
  }

  #getOfferById (type, id) {
    const offer = this.#clonedOffersMap.get(type)?.get(id);
    return offer ? { id, ...offer } : null;
  }

  #createUserEvents () {
    const destinationsMap = new Map(this.#destinationsList.map(({ id, ...rest }) => [id, rest]));

    return Array.from(this.#eventsList.map((event) => {
      const destinationData = destinationsMap.get(event.destination);
      const offersMap = new Map(
        event.offers.map((offerId) => this.#getOfferById(event.type, offerId)).filter(Boolean).map((offer) => [offer.id, offer])
      );

      return {
        ...event,
        destination: { id: destinationData.id, ...destinationData },
        offers: offersMap
      };
    }).reduce((acc, event) => {
      acc.set(event.id, event);
      return acc;
    }, new Map()).values());
  }

  get userEvents () {
    return this.#createUserEvents();
  }

  get destinationsList () {
    return this.#destinationsList;
  }

  get offersMap () {
    return this.#offersMap;
  }
}
