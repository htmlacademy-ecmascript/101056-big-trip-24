import Observable from '../framework/observable.js';
import EventsConnector from './events-connector.js';
import { UpdateType } from '../const.js';
import { sortEventsDate } from '../utils/event.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #eventsConnector = null;
  #eventsList = [];
  #destinationsData = [];
  #offersMap = new Map();
  #defaultEvent = null;
  #isLoadingDataError = false;

  constructor({ eventsApiService }) {
    super();
    this.#eventsApiService = eventsApiService;
    this.#offersMap = new Map();
    this.#destinationsData = [];
    this.#eventsList = [];
  }

  async init() {
    try {
      const destinations = await this.#eventsApiService.destinations;
      const offers = await this.#eventsApiService.offers;
      const userEvents = await this.#eventsApiService.userEvents;
      this.#eventsConnector = new EventsConnector ();
      this.#eventsConnector.init(destinations, offers, userEvents);
      this.#destinationsData = this.#eventsConnector.destinationsData;
      this.#eventsList = this.#eventsConnector.userEvents;
      this.#offersMap = this.#eventsConnector.offersMap;
      this.#defaultEvent = this.#eventsConnector.defaultEvent;
    } catch (error) {
      this.#offersMap = new Map();
      this.#destinationsData = [];
      this.#eventsList = [];
      this.#isLoadingDataError = true;
    }
    this._notify(UpdateType.INIT);
  }

  findDestinationData = (destinationId) => this.#destinationsData.find((destination) => destination.id === destinationId);

  getOffersMapByType = (type) => this.#offersMap.get(type) || null;

  get isLoadingDataError () {
    return this.#isLoadingDataError;
  }

  get userEvents () {
    return this.#eventsList;
  }

  get destinationsData () {
    return this.#destinationsData;
  }

  get defaultEvent () {
    return this.#defaultEvent;
  }

  async updateEvent(updateType, update) {
    const index = this.#eventsList.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = this.#adaptToClient(response);

      this.#eventsList = [
        ...this.#eventsList.slice(0, index),
        updatedEvent,
        ...this.#eventsList.slice(index + 1),
      ];
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error(`Can't update event ${err}`);
    }
  }

  async addEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.addEvent(update);
      const newEvent = this.#adaptToClient(response);
      this.#eventsList = [newEvent, ...this.#eventsList];
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error(`Can't add event ${err}`);
    }
  }

  async deleteEvent(updateType, update) {
    const index = this.#eventsList.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#eventsApiService.deleteEvent(update);
      this.#eventsList = [
        ...this.#eventsList.slice(0, index),
        ...this.#eventsList.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }

  #adaptToClient = (event) => {
    const destinationsMap = new Map(this.destinationsData.map(({ id, ...rest }) => [id, rest]));
    const destinationData = destinationsMap.get(event.destination);

    let adaptedEvent = null;
    const offersMap = structuredClone(this.getOffersMapByType(event.type));

    adaptedEvent = {
      ...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'],
      dateTo: event['date_to'],
      isFavorite: event['is_favorite'],
      offersArray: event.offers,
      newOffers: offersMap,
    };

    delete adaptedEvent['offers'];
    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    adaptedEvent.offersArray.forEach((offerId) => {
      const offer = offersMap.get(offerId);
      offer.isActive = true;
    });

    adaptedEvent = {
      ...adaptedEvent,
      destination: { id: event.destination, ...destinationData },
      offers: adaptedEvent.newOffers,
    };

    delete adaptedEvent['newOffers'];
    delete adaptedEvent['offersArray'];

    return adaptedEvent;
  };

  get generalTravelInformation () {
    const sortableUserEvents = structuredClone(this.#eventsList).sort(sortEventsDate);
    return {
      totalPrice: this.#getTotalBasePriceWithOffers(sortableUserEvents),
      journeyDates: this.#getJourneyDates(sortableUserEvents),
      travelRoute: this.#getTravelRoute(sortableUserEvents),
    };
  }

  #getTotalBasePriceWithOffers(sortableUserEvents) {
    return sortableUserEvents.reduce((accumulator, currentItem) => {
      let totalPrice = currentItem.basePrice;
      currentItem.offers.forEach((offer) => {
        if (offer.isActive) {
          totalPrice += offer.price;
        }
      });
      return accumulator + totalPrice;
    }, 0);
  }

  #getJourneyDates(sortableUserEvents) {
    if (!Array.isArray(sortableUserEvents) || sortableUserEvents.length === 0) {
      return null;
    }

    return {
      journeyStart: sortableUserEvents[0].dateFrom,
      journeyEnd: sortableUserEvents[sortableUserEvents.length - 1].dateTo,
    };
  }

  #getTravelRoute(sortableUserEvents) {
    if (!Array.isArray(sortableUserEvents) || sortableUserEvents.length === 0) {
      return null;
    }

    const destinations = sortableUserEvents.map((item) => item.destination.name);
    if (destinations.length === 1) {
      return destinations;
    }
    if (destinations.length <= 3) {
      return destinations.join(' - ');
    } else {
      return `${destinations[0]} ... ${destinations[destinations.length - 1]}`;
    }
  }

}
