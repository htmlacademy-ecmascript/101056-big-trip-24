import { render, remove } from '../framework/render.js';
import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view.js';
import NewEventPresenter from './new-event-presenter.js';
import LoadingView from '../view/loading-view.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { sortEventsPrice, sortEventsTime, sortEventsDate } from '../utils/event.js';
import { filter } from '../utils/filter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class BoardPresenter {
  #container = null;
  #eventsModel = null;
  #filterModel = null;

  #loadingComponent = new LoadingView();
  #sortComponent = null;
  #noEventComponent = null;
  #eventsListComponent = new NewEventsListView();

  #eventPresenters = new Map();
  #newEventPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #isLoadingDataError = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #findDestinationData = null;
  #destinationsData = null;
  #getOffersMapByType = null;
  #defaultEvent = null;

  constructor ({container, filterModel, eventsModel, onNewEventDestroy}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#filterModel = filterModel;
    this.#findDestinationData = this.#eventsModel.findDestinationData;
    this.#getOffersMapByType = this.#eventsModel.getOffersMapByType;

    this.#newEventPresenter = new NewEventPresenter({
      userEvent: this.#defaultEvent,
      eventListContainer: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewEventDestroy,
      findDestinationData: this.#findDestinationData,
      destinationsData: this.#destinationsData,
      getOffersMapByType: this.#getOffersMapByType,
    });

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  #renderEvent(inputUserEvent) {
    const destinationsData = this.#eventsModel.destinationsData;
    const eventPresenter = new EventPresenter({
      container: this.#eventsListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      findDestinationData: this.#findDestinationData,
      destinationsData: this.#destinationsData,
      getOffersMapByType: this.#getOffersMapByType,
    });
    eventPresenter.init(inputUserEvent, destinationsData);
    this.#eventPresenters.set(inputUserEvent.id, eventPresenter);
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
    return filteredEvents.sort(sortEventsDate);
  }

  init () {
    this.#renderBoard();
  }

  createEvent() {
    this.#currentSortType = SortType.DEFAULT;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    const destinationsData = this.#eventsModel.destinationsData;
    const defaultEvent = this.#eventsModel.defaultEvent;
    this.#newEventPresenter.init(defaultEvent, destinationsData);
  }

  #renderNoEvents() {
    this.#isLoadingDataError = this.#eventsModel.isLoadingDataError;
    this.#noEventComponent = new NoEventsView({
      filterType: this.#filterType,
      isLoadingDataError: this.#isLoadingDataError,
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    remove(this.#loadingComponent);
    if (this.#noEventComponent) {
      remove(this.#noEventComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventPresenters.get(update.id).setSaving();
        try {
          await this.#eventsModel.updateEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_EVENT:
        this.#newEventPresenter.setSaving();
        try {
          await this.#eventsModel.addEvent(updateType, update);
        } catch(err) {
          this.#newEventPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#eventPresenters.get(update.id).setDeleting();
        try {
          await this.#eventsModel.deleteEvent(updateType, update);
        } catch(err) {
          this.#eventPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

}
