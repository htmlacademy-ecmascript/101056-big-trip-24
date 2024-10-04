import { render } from '../framework/render.js';
import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import EventPresenter from './event-presenter.js';
import NoEventsView from '../view/no-events-view.js';


export default class BoardPresenter {
  #container = null;
  #eventsModel = null;

  #sortComponent = new NewTripSortView();
  #eventsListComponent = new NewEventsListView();

  #eventsList = [];

  constructor ({container, eventsModel}) {
    this.#container = container;
    this.#eventsModel = eventsModel;
  }

  init () {
    this.#eventsList = [...this.#eventsModel.userEvents];

    this.#renderBoard();
  }

  #renderEvent(inputUserEvent) {
    const eventPresenter = new EventPresenter({
      container: this.#eventsListComponent.element,
    });
    eventPresenter.init(inputUserEvent);
  }

  #renderNoEvents() {
    render (new NoEventsView(), this.#container);
  }

  #renderBoard () {
    render(this.#sortComponent, this.#container);

    if (this.#eventsList.length === 0) {
      this.#renderNoEvents();
      return;
    }

    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }
  }
}
