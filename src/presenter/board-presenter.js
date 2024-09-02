import {render} from '../framework/render.js';

import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
import NewEventAddElementView from '../view/new-event-add-element-view.js';


export default class BoardPresenter {
  sortComponent = new NewTripSortView();
  eventsListComponent = new NewEventsListView();

  constructor ({container, eventsModel}) {
    this.container = container;
    this.eventsModel = eventsModel;
  }

  init () {
    this.events = [...this.eventsModel.getEvents()];

    render(this.sortComponent, this.container);
    render(this.eventsListComponent, this.container);
    render(new NewEventAddElementView(), this.eventsListComponent.getElement(), 'AFTERBEGIN');
    render(new NewEventEditElementView(), this.eventsListComponent.getElement());

    for (let i = 0; i < this.events.length; i ++) {
      render(new NewEventsItemView({event: this.events[i]}), this.eventsListComponent.getElement());
    }

  }
}
