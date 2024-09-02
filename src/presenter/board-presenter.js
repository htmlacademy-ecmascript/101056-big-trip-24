import {render} from '../render.js';

import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
import NewEventAddElementView from '../view/new-event-add-element-view.js';


export default class BoardPresenter {
  sortComponent = new NewTripSortView();
  eventsListComponent = new NewEventsListView();

  constructor ({container}) {
    this.container = container;
  }

  init () {
    render(this.sortComponent, this.container);
    render(this.eventsListComponent, this.container);
    render(new NewEventAddElementView(), this.eventsListComponent.getElement(), 'AFTERBEGIN');
    render(new NewEventEditElementView(), this.eventsListComponent.getElement());

    for (let i = 0; i < 3; i ++) {
      render(new NewEventsItemView(), this.eventsListComponent.getElement());
    }

  }
}
