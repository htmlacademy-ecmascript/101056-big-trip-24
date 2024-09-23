import AbstractView from '../framework/view/abstract-view';

function createNewTripEventsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class NewEventsListView extends AbstractView {
  get template () {
    return createNewTripEventsListTemplate();
  }
}
