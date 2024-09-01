import {createElement} from '../framework/render.js';

function createNewEventsMessageTemplate() {
  return '<p class="trip-events__msg">Loading...</p>';
}

export default class NewEventsMessageView {
  getTemplate () {
    return createNewEventsMessageTemplate();
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
