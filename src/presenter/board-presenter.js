import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils/common.js';
import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
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
    const escKeyDownHandler = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceEditFormToEventCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const eventCardComponent = new NewEventsItemView({
      userEvent: inputUserEvent,
      onClick: () => {
        replaceEventCardToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editFormComponent = new NewEventEditElementView({
      userEvent: inputUserEvent,
      onClick: () => {
        replaceEditFormToEventCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceEventCardToEditForm () {
      replace(editFormComponent, eventCardComponent);
    }

    function replaceEditFormToEventCard () {
      replace(eventCardComponent, editFormComponent);
    }

    render(eventCardComponent, this.#eventsListComponent.element);
  }

  #renderBoard () {
    render(this.#sortComponent, this.#container);

    if (this.#eventsList.length === 0) {
      render (new NoEventsView(), this.#container);
      return;
    }

    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }
  }
}
