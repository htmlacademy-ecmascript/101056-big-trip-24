import EventsConnector from './events-connector';

export default class EventsModel {
  #EventsConnector = new EventsConnector;
  #eventsList = this.#EventsConnector.userEvents;
  #destinationsList = this.#EventsConnector.destinationsList;

  get userEvents () {
    return this.#eventsList;
  }

  getDestinationsData = () => this.#destinationsList;
  findDestinationData = (destinationId) => this.#destinationsList.find((destination) => destination.id === destinationId);

}
