import EventsConnector from './events-connector';

export default class EventsModel {
  #EventsConnector = new EventsConnector;
  #eventsList = this.#EventsConnector.userEvents;
  #destinationsList = this.#EventsConnector.destinationsList;
  #offersMap = this.#EventsConnector.offersMap;

  get userEvents () {
    return this.#eventsList;
  }

  getDestinationsData = () => this.#destinationsList;

  findDestinationData = (destinationId) => this.#destinationsList.find((destination) => destination.id === destinationId);

  getOffersMapByType = (type) => this.#offersMap.get(type) || null;

}
