import {render} from '../framework/render.js';

import NewTripSortView from '../view/new-sort-container-view.js';
import NewEventsListView from '../view/new-events-list-view.js';
import NewEventsItemView from '../view/new-events-item-view.js';
import NewEventEditElementView from '../view/new-event-edit-element-view.js';
// import NewEventAddElementView from '../view/new-event-add-element-view.js';

const EDIT_ELEMENT_ID = 0;


export default class BoardPresenter {
  sortComponent = new NewTripSortView();
  eventsListComponent = new NewEventsListView();

  constructor ({container, eventsModel}) {
    this.container = container;
    this.eventsModel = eventsModel;
  }

  init () {
    this.eventsList = [...this.eventsModel.getUserEvents()];

    render(this.sortComponent, this.container);
    render(this.eventsListComponent, this.container);
    // render(new NewEventAddElementView(), this.eventsListComponent.getElement(), 'AFTERBEGIN');

    render(new NewEventEditElementView({
      eventsList: this.eventsList[EDIT_ELEMENT_ID],
      offersList: this.eventsModel.getOffersByIds(this.eventsList[EDIT_ELEMENT_ID].offers),
      destination: this.eventsModel.getDestination(this.eventsList[EDIT_ELEMENT_ID].destination)
    }),
    this.eventsListComponent.getElement());

    for (let i = 0; i < this.eventsList.length; i ++) {
      render(new NewEventsItemView({
        eventsList: this.eventsList[i],
        offersList: this.eventsModel.getOffersByIds(this.eventsList[i].offers),
        destination: this.eventsModel.getDestination(this.eventsList[i].destination)
      }),
      this.eventsListComponent.getElement());
    }

  }
}
