import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view.js';
import { SortType } from '../const.js';
import { sortEventsPrice, sortEventsTime } from '../utils/event.js';


export default class BoardPresenter {
  #container = null;
  #eventsModel = null;

  #sortComponent = null;
  #eventsListComponent = new NewEventsListView();

  #eventsList = [];
  #eventPresenters = new Map();
  #currentSortType = SortType.DEFAULT;
  #sourcedBoardEvents = [];
  #findDestinationData = null;
  #getDestinationsData = null;
  #getOffersMapByType = null;

  constructor ({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
    this.#findDestinationData = this.#eventsModel.findDestinationData;
    this.#getDestinationsData = this.#eventsModel.getDestinationsData;
    this.#getOffersMapByType = this.#eventsModel.getOffersMapByType;
  }

  init () {
    this.#eventsList = [...this.#eventsModel.userEvents];
    this.#sourcedBoardEvents = [...this.#eventsModel.userEvents];
    this.#renderBoard();
    this.#renderSort();
  }

  #renderEvent(inputUserEvent) {
    const eventPresenter = new EventPresenter({
      container: this.#eventsListComponent.element,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange,
      findDestinationData: this.#findDestinationData,
      getDestinationsList: this.#getDestinationsData,
      getOffersMapByType: this.#getOffersMapByType,
    });
    eventPresenter.init(inputUserEvent);
    this.#eventPresenters.set(inputUserEvent.id, eventPresenter);
  }

  #renderNoEvents() {
    render (new NoEventsView(), this.#container);
  }

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this.#eventsList.sort(sortEventsPrice);
        break;
      case SortType.TIME:
        this.#eventsList.sort(sortEventsTime);
        break;
      default:
        this.#eventsList = [...this.#sourcedBoardEvents];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === undefined || this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);

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
    if (this.#eventsList.length === 0) {
      this.#renderNoEvents();
      return;
    }

    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }
  }

  #handleEventChange = (updatedEvent) => {
    this.#eventsList = updateItem(this.#eventsList, updatedEvent);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

}
