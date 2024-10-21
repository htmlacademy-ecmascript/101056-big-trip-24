import Observable from '../framework/observable.js';
import EventsConnector from './events-connector.js';
import { UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #eventsConnector = null;
  #eventsList = [];
  #destinationsData = [];
  #offersMap = new Map();
  #defaultEvent = null;

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
    }
    this._notify(UpdateType.INIT);
  }

  findDestinationData = (destinationId) => this.#destinationsData.find((destination) => destination.id === destinationId);

  getOffersMapByType = (type) => this.#offersMap.get(type) || null;

  get userEvents () {
    return this.#eventsList;
  }

  get destinationsData () {
    return this.#destinationsData;
  }

  get defaultEvent () {
    return this.#defaultEvent;
  }

  updateEvent(updateType, update) {
    const index = this.#eventsList.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting event');
    }

    this.#eventsList = [
      ...this.#eventsList.slice(0, index),
      update,
      ...this.#eventsList.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#eventsList = [
      update,
      ...this.#eventsList,
    ];

    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    const index = this.#eventsList.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    this.#eventsList = [
      ...this.#eventsList.slice(0, index),
      ...this.#eventsList.slice(index + 1),
    ];

    this._notify(updateType);
  }

}
