import {createElement} from '../framework/render';

function createNewTripEventsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class NewEventsListView {
  getTemplate () {
    return createNewTripEventsListTemplate();
  }

  getElement () {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement () {
    this.element = null;
  }
}
