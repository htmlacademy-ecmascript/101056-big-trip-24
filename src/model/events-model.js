import EventsConnector from './events-connector';

export default class EventsModel {
  #EventsConnector = new EventsConnector;
  #eventsList = this.#EventsConnector.userEvents;

  get userEvents () {
    return this.#eventsList;
  }
}
