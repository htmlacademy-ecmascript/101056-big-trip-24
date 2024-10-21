import { convertKeysToCamelCase } from '../utils/common';
import { DEFAULT_TYPE } from '../const';


export default class EventsConnector {
  #destinationsData = null;
  #offers = null;
  #offersMap = null;
  #clonedOffersMap = null;
  #eventsList = null;
  #newEventsList = null;
  #defaultEvent = null;

  init(destinations, offers, userEvents) {
    this.#destinationsData = convertKeysToCamelCase(destinations);
    this.#offers = convertKeysToCamelCase(offers);

    this.#offersMap = this.#initializeOffersMap(this.#offers);
    this.#clonedOffersMap = structuredClone(this.#offersMap);

    this.#eventsList = convertKeysToCamelCase(userEvents);

    this.#newEventsList = this.#createUserEvents();
    this.#updateOffersActivity();

    this.#defaultEvent = this.#generateDefaultEvent(this.#offersMap, DEFAULT_TYPE);
  }

  #initializeOffersMap(data) {
    return data.reduce((offersMap, { type, offers }) => {
      const offersById = new Map(
        offers.map(({ id, title, price }) => [id, { title, price, isActive: false }])
      );
      offersMap.set(type, offersById);
      return offersMap;
    }, new Map());
  }

  #updateOffersActivity() {
    this.#newEventsList.forEach(({ offers: eventOffers, type }) => {
      const offersById = this.#clonedOffersMap.get(type);
      if (offersById) {
        eventOffers.forEach((eventOffer) => {
          const id = eventOffer.id;
          const offer = offersById.get(id);
          if (offer) {
            offer.isActive = true;
          }
        });
      }
    });
  }

  #getOfferById(type, id) {
    const offer = this.#clonedOffersMap.get(type)?.get(id);
    return offer ? { id, ...offer } : null;
  }

  #createUserEvents() {
    const destinationsMap = new Map(this.#destinationsData.map(({ id, ...rest }) => [id, rest]));

    const eventsWithOffers = this.#eventsList.reduce((acc, event) => {
      const destinationData = destinationsMap.get(event.destination);
      const existingOfferIds = new Set(event.offers);

      const offersMap = new Map();
      event.offers.forEach((offerId) => {
        const offer = this.#getOfferById(event.type, offerId);
        if (offer) {
          offer.isActive = true;
          offersMap.set(offer.id, offer);
        }
      });

      const clonedOffers = this.#clonedOffersMap.get(event.type);
      if (clonedOffers) {
        clonedOffers.forEach(({ title, price }, id) => {
          offersMap.set(id, {
            title,
            price,
            isActive: existingOfferIds.has(id),
          });
        });
      }

      if (destinationData) {
        acc.set(event.id, {
          ...event,
          destination: { id: event.destination, ...destinationData },
          offers: offersMap,
        });
      }
      return acc;
    }, new Map());

    return Array.from(eventsWithOffers.values());
  }

  get userEvents() {
    return this.#newEventsList;
  }

  get destinationsData() {
    return this.#destinationsData;
  }

  get offersMap() {
    return this.#offersMap;
  }

  get defaultEvent () {
    return this.#defaultEvent;
  }

  #generateDefaultEvent = (offersMap, defaultType) => {
    const defaultOffers = offersMap.get(defaultType) || null;
    const defaultEvent = {
      id: '',
      basePrice: 0,
      dateFrom: '',
      dateTo: '',
      destination: {},
      isFavorite: false,
      offers: defaultOffers,
      type: defaultType,
    };
    return defaultEvent;
  };
}
