import AbstractView from '../framework/view/abstract-view';

function createNoEventsViewTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class NoEventsView extends AbstractView {
  get template () {
    return createNoEventsViewTemplate();
  }
}
