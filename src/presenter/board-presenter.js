import { render } from '../framework/render.js';
import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortEventsPrice, sortEventsTime } from '../utils/event.js';


export default class BoardPresenter {
  #container = null;
  #eventsModel = null;

  #sortComponent = null;
  #eventsListComponent = new NewEventsListView();

  #eventPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #findDestinationData = null;
  #destinationsData = null;
  #getOffersMapByType = null;

  constructor ({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#findDestinationData = this.#eventsModel.findDestinationData;
    this.#destinationsData = this.#eventsModel.destinationsData;
    this.#getOffersMapByType = this.#eventsModel.getOffersMapByType;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  get eventsList () {
    switch (this.#currentSortType) {
      case SortType.PRICE:
        return [...this.#eventsModel.userEvents].sort(sortEventsPrice);
      case SortType.TIME:
        return [...this.#eventsModel.userEvents].sort(sortEventsTime);
    }
    return this.#eventsModel.userEvents;
  }

  init () {
    this.#renderBoard();
    this.#renderSort();
  }

  #renderEvent(inputUserEvent) {
    const eventPresenter = new EventPresenter({
      container: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      findDestinationData: this.#findDestinationData,
      destinationsData: this.#destinationsData,
      getOffersMapByType: this.#getOffersMapByType,
    });
    eventPresenter.init(inputUserEvent);
    this.#eventPresenters.set(inputUserEvent.id, eventPresenter);
  }

  #renderNoEvents() {
    render (new NoEventsView(), this.#container);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === undefined || this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearEventList();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new NewTripSortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container, 'AFTERBEGIN');
  }

  #renderBoard () {
    if (this.eventsList.length === 0) {
      this.#renderNoEvents();
      return;
    }

    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.eventsList.length; i++) {
      this.#renderEvent(this.eventsList[i]);
    }
  }

  // #handleEventChange = (updatedEvent) => {
  //   this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  // };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#eventsModel.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

}
