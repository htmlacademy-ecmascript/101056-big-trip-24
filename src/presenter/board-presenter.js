import {render} from '../framework/render.js';

import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';


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

    render(this.#sortComponent, this.#container);
    render(this.#eventsListComponent, this.#container);

    for (let i = 0; i < this.#eventsList.length; i++) {
      this.#renderEvent(this.#eventsList[i]);
    }
  }

  #renderEvent(inputUserEvent) {
    const eventComponent = new NewEventsItemView({
      userEvent: inputUserEvent,
      onClick: () => this.#handleRollupButtonItemClick(eventComponent, inputUserEvent)
    });
    render(eventComponent, this.#eventsListComponent.element);
  }

  #renderEditEventComponent(inputUserEvent, eventComponent) {
    const eventEditComponent = new NewEventEditElementView({
      userEvent: inputUserEvent,
      onClick: () => this.#handleRollupButtonEditClick(eventEditComponent, inputUserEvent)
    });
    eventComponent.removeEventListeners();
    eventComponent.element.replaceWith(eventEditComponent.element);
  }

  #handleRollupButtonItemClick = (eventComponent, inputUserEvent) => {
    this.#renderEditEventComponent(inputUserEvent, eventComponent);
  };

  #handleRollupButtonEditClick = (eventEditComponent, inputUserEvent) => {
    const eventComponent = new NewEventsItemView({
      userEvent: inputUserEvent,
      onClick: () => this.#handleRollupButtonItemClick(eventComponent, inputUserEvent)
    });
    eventEditComponent.removeEventListeners();
    eventEditComponent.element.replaceWith(eventComponent.element);
  };
}
