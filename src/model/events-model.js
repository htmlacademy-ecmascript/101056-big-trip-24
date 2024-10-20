import EventsConnector from './events-connector';
import Observable from '../framework/observable.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #EventsConnector = new EventsConnector;
  #eventsList = this.#EventsConnector.userEvents;
  #destinationsData = this.#EventsConnector.destinationsData;
  #offersMap = this.#EventsConnector.offersMap;

  constructor({eventsApiService}) {
    super();
    this.#eventsApiService = eventsApiService;

    this.#eventsApiService.userEvents.then((events) => {
      console.log(events);
      // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
      // а ещё на сервере используется snake_case, а у нас camelCase.
      // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
      // Есть вариант получше - паттерн "Адаптер"
    });
  }

  get userEvents () {
    return this.#eventsList;
  }

  get destinationsData () {
    return this.#destinationsData;
  }

  #generateDefaultEvent = () => {
    const defaultType = 'flight';
    const defaultOffers = this.getOffersMapByType(defaultType);
    return {
      id: '',
      basePrice: 0,
      dateFrom: '',
      dateTo: '',
      destination: {},
      isFavorite: false,
      offers: defaultOffers,
      type: defaultType,
    };
  };

  get defaultEvent () {
    return this.#generateDefaultEvent();
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
