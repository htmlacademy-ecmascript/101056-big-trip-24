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

}
