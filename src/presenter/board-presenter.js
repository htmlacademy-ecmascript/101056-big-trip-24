import { render, remove } from '../framework/render.js';
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
  #noEventComponent = new NoEventsView();
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
    render (this.#noEventComponent, this.#container);
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === undefined || this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new NewTripSortView({
      currentSortType: this.#currentSortType,
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
    this.#renderSort();
  }

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noEventComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleViewAction = (actionType, updateType, update) => {
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
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventsModel.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

}
