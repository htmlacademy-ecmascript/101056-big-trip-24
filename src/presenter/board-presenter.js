import {render} from '../framework/render.js';

import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';

const EDIT_ELEMENT_ID = 0;


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

    render(new NewEventEditElementView({
      eventsList: this.#eventsList[EDIT_ELEMENT_ID]
    }),
    this.#eventsListComponent.element);

    for (let i = 0; i < this.#eventsList.length; i ++) {
      render(new NewEventsItemView({
        eventsList: this.#eventsList[i]
      }),
      this.#eventsListComponent.element);
    }

  }
}
