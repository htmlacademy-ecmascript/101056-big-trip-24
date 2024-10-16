import EventsConnector from './events-connector';
import Observable from '../framework/observable.js';

export default class EventsModel extends Observable {
  #EventsConnector = new EventsConnector;
  #eventsList = this.#EventsConnector.userEvents;
  #destinationsData = this.#EventsConnector.destinationsData;
  #offersMap = this.#EventsConnector.offersMap;

  get userEvents () {
    return this.#eventsList;
  }

  get destinationsData() {
    return this.#destinationsData;
  }

  findDestinationData = (destinationId) => this.#destinationsData.find((destination) => destination.id === destinationId);

  getOffersMapByType = (type) => this.#offersMap.get(type) || null;

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
