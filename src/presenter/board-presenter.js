import { render, remove } from '../framework/render.js';
import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view.js';
import NewEventPresenter from './new-event-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortEventsPrice, sortEventsTime } from '../utils/event.js';
import { filter } from '../utils/filter.js';


export default class BoardPresenter {
  #container = null;
  #eventsModel = null;
  #filterModel = null;

  #sortComponent = null;
  #noEventComponent = null;
  #eventsListComponent = new NewEventsListView();

  #eventPresenters = new Map();
  #newEventPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #findDestinationData = null;
  #destinationsData = null;
  #getOffersMapByType = null;
  #defaultEvent = null;

  constructor ({container, filterModel, eventsModel, onNewEventDestroy}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#findDestinationData = this.#eventsModel.findDestinationData;
    this.#destinationsData = this.#eventsModel.destinationsData;
    this.#getOffersMapByType = this.#eventsModel.getOffersMapByType;
    this.#defaultEvent = this.#eventsModel.defaultEvent;

    this.#newEventPresenter = new NewEventPresenter({
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
      findDestinationData: this.#findDestinationData,
      destinationsData: this.#destinationsData,
      getOffersMapByType: this.#getOffersMapByType,
      userEvent: this.#defaultEvent,
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get eventsList () {
    this.#filterType = this.#filterModel.filter;
    const userEvents = this.#eventsModel.userEvents;
    const filteredEvents = filter[this.#filterType](userEvents);

    switch (this.#currentSortType) {
      case SortType.PRICE:
        return filteredEvents.sort(sortEventsPrice);
      case SortType.TIME:
        return filteredEvents.sort(sortEventsTime);
    }
    return filteredEvents;
  }

  init () {
    this.#renderBoard();
  }

  createEvent() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newEventPresenter.init();
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
    this.#noEventComponent = new NoEventsView({
      filterType: this.#filterType
    });
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
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearBoard({resetSortType = false} = {}) {
    this.#newEventPresenter.destroy();
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);
    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

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
        this.#eventPresenters.get(data.id).init(data);
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
